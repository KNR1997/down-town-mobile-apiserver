# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Type(BaseModel):
    name = models.CharField(max_length=20)
    slug = models.CharField(max_length=20, unique=True)
    banners = models.JSONField(default=list, blank=True, null=True)
    promotional_sliders = models.JSONField(default=list, blank=True, null=True)
    icon = models.CharField(max_length=20, default='default_icon', blank=True, null=True)
    language = models.CharField(max_length=10, blank=True, null=True)
    translated_languages = models.JSONField(default=default_translated_languages, blank=True,
                                            null=True)  # Add translated_languages field
    settings = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return self.name
