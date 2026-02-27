# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Shop(BaseModel):
    name = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    settings = models.JSONField(default=dict, blank=True, null=True)
    cover_image = models.JSONField(default=dict, blank=True, null=True)
    logo = models.JSONField(default=dict, blank=True, null=True)
    owner = models.ForeignKey(
        'db.User',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='shops'
    )
    orders_count = models.PositiveIntegerField(default=0)
    products_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
