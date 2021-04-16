import datetime

from blog.views.post import IsFrontendAdmin
from rest_framework import permissions, viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes

from ..serializers import AnimeSerializer, MovieSerializer, ShowSerializer
from ..models import Anime, Movie, Show
from django.http import JsonResponse
from ..films_db import FilmDatabase
import os
from django.core.cache import cache


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class AnimeViewSet(viewsets.ModelViewSet):
    """
        CRUD endpoint for frontend admin anime shows.
    """
    queryset = Anime.objects.order_by('-last_updated')[:500]
    serializer_class = AnimeSerializer
    permission_classes = (permissions.IsAuthenticated, IsFrontendAdmin)
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
    queryset = Show.objects.order_by('-last_updated')[:500]
    serializer_class = ShowSerializer
    permission_classes = (permissions.IsAuthenticated, IsFrontendAdmin)
    pagination_class = StandardResultsSetPagination


@api_view()
@permission_classes([permissions.IsAuthenticated, IsFrontendAdmin])
def admin_films_view(request):
    """ Returns number of films in database and last time it was updated """
    try:
        anime_count = get_film_count('anime')
        show_count = get_film_count('show')
        movie_count = get_film_count('movie')
        last_updated = cache.get('FILMS_LAST_UPDATED')
        response = {
            'anime_count': anime_count,
            'show_count': show_count,
            'movie_count': movie_count,
            'last_updated': last_updated,
        }
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': e})


@api_view()
@permission_classes([permissions.IsAuthenticated, IsFrontendAdmin])
def admin_update_films(request):
    """ Update Film Database """
    try:
        new_anime_count = update_film_database('anime')
        new_show_count = update_film_database('show')
        new_movie_count = update_film_database('movie')
        last_updated = datetime.datetime.now().strftime('%c')
        cache.set('FILMS_LAST_UPDATED', last_updated, None)
        response = {
            'new_anime_count': new_anime_count,
            'new_show_count': new_show_count,
            'new_movie_count': new_movie_count,
            'last_updated': last_updated,
        }
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse(status=503, data={'status': 'error', 'message': str(e)})


def get_film_count(film_type):
    host = 'localhost'
    user = os.environ.get('BACKEND_DB_USER')
    passwd = os.environ.get('BACKEND_DB_PASSWORD')
    database = os.environ.get('BACKEND_DB_NAME')
    film_database = FilmDatabase(host, user, passwd, database, film_type)
    cursor = film_database.cursor()
    return film_database.show_film_count(cursor)


def update_film_database(film_type):
    host = 'localhost'
    user = os.environ.get('BACKEND_DB_USER')
    passwd = os.environ.get('BACKEND_DB_PASSWORD')
    database = os.environ.get('BACKEND_DB_NAME')
    film_database = FilmDatabase(host, user, passwd, database, film_type)
    cursor = film_database.cursor()
    film_database.use_database(cursor)
    return film_database.update_database(cursor)
