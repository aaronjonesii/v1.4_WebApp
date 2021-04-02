"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 3.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_6^!n9*85txi4i6*$(^y!jsb6xao635xd@d*zp@oox$73_fxrv'
# TODO: Place in system environment

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# TODO: Place in system environment

ALLOWED_HOSTS = []
# TODO: Place in system environment

# CORS_ORIGIN_WHITELIST = os.environ.get('CORS_ORIGIN_WHITELIST').split(',')
CORS_ORIGIN_WHITELIST = ['http://localhost:4200']

AUTH_USER_MODEL = 'blog.User'

AUTHENTICATION_BACKENDS = [
    'backend.authbackends.EmailorUsernameModelBackend',
    'django.contrib.auth.backends.ModelBackend',  # Used by Auth0
    'django.contrib.auth.backends.RemoteUserBackend',  # Used by Auth0
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'blog',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Used by Auth0
    'django.contrib.auth.middleware.RemoteUserMiddleware',  # Used by Auth0
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.routing.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'NAME': 'backend',
        'ENGINE': 'mysql.connector.django',
        'USER': 'anonymous',
        'PASSWORD': 'anonymous',
        'OPTIONS': {'autocommit': True, 'charset': 'utf8mb4',},
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

# Django REST Simple JWT
# https://github.com/davesque/django-rest-framework-simplejwt

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',  # Used by Auth0
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',  # Used by Auth0
        'rest_framework.authentication.SessionAuthentication',  # Used by Auth0
        'rest_framework.authentication.BasicAuthentication',  # Used by Auth0
    )
}

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
#
#     'AUTH_HEADER_TYPES': ('Bearer',),
#     'USER_ID_FIELD': 'username',
#     'USER_ID_CLAIM': 'username',
# }

JWT_AUTH = {
    'JWT_PAYLOAD_GET_USERNAME_HANDLER':
        'blog.utils.jwt_get_username_from_payload_handler',
    'JWT_DECODE_HANDLER':
        'blog.utils.jwt_decode_token',
    'JWT_ALGORITHM': 'RS256',
    'JWT_AUDIENCE': 'https://api.anonsys.tech',
    'JWT_ISSUER': 'https://anonsys.auth0.com/',
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
}

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    # dsn=os.environ.get('SENTRY_URL', ''),
    dsn="https://0f07ef4a0dc241bebe70c88f871a49a7@o214341.ingest.sentry.io/1810585",
    integrations=[DjangoIntegration()]
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'backend_cache',
    }
}

# TODO: Place all in system environment
# Auth0 Management
AUTH0_DOMAIN = 'https://anonsys.auth0.com'
AUTH0_AUDIENCE = 'https://anonsys.auth0.com/api/v2'
AUTH0_CLIENT_ID = 'w6ClmoCh2SALilP7pFppCvEw6nfwoYOY'
AUTH0_CLIENT_SECRET = 'C_C0FYNu3MlsbZn0pgKp9sy7NwTgcemUBM8yT-aDqwbEPfPsDARkJ3wqAMdSw45e'
AUTH0_GRANT_TYPE = 'client_credentials'  # OAuth 2.0 flow to use
