from rest_framework import serializers
from .models import Training, TrainingLog, Dataset, Upload, Evaluation

class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ('task_id', 'name', 'description', 'model', 'status', 'progress', 'loss', 'creation_time', 'start_time',
                  'end_time', 'error', 'model_params', 'featurization_params', 'training_set', 'validation_set')

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ('task_id', 'name', 'model', 'status', 'start_time', 'end_time', 'error', 'test_set', 'training_id')

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('dataset_id', 'name', 'description')

class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upload
        fields = ('upload_id', 'file_name')

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingLog
        fields = ('task_id', 'epoch', 'loss')