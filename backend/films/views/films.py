import datetime

from blog.views.post import IsFrontendAdmin
from rest_framework import permissions, viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes

from ..serializers import AnimeSerializer, MovieSerializer, ShowSerializer
from ..models import Anime, Movie, Show
from django.http import JsonResponse, HttpResponse
from ..films_db import FilmDatabase
import os
from django.core.cache import cache
from asgiref.sync import sync_to_async, async_to_sync
import asyncio
from rest_framework.views import APIView
from rest_framework.response import Response
import json


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class AnimeViewSet(viewsets.ModelViewSet):
    """
        CRUD endpoint for frontend admin anime shows.
    """
    queryset = Anime.objects.order_by('-last_updated')
    serializer_class = AnimeSerializer
    permission_classes = (permissions.IsAuthenticated, IsFrontendAdmin)
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']
    pagination_class = StandardResultsSetPagination


class MovieViewSet(viewsets.ModelViewSet):
    """
        CRUD endpoint for frontend admin movies.
    """
    queryset = Movie.objects.order_by('-released')
    serializer_class = MovieSerializer
    # permission_classes = (permissions.IsAuthenticated, IsFrontendAdmin)
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']
    pagination_class = StandardResultsSetPagination


class ShowViewSet(viewsets.ModelViewSet):
    """
        CRUD endpoint for frontend admin tv shows.
    """
    queryset = Show.objects.order_by('-last_updated')
    serializer_class = ShowSerializer
    permission_classes = (permissions.IsAuthenticated, IsFrontendAdmin)
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']
    pagination_class = StandardResultsSetPagination

# TODO: Combine below into Viewset for films get and update methods
# TODO: Fix the below line to work
# @permission_classes([permissions.IsAuthenticated, IsFrontendAdmin])
async def admin_films_view(request):
    """ Returns number of films in database and last time it was updated """
    try:
        anime_count = await _get_film_count('anime')
        show_count = await _get_film_count('show')
        movie_count = await _get_film_count('movie')
        last_updated = await get_last_updated()
        response = {
            'anime_count': anime_count,
            'show_count': show_count,
            'movie_count': movie_count,
            'last_updated': last_updated,
        }
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse(status=503, data={'status': 'error', 'message': str(e)})


@permission_classes([permissions.IsAuthenticated, IsFrontendAdmin])
async def admin_update_films(request):
    """ Update Film Database """
    try:
        new_anime_count = await _update_film_database('anime')
        new_show_count = await _update_film_database('show')
        new_movie_count = await _update_film_database('movie')
        last_updated = datetime.datetime.now().strftime('%c')
        await set_last_updated(last_updated)
        response = {
            'new_anime_count': new_anime_count,
            'new_show_count': new_show_count,
            'new_movie_count': new_movie_count,
            'last_updated': last_updated,
        }
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse(status=503, data={'status': 'error', 'message': str(e)})


async def _get_film_count(film_type):
    host = 'localhost'
    user = os.environ.get('BACKEND_DB_USER')
    passwd = os.environ.get('BACKEND_DB_PASSWORD')
    database = os.environ.get('BACKEND_DB_NAME')
    film_database = FilmDatabase(host, user, passwd, database, film_type)
    cursor = film_database.cursor()
    return film_database.show_film_count(cursor)


@sync_to_async()
def get_last_updated():
    return cache.get('FILMS_LAST_UPDATED')


@sync_to_async()
def set_last_updated(last_updated):
    cache.set('FILMS_LAST_UPDATED', last_updated, None)


async def _update_film_database(film_type):
    host = 'localhost'
    user = os.environ.get('BACKEND_DB_USER')
    passwd = os.environ.get('BACKEND_DB_PASSWORD')
    database = os.environ.get('BACKEND_DB_NAME')
    film_database = FilmDatabase(host, user, passwd, database, film_type)
    cursor = film_database.cursor()
    film_database.use_database(cursor)
    return film_database.update_database(cursor)
