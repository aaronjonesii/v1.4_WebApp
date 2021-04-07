from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(blank=True)
    is_frontend_admin = models.BooleanField(
        'frontend admin',
        default=False,
        help_text='Designates whether this user has admin permissions to the frontend.'
    )
    pass
