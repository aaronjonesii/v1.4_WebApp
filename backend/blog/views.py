from rest_framework import viewsets, renderers
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response


from .serializers import PostSerializer, TagSerializer, CategorySerializer, UserSerializer, NewsletterSerializer
from .models import Tag, Post, Category, NewsletterSubscriber

from rest_framework import views, status
from rest_framework import permissions

from requests import get # IP


# Used by Auth0
from functools import wraps
import jwt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from django.core.cache import cache
from .utils import refresh_auth0_token, is_auth0_token_valid, update_auth0_user
import json


class NewsletterSubscription(viewsets.ModelViewSet):
    """
    Subscribe email to newsletter.
    """
    serializer_class = NewsletterSerializer
    queryset = NewsletterSubscriber.objects.all().filter(isactive=True)

    def perform_create(self, serializer):
        email = self.request.data['email']
        queryset = NewsletterSubscriber.objects.filter(email=email).filter(isactive=True)
        if queryset.exists():
            raise ValidationError('You are already subscribed!')
        else:
            serializer.save(isactive=True)


class NewsletterUnsubscription(views.APIView):
    def post(self, request):
        ip = get_client_ip(request)
        email = request.data.get('email', None)
        if email is None:
            response = {"error": "Invalid context!"}  # Correct dictionary key was not found
            raise ValidationError(response)
        else:
            existingSubscriber = NewsletterSubscriber.objects.filter(email=email)
            if existingSubscriber.exists():
                existingSubscriber = existingSubscriber.first()
                if existingSubscriber.isactive:
                    existingSubscriber.isactive = False
                    existingSubscriber.save()
                    response = {"success": f"Email unsubscribed!"}  # Successfully unsubscribed email
                else:
                    response = {"success": f"Email not subscribed!"}  # Email was already unsubscribed
            else:
                response = {"error": f"Invalid email!"}  # Email not found in the system
                raise ValidationError(response)
            return Response(response)


class PostViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for blogging platform.
    """
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def byline(self, request, *args, **kwargs):
        post = self.get_object()
        return Response(post.byline)

    @action(detail=True)
    def tags(self, request, *args, **kwargs):
        post = self.get_object()
        serializer = TagSerializer(post.tags, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def related_posts(self, request, *args, **kwargs):
        post = self.get_object()
        related_posts = []
        for tag in post.tags:
            related_posts_from_tag = Post.objects.filter(tag__name=tag)
            for related_post in related_posts_from_tag:
                if post != related_post and related_post not in related_posts:
                    related_posts.append(related_post)
        # print(f'Post: {post} \nRelated posts: {related_posts}')
        serializer = PostSerializer(related_posts, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class TagViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for tags.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)



@api_view()
@permission_classes([AllowAny])
def weatherView(request):
    ip = get_client_ip(request)
    locationKey = getAccuWeatherLocationKey(ip)
    if locationKey == None:
        return Response({"error": "Invalid locationKey!"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        response = getCurrentConditions(locationKey)
        # print(f'IP: {ip}\nlocationKey: {locationKey}\n Response: {response}')
        return Response(response)


@api_view()
@permission_classes([AllowAny])
def forecastWeatherView(request):
    ip = get_client_ip(request)
    locationKey = getAccuWeatherLocationKey(ip)
    if locationKey == None:
        return Response({"error": "Invalid locationKey!"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        response = getFiveDayForecast(locationKey)
        return Response(response)


def getAccuWeatherLocationKey(ip=None, postal_code=None):
    ''' Get AccuWeather Location Key from Ip Address '''
    from django.conf import settings
    # API_KEY = settings.ACCUWEATHER_APIKEY
    API_KEY = 'SSnwmKXaoAt1mGH5RDuoyQ3vH0Ey9k36'
    ip = '76.20.137.56'
    url = f'http://dataservice.accuweather.com/locations/v1/cities/ipaddress?q={ip}&apikey={API_KEY}'
    resp = get(url)
    if resp.status_code == 200:
        locationKey = resp.json().get('Key')
        return locationKey
    else:
        return None


def getCurrentConditions(locationKey):
    ''' Returns current conditions data for a specific location.
    Current conditions searches require a location key.
    Please use the Locations API to obtain the location key for your desired location.
    By default, a truncated version of the current conditions data is returned.
    The full object can be obtained by passing "details=true" into the url string. '''
    API_KEY = 'SSnwmKXaoAt1mGH5RDuoyQ3vH0Ey9k36'
    fulldetails = 'true'
    url = f'http://dataservice.accuweather.com/currentconditions/v1/{locationKey}?details={fulldetails}&apikey={API_KEY}'
    try:
        resp = get(url)
        currentConditions = resp.json()[0]
        return currentConditions
    except KeyError:
        return None


def getFiveDayForecast(locationKey):
    ''' Returns an array of daily forecasts for the next 5 days for a specific location.
    Forecast searches require a location key.
    Please use the Locations API to obtain the location key for your desired location.
    By default, a truncated version of the hourly forecast data is returned.
    The full object can be obtained by passing "details=true" into the url string. '''
    API_KEY = 'SSnwmKXaoAt1mGH5RDuoyQ3vH0Ey9k36'
    fulldetails = 'true'
    url = f'http://dataservice.accuweather.com/forecasts/v1/daily/5day/{locationKey}?details={fulldetails}&apikey={API_KEY}'
    resp = get(url)
    fivedayForecast = resp.json()
    return fivedayForecast


@api_view()
@permission_classes([AllowAny])
def ipView(request):
    ''' IP View '''
    ip = get_client_ip(request)
    response = ipinfo(ip)
    return Response({'content': response})


@api_view()
@permission_classes([AllowAny])
def searchIP(request, query_ip):
    ''' IP Search View '''
    response = ipinfo(query_ip)
    return Response({'content': response})


def ipinfo(query_ip):
    ''' Get information from IP Address '''
    url = "https://ipinfo.io/"
    resp = get(url + query_ip)
    return resp.json()


def get_client_ip(request):
    ''' Get IP Address '''
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_addr = x_forwarded_for.split(',')[0]
    else:
        ip_addr = request.META.get('REMOTE_ADDR')
    return '8.8.8.8' if ip_addr == '127.0.0.1' else ip_addr


# Auth0 FUNCTIONS BELOW
def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]
    return token


def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """
    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            print(args)
            token = get_token_auth_header(args[0])
            decoded = jwt.decode(token, verify=False)
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                for token_scope in token_scopes:
                    if token_scope == required_scope:
                        return f(*args, **kwargs)
            response = JsonResponse({'message': 'You don\'t have access to this resource, Loser!'})
            response.status_code = 403
            return response
        return decorated
    return require_scope


@api_view(['POST'])
def auth0_user_update(request):
    user_update = request.body.decode('utf-8').replace('\'', '"')
    user_id = request.user
    token = cache.get('Auth0_MGMT_API_JWT')
    if token is None:
        refresh_auth0_token()
        return update_auth0_user(user_id, user_update)
    else:
        if is_auth0_token_valid(token):
            return update_auth0_user(user_id, user_update)
        else:
            refresh_auth0_token()
            return update_auth0_user(user_id, user_update)


@api_view(['GET'])
@permission_classes([AllowAny])
def public(request):
    return JsonResponse({'message': 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'})


@api_view(['GET'])
def private(request):
    return JsonResponse({'message': 'Hello from a private endpoint! You need to be authenticated to see this.'})


@api_view(['GET'])
@requires_scope('read:messages')
def private_scoped(request):
    return JsonResponse({'message': 'Hello from a private endpoint! You need to be authenticated and have a scope of '
                                    'read:messages to see this.'})
