import random
import string

from django.contrib.auth import logout, authenticate, login
from django.forms import model_to_dict

from .models import Training, Upload, TrainingLog, Dataset, Evaluation
from .serializers import TrainingSerializer, LogSerializer, DatasetSerializer, UploadSerializer, EvaluationSerializer
from rest_framework import generics
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .tasks import start_evaluation
from .tasks import start_training
from django.http import JsonResponse, HttpResponse
from celery.result import AsyncResult
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.http import HttpResponseNotAllowed
import json
import ast
import uuid
from rest_framework.renderers import JSONRenderer
from django.utils.encoding import smart_str
from django.views.static import serve
import os

def index(request):
    return render(request, "build/index.html")

def login_request(request):
    error = None
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/')
        else:
            error = "Invalid credentials!"
    return render(request = request, template_name = "login.html", context={"error": error})

def logout_request(request):
    logout(request)
    return redirect("/login")

def dataset(request, dataset_id=None):
    if request.method == 'POST':
        body = json.loads(request.body.decode("utf-8"))
        dataset_id = str(uuid.uuid1())
        dataset = Dataset.objects.create(
            dataset_id=dataset_id,
            name=body['name'],
            description=body['description']
        )
        serializer = DatasetSerializer(dataset)
        return JsonResponse(serializer.data)
    if request.method == 'GET':
        if dataset_id is None:
            datasets = Dataset.objects.all()
            serializer = DatasetSerializer(datasets, many=True)
            return JsonResponse(serializer.data, safe=False)
        else:
            dataset = Dataset.objects.filter(dataset_id=dataset_id)
            serializer = DatasetSerializer(dataset)
            return JsonResponse(serializer.data, safe=False)
    return HttpResponseNotAllowed()

def save_file(file):
    file_name = file.name
    upload_id = str(uuid.uuid1())
    fs = FileSystemStorage(location=settings.DOCUMENT_ROOT)
    fs.save(upload_id, file)
    return upload_id

def delete_file(file_id):
    fs = FileSystemStorage(location=settings.DOCUMENT_ROOT)
    fs.delete(file_id)

def upload(request, upload_id: None):
    if upload_id is None and request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']
        file_name = file.name
        upload_id = save_file(file)
        upload = Upload.objects.create(upload_id=upload_id, file_name=file_name)
        serializer = UploadSerializer(upload)
        return JsonResponse(serializer.data, safe=False)
    if upload_id is not None and request.method == 'DELETE':
        Upload.objects.filter(upload_id=upload_id).delete()
        delete_file(upload_id)
        return HttpResponse(status=204)

    return HttpResponseNotAllowed()

def datasetUpload(request, dataset_id: None):
    if dataset_id is not None and request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']
        file_name = file.name
        upload_id = save_file(file)
        upload = Upload.objects.create(upload_id=upload_id, file_name=file_name, dataset_id=dataset_id)
        serializer = UploadSerializer(upload)
        return JsonResponse(serializer.data, safe=False)
    if dataset_id is not None and request.methos == 'GET':
        uploads = Upload.objects.filter(dataset_id=dataset_id)
        serializer = UploadSerializer(uploads, many=True)
        return JsonResponse(serializer.data, safe=False)
    return HttpResponseNotAllowed()

def datasetDetails(request, dataset_id: None):
    if dataset_id is not None and request.method == 'GET':
        dataset = Dataset.objects.get(dataset_id=dataset_id)
        uploads = Upload.objects.filter(dataset_id=dataset_id)
        dataset_serializer = DatasetSerializer(dataset)
        upload_serializer = UploadSerializer(uploads, many=True)
        response = {
            'dataset': dataset_serializer.data,
            'uploads': upload_serializer.data
        }
        return JsonResponse(response)
    return HttpResponseNotAllowed()

def datasetInfo(request):
    datasets = Dataset.objects.all()
    response = []
    for dataset in datasets:
        uploads = Upload.objects.filter(dataset_id=dataset.dataset_id)
        if len(uploads) > 0:
            upload_serializer = UploadSerializer(uploads, many=True)
            dataset_info = {
                'name': dataset.name,
                'uploads': upload_serializer.data
            }
            response.append(dataset_info)
    return JsonResponse(response, safe=False)

def training(request, training_id=None):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        model = body['model']
        fs = FileSystemStorage(location=settings.DOCUMENT_ROOT)
        training_file = fs.path(body['training_set'])
        validation_file = fs.path(body['validation_set'])
        hyperparams = body['model_params']
        features = body['featurization_params']

        task = start_training.delay(model, training_file, validation_file, hyperparams, features)

        training = Training.objects.create(
            task_id=task.id,
            name=body['name'],
            description=body['description'],
            model=body['model'],
            status='PENDING',
            model_params=json.dumps(hyperparams),
            featurization_params=json.dumps(features),
            training_set=body['training_set'],
            validation_set=body['validation_set']
        )
        serializer = TrainingSerializer(training)
        return JsonResponse(serializer.data)

    if request.method == 'GET' and training_id is None:
        trainings = Training.objects.all()
        serializer = TrainingSerializer(trainings, many=True)
        return JsonResponse(serializer.data, safe=False)
    if request.method == 'GET':
        training = Training.objects.get(task_id=training_id)
        serializer = TrainingSerializer(training)
        return JsonResponse(serializer.data, safe=False)

    return HttpResponseNotAllowed()

def evaluation(request, evaluation_id=None):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        fs = FileSystemStorage(location=settings.DOCUMENT_ROOT)
        test_file = fs.path(body['test_set'])
        training_id = body['training_id']
        training = Training.objects.get(task_id = training_id)
        features = json.loads(training.featurization_params)
        task = start_evaluation.delay(training.model, test_file, training_id, features)

        evaluation = Evaluation.objects.create(
            task_id=task.id,
            training_id=training_id,
            name=body['name'],
            model=training.model,
            status='PENDING',
            test_set=body['test_set']
        )
        serializer = EvaluationSerializer(evaluation)
        return JsonResponse(serializer.data)
    if request.method == 'GET' and evaluation_id is None:
        evaluations = Evaluation.objects.all()
        serializer = EvaluationSerializer(evaluations, many=True)
        return JsonResponse(serializer.data, safe=False)
    if request.method == 'GET':
        evaluation = Evaluation.objects.get(task_id=evaluation_id)
        serializer = EvaluationSerializer(evaluation)
        return JsonResponse(serializer.data, safe=False)

    return HttpResponseNotAllowed()

def evaluationDownload(request, evaluation_id=None):
    path_to_file = settings.DOCUMENT_ROOT + "evaluation/{}/{}".format(evaluation_id, 'prediction.sdf')
    return serve(request, os.path.basename(path_to_file), os.path.dirname(path_to_file))
