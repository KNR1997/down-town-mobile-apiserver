# Django imports
from django.db import models

# Module imports
from .base import BaseModel


class Customer(BaseModel):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    mobile_number = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name
