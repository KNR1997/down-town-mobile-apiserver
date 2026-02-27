# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Category(BaseModel):
    name = models.CharField(max_length=255, blank=True, null=True)
    slug = models.CharField(max_length=255, blank=True, null=True)
    language = models.CharField(max_length=10, default='en', blank=True, null=True)
    translated_languages = models.JSONField(default=default_translated_languages, blank=True, null=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    details = models.TextField(null=True, blank=True)
    image = models.JSONField(default=list, blank=True, null=True)  # Assuming it's a JSON field
    icon = models.CharField(max_length=255, null=True, blank=True)
    type = models.ForeignKey('db.Type', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.name
