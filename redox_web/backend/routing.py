from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from .consumer import TrainingDetailsConsumer, TrainingListConsumer, EvaluationListConsumer

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path("ws/training/<str:task_id>", TrainingDetailsConsumer,name="training-details"),
        path("ws/training", TrainingListConsumer, name="training-list"),
        path("ws/evaluation", EvaluationListConsumer, name="evaluation-list"),
    ])
})