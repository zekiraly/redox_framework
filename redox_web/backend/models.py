from django.db import models

class Training(models.Model):
    task_id = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    model = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    progress = models.FloatField(default=0)
    loss = models.FloatField(null=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField(auto_now_add=False, null=True)
    end_time = models.DateTimeField(auto_now_add=False, null=True)
    error = models.TextField(null=True)
    model_params = models.TextField(null=True)
    featurization_params = models.TextField(null=True)
    training_set = models.CharField(max_length=100)
    validation_set = models.CharField(max_length=100)

class Evaluation(models.Model):
    task_id = models.CharField(max_length=100)
    training_id = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    start_time = models.DateTimeField(auto_now_add=False, null=True)
    end_time = models.DateTimeField(auto_now_add=False, null=True)
    error = models.TextField(null=True)
    test_set = models.CharField(max_length=100)

class TrainingLog(models.Model):
    task_id = models.CharField(max_length=100)
    epoch = models.IntegerField()
    loss = models.FloatField()

class Dataset(models.Model):
    dataset_id = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)

class Upload(models.Model):
    upload_id = models.CharField(max_length=100)
    file_name = models.CharField(max_length=100)
    dataset_id = models.CharField(max_length=100, null=True)
