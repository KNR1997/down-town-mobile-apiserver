# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Tag(BaseModel):
    name = models.CharField(max_length=255, blank=True, null=True)
    language = models.CharField(max_length=10, default='en', blank=True, null=True)
    translated_languages = models.JSONField(default=default_translated_languages, blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    image = models.JSONField(default=dict, blank=True, null=True)
    icon = models.JSONField(default=dict, blank=True, null=True)

    type = models.ForeignKey('db.Type', on_delete=models.SET_NULL, null=True, )

    def __str__(self):
        return self.name
