from django.contrib.auth import authenticate
import json
import jwt
import requests
from django.conf import settings

from django.core.cache import cache
import time

from requests.exceptions import RequestException, HTTPError, URLRequired


def is_auth0_token_valid(token):
    """
    :return: boolean if Auth0 token is valid
    """
    exp = jwt.decode(token, verify=False).get('exp')
    if int(time.time()) >= exp:
        return False
    else: return True


def refresh_auth0_token():
    payload = {
        'grant_type': settings.AUTH0_GRANT_TYPE,
        'client_id': settings.AUTH0_CLIENT_ID,
        'client_secret': settings.AUTH0_CLIENT_SECRET,
        'audience': f'{settings.AUTH0_AUDIENCE}/'
    }
    response = requests.post(f'{settings.AUTH0_DOMAIN}/oauth/token', data=payload)
    oauth = response.json()
    access_token = oauth.get('access_token')
    cache.set('Auth0_MGMT_API_JWT', access_token, 84600)


def jwt_get_username_from_payload_handler(payload):
    username = payload.get('sub').replace('|', '.')
    authenticate(remote_user=username)
    return username


def jwt_decode_token(token):
    header = jwt.get_unverified_header(token)
    jwks = requests.get('https://{}/.well-known/jwks.json'.format('anonsys.auth0.com')).json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
    if public_key is None:
        raise Exception('Public key not found.')
    issuer = 'https://{}/'.format('anonsys.auth0.com')
    return jwt.decode(token, public_key, audience='https://api.anonsys.tech', issuer=issuer, algorithms=['RS256'])
