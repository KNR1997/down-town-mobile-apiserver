# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Attribute(BaseModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    language = models.CharField(max_length=10, default='en', blank=True, null=True)
    translated_languages = models.JSONField(default=default_translated_languages, blank=True, null=True)

    def __str__(self):
        return self.name


class AttributeValue(BaseModel):
    attribute = models.ForeignKey('db.Attribute', related_name='values', on_delete=models.CASCADE)
    value = models.CharField(max_length=50)
    meta = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.attribute.name} - {self.value}"
