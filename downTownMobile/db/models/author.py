# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Author(BaseModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    language = models.CharField(max_length=10, default='en', blank=True, null=True)
    translated_languages = models.JSONField(default=default_translated_languages, blank=True, null=True)
    products_count = models.PositiveIntegerField(default=0)
    is_approved = models.BooleanField(default=True)
    bio = models.TextField(null=True, blank=True)
    languages = models.CharField(max_length=50, null=True, blank=True)
    image = models.JSONField(default=dict, blank=True, null=True)
    cover_image = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return self.name
