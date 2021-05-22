"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers

from blog.views import newsletter, weather, ip, post, auth0
from films.views import films
from crypto.views import bsctoken

public_blog_list = post.PublicPostViewSet.as_view({'get': 'list'})
public_blog_detail = post.PublicPostViewSet.as_view({'get': 'retrieve'})

admin_post_list = post.AdminPostViewSet.as_view({'get': 'list'})
admin_post_detail = post.AdminPostViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})

admin_animes_list = films.AnimeViewSet.as_view({'get': 'list'})
admin_movies_list = films.MovieViewSet.as_view({'get': 'list'})
admin_shows_list = films.ShowViewSet.as_view({'get': 'list'})

blog_list = post.PostViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
blog_detail = post.PostViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

cryptotoken_list = bsctoken.CryptoTokenViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
cryptotoken_detail = bsctoken.CryptoTokenViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
cryptotoken_tags = bsctoken.TagViewSet.as_view({'get': 'list'})
bsctoken_list = bsctoken.CryptoTokenViewSet.as_view({'get': 'bsc_tokens'})

related_post = post.PostViewSet.as_view({'get': 'related_posts'})

post_byline = post.PostViewSet.as_view({'get': 'byline'})

post_tags = post.PostViewSet.as_view({'get': 'tags'})

newsletter_subscribe = newsletter.NewsletterSubscription.as_view({'post': 'create',})

router = routers.DefaultRouter()
router.register(r'tags', post.TagViewSet)
router.register(r'cats', post.CategoryViewSet)
router.register(r'crypto/swaps', bsctoken.SwapTransactionsViewSet)

ipv4pattern = '(?:(?:0|1[\d]{0,2}|2(?:[0-4]\d?|5[0-5]?|[6-9])?|[3-9]\d?)\.){3}(?:0|1[\d]{0,2}|2(?:[0-4]\d?|5[0-5]?|[6-9])?|[3-9]\d?'
ipv6pattern = '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))'
urlpatterns = [
    path('admin/', admin.site.urls),

    path('frontend/admin/blog/', admin_post_list, name='admin_post_list'),
    path('frontend/admin/blog/<uuid:pk>/', admin_post_detail, name='admin_post_detail'),

    path('frontend/admin/films/', films.admin_films_view, name='admin_films_list'),
    path('frontend/admin/films/update/', films.admin_update_films, name='admin_update_films'),
    path('frontend/admin/films/animes/', admin_animes_list, name='admin_animes_list'),
    path('frontend/admin/films/movies/', admin_movies_list, name='admin_movies_list'),
    path('frontend/admin/films/shows/', admin_shows_list, name='admin_shows_list'),

    path('user/update/', auth0.auth0_user_update, name='update_user'),

    path('public/', public_blog_list, name='public_post_list'),
    path('public/<uuid:pk>/', public_blog_detail, name='public_post_detail'),

    path('blog/', blog_list, name='post_list'),
    path('blog/<uuid:pk>/', blog_detail, name='post_detail'),
    path('blog/<uuid:pk>/related_posts/', related_post, name='related_post'),
    path('blog/<uuid:pk>/byline/', post_byline, name='post_byline'),
    path('blog/<uuid:pk>/tags/', post_tags, name='post_tags'),

    path('crypto/tokens/',  cryptotoken_list, name='list_all_tokens'),
    path('crypto/tokens/<uuid:pk>/', cryptotoken_detail, name='token_detail'),
    path('crypto/bsctokens/',  bsctoken_list, name='list_bsc_tokens'),
    path('crypto/tags/',  cryptotoken_tags, name='list_all_token_tags'),

    path('weather/', weather.weatherView, name='weather'),  # Get Current Weather Conditions from requester
    path('weather/forecast/', weather.forecastWeatherView, name='forecast'),  # Get 5 day forecast from requester

    path('newsletter/subscribe/', newsletter_subscribe, name='newsletter_subscribe'),  # Newsletter subscription
    path('newsletter/unsubscribe/', newsletter.NewsletterUnsubscription.as_view(), name='newsletter_unsubscribe'),  # Newsletter unsubscription

    path('ip/', ip.ipView, name='ip'),  # Get IP info from requester
    re_path(rf'^ip/(?P<query_ip>{ipv4pattern}))/$', ip.searchIP, name='search_ip'),  # Get IPv4 info from query_ip
    re_path(rf'^ip/(?P<query_ip>{ipv6pattern})/$', ip.searchIP, name='search_ip'),  # Get IPv6 info from query_ip

    path('', include(router.urls)),
]



# https://www.django-rest-framework.org/tutorial/6-viewsets-and-routers/
