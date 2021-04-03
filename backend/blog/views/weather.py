from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from requests import get

from .ip import get_client_ip


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
