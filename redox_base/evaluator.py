from keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from .dataset import Dataset
from .model import bm_3dgcn as m
from .callback import *
from datetime import datetime
import numpy as np
import time
import csv
import keras

class Evaluator(object):
    def __init__(self, model_dir, evaluation_dir, test_set):
        self.test_data = None
        self.model = None
        self.model_dir = model_dir
        self.evaluation_dir = evaluation_dir
        self.hyper = {"test_set": test_set}
        self.log = {}

    def load_data(self, batch=128):
        self.test_data = Dataset(self.hyper["test_set"], batch=batch, mean=self.hyper["data_mean"], std=self.hyper["data_std"], max_atoms=self.hyper["num_atoms"])
        self.hyper["num_test"] = len(self.test_data.y)

    def load_model(self, model, units_conv=128, units_dense=128, num_layers=2, loss="mse", pooling="max"):
        self.model = getattr(m, model)(self.hyper)
        self.model.summary()

    def evaluate(self, model, use_multiprocessing=True, **kwargs):

        now = datetime.now()

        model_path = self.model_dir
        evaluation_path = self.evaluation_dir

        with open(model_path + "hyper.csv") as file:
            reader = csv.DictReader(file, quoting=csv.QUOTE_NONNUMERIC)
            row = next(reader)
            row['num_train'] = int(row['num_train'])
            row['num_val'] = int(row['num_val'])
            row['num_atoms'] = int(row['num_atoms'])
            row['num_features'] = int(row['num_features'])
            row['outputs'] = int(row['outputs'])
            row['batch'] = int(row['batch'])
            row['units_conv'] = int(row['units_conv'])
            row['units_dense'] = int(row['units_dense'])
            row['num_layers'] = int(row['num_layers'])

            self.hyper = {**self.hyper, **row}

        self.load_data(batch=self.hyper['batch'])
        self.test_data.set_features(**kwargs)

        self.load_model(model, units_conv=self.hyper["units_conv"], units_dense=self.hyper["units_dense"],
                        num_layers=self.hyper["num_layers"], loss=self.hyper["loss"], pooling=self.hyper["pooling"])

        test_loss = self.model.evaluate_generator(self.test_data.generator(),
                                                   use_multiprocessing=use_multiprocessing, workers=10)

        test_pred = self.model.predict_generator(self.test_data.generator(task="input_only"),
                                                  use_multiprocessing=use_multiprocessing, workers=10)

        self.test_data.save_dataset(evaluation_path, pred=test_pred, filename='prediction')
