from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from requests import get


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
