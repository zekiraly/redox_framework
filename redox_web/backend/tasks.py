from celery import shared_task, current_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from redox_base import registry
import time
from django.conf import settings

from redox_base.trainer import Trainer
from redox_base.evaluator import Evaluator
from .models import Training, TrainingLog, Evaluation
from pathlib import Path

def get_epoch_callback(task_id):
    def epoch_callback(current_epoch, epochs):
        Training.objects.filter(task_id=task_id).update(progress=1)

@shared_task(bind=True)
def start_training(self, model, training_file, validation_file, hyperparams, features):
    time.sleep(3)
    training = Training.objects.get(task_id=self.request.id)
    channel_layer = get_channel_layer()
    try:
        training.status = 'IN_PROGRESS'
        training.save()
        async_to_sync(channel_layer.group_send)(
            'training',
            {'type': 'send_status', 'task_id': self.request.id,'status': 'IN_PROGRESS'}
        )

        model_dir = settings.DOCUMENT_ROOT + "training/{}/".format(self.request.id);
        def epoch_callback(model, epoch, loss):
            progress = (epoch + 1)/hyperparams['epoch']
            async_to_sync(channel_layer.group_send)(
                'training',
                {
                    'type': 'send_progress',
                    'task_id': self.request.id,
                    'progress': progress,
                    'loss': loss
                }
            )
            training.progress = progress
            training.save()
            TrainingLog.objects.create(task_id=self.request.id, epoch=epoch, loss=loss)

        Path(model_dir).mkdir(parents=True, exist_ok=True)
        trainer = Trainer(training_file, validation_file, model_dir, epoch_callback)

        trainer.fit("model_3DGCN", **hyperparams, **features)

        training.status = 'FINISHED'
        training.save()
        async_to_sync(channel_layer.group_send)(
            'training',
            {'type': 'send_status', 'task_id': self.request.id,'status': 'FINISHED'}
        )
    except:
        training.status = 'ERROR'
        training.save()
        async_to_sync(channel_layer.group_send)(
            'training',
            {'type': 'send_status', 'task_id': self.request.id,'status': 'ERROR'}
        )

@shared_task(bind=True)
def start_evaluation(self, model, test_file, training_id, features):
    time.sleep(3)
    evaluation_id = self.request.id
    evaluation = Evaluation.objects.get(task_id=evaluation_id)
    channel_layer = get_channel_layer()

    try:
        evaluation.status = 'IN_PROGRESS'
        evaluation.save()
        async_to_sync(channel_layer.group_send)(
            'evaluation',
            {'type': 'send_status', 'task_id': self.request.id,'status': 'IN_PROGRESS'}
        )

        model_dir = settings.DOCUMENT_ROOT + "training/{}/".format(training_id)
        evaluation_dir = settings.DOCUMENT_ROOT + "evaluation/{}/".format(evaluation_id)
        Path(model_dir).mkdir(parents=True, exist_ok=True)
        Path(evaluation_dir).mkdir(parents=True, exist_ok=True)
        evaluator = Evaluator(model_dir, evaluation_dir, test_file)
        evaluator.evaluate("model_3DGCN", **features)

        evaluation.status = 'FINISHED'
        evaluation.save()
        async_to_sync(channel_layer.group_send)(
            'evaluation',
            {'type': 'send_status', 'task_id': self.request.id,'status': 'FINISHED'}
        )

    except Exception as ex:
        evaluation.status = 'ERROR'
        evaluation.save()
        async_to_sync(channel_layer.group_send)(
            'evaluation',
            {'type': 'send_status', 'task_id': self.request.id,'status': 'ERROR'}
        )