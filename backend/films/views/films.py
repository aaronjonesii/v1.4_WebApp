from blog.views.post import IsFrontendAdmin
from rest_framework import permissions, viewsets, filters
from rest_framework.pagination import PageNumberPagination

from ..serializers import AnimeSerializer, MovieSerializer, ShowSerializer
from ..models import Anime, Movie, Show


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
