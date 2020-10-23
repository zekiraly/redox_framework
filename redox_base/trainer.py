from keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from .dataset import Dataset
from .model import bm_3dgcn as m
from .callback import *
from datetime import datetime
import numpy as np
import time
import csv
import keras


class Trainer(object):
    def __init__(self, training_set, validation_set, model_dir, epoch_callback):
        self.training_data = None
        self.validation_data = None
        self.model = None
        self.model_dir = model_dir
        self.hyper = {"training_set": training_set, "validation_set": validation_set}
        self.epoch_callback = epoch_callback
        self.log = {}

    def load_data(self, batch=128):
        self.training_data = Dataset(self.hyper["training_set"], batch=batch)
        self.hyper["data_std"] = self.training_data.std
        self.hyper["data_mean"] = self.training_data.mean


        self.validation_data = Dataset(self.hyper["validation_set"], batch=batch,
                                       mean=self.hyper["data_mean"], std=self.hyper["data_std"])

        self.hyper["num_train"] = len(self.training_data.y)
        self.hyper["num_val"] = len(self.validation_data.y)
        self.hyper["num_atoms"] = max(self.training_data.max_atoms, self.validation_data.max_atoms)
        self.hyper["num_features"] = self.training_data.num_features

        self.hyper["task"] = self.training_data.task
        self.hyper["outputs"] = self.training_data.outputs
        self.hyper["batch"] = batch

    def load_model(self, model, units_conv=128, units_dense=128, num_layers=2, loss="mse", pooling="max"):
        self.hyper["model"] = model
        self.hyper["units_conv"] = units_conv
        self.hyper["units_dense"] = units_dense
        self.hyper["num_layers"] = num_layers
        self.hyper["loss"] = loss
        self.hyper["pooling"] = pooling
        self.model = getattr(m, model)(self.hyper)
        self.model.summary()

    def fit(self, model, epoch, batch=128, fold=10, pooling="max", units_conv=128, units_dense=128, num_layers=2,
            loss="mse", monitor="val_rmse", mode="min", use_multiprocessing=True, label="", **kwargs):

        now = datetime.now()
        base_path = self.model_dir
        log_path = base_path
        results = []


        start_time = time.time()

        self.load_data(batch=batch)
        self.training_data.set_features(**kwargs)
        self.training_data.max_atoms = self.hyper["num_atoms"]
        self.validation_data.max_atoms = self.hyper["num_atoms"]
        self.hyper["num_features"] = self.training_data.num_features

        self.load_model(model, units_conv=units_conv, units_dense=units_dense, num_layers=num_layers, loss=loss,
                        pooling=pooling)

        tb_path = log_path
        epoch_callback = self.epoch_callback
        class CustomCallback(keras.callbacks.Callback):
            def on_epoch_end(self, epoch, logs=None):
                epoch_callback(self, epoch, logs["loss"])

        callbacks = []
        callbacks += [ModelCheckpoint(tb_path + "best_weight.hdf5", monitor=monitor,
                                      save_weights_only=True, save_best_only=True, period=1, mode=mode),
                      CustomCallback()]

        self.model.fit_generator(self.training_data.generator(), epochs=epoch,
                                 validation_data=self.validation_data.generator(), callbacks=callbacks,
                                 use_multiprocessing=use_multiprocessing, workers=6)
        self.hyper["train_time"] = time.time() - start_time

        train_loss = self.model.evaluate_generator(self.training_data.generator(),
                                                   use_multiprocessing=use_multiprocessing, workers=10)
        valid_loss = self.model.evaluate_generator(self.validation_data.generator(),
                                                   use_multiprocessing=use_multiprocessing, workers=10)

        results.append([train_loss[1], valid_loss[1], train_loss[2], valid_loss[2]])

        with open(tb_path + "hyper.csv", "w") as file:
            writer = csv.DictWriter(file, fieldnames=list(self.hyper.keys()), quoting=csv.QUOTE_NONNUMERIC)
            writer.writeheader()
            writer.writerow(self.hyper)

        train_pred = self.model.predict_generator(self.training_data.generator(task="input_only"),
                                                  use_multiprocessing=use_multiprocessing, workers=10)
        self.training_data.save_dataset(tb_path, pred=train_pred, filename='train')

        valid_pred = self.model.predict_generator(self.validation_data.generator(task="input_only"),
                                                  use_multiprocessing=use_multiprocessing, workers=10)
        self.validation_data.save_dataset(tb_path, pred=valid_pred, filename='valid')

        header = ["train_mae", "valid_mae", "test_mae", "train_rmse", "valid_rmse", "test_rmse"]

        with open(log_path + "raw_results.csv", "w") as file:
            writer = csv.writer(file, delimiter=",")
            writer.writerow(header)
            for r in results:
                writer.writerow(r)

        results = np.array(results)
        results = [np.mean(results, axis=0), np.std(results, axis=0)]
        with open(log_path + "results.csv", "w") as csvfile:
            writer = csv.writer(csvfile, delimiter=",")
            writer.writerow(header)
            for r in results:
                writer.writerow(r)

        print("Training Ended")