# Built in imports.
import json
# Third Party imports.
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
# Django imports.
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import AnonymousUser
# Local imports.

class TrainingDetailsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.group_name = f'task_{self.task_id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def send_message(self, event):
        await self.send(text_data="Send a custom message")

    async def websocket_disconnect(self, message):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

class TrainingListConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.group_name = 'training'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def send_progress(self, event):
        await self.send_json({
            "message_type": "UPDATE_PROGRESS",
            "task_id": event["task_id"],
            "progress": event["progress"],
            "loss": event["loss"]
        })

    async def send_status(self, event):
        await self.send_json({
            "message_type": "UPDATE_STATUS",
            "task_id": event["task_id"],
            "status": event["status"]
        })

    async def websocket_disconnect(self, message):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

class EvaluationListConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.group_name = 'evaluation'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def send_status(self, event):
        await self.send_json({
            "message_type": "UPDATE_STATUS",
            "task_id": event["task_id"],
            "status": event["status"]
        })

    async def websocket_disconnect(self, message):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )