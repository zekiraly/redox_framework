from django.urls import path
from . import views

urlpatterns = [
    path('api/training', views.training),
    path('api/training/<str:training_id>', views.training),

    path('api/evaluation', views.evaluation),
    path('api/evaluation/<str:evaluation_id>', views.evaluation),
    path('api/evaluation/<str:evaluation_id>/download', views.evaluationDownload),

    path('api/dataset', views.dataset),
    path('api/dataset/info', views.datasetInfo),
    path('api/dataset/<str:datased_id>', views.dataset),
    path('api/dataset/<str:dataset_id>/upload', views.datasetUpload),
    path('api/dataset/<str:dataset_id>/details', views.datasetDetails),

    path('api/upload', views.upload),
    path('api/upload/<str:upload_id>', views.upload),

    path("logout", views.logout_request, name="logout"),
    path("login", views.login_request, name="login"),
    path("", views.index, name="index")
]