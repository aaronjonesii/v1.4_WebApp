from django.contrib.auth import authenticate
import json
import jwt
import requests
from django.conf import settings

from django.core.cache import cache
import time

from requests.exceptions import RequestException, HTTPError, URLRequired
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseForbidden, HttpResponseNotFound
from django.http import JsonResponse
from .models import User, Post


def is_auth0_token_valid(token):
    """
    :return: boolean if Auth0 token is valid
    """
    exp = jwt.decode(token, verify=False, algorithms=["RS256"]).get('exp')
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
    if 'access_token' not in oauth:
        raise ValueError('access_token was not in response')
    access_token = oauth.get('access_token')
    cache.set('Auth0_MGMT_API_JWT', access_token, 84600)


def get_user_by_id(user_id):
    """
    :param user_id: string
    :return: user dictionary
    """
    user_id = user_id.replace('.', '|')
    headers = {
        'Authorization': f"Bearer {cache.get('Auth0_MGMT_API_JWT')}",
        'Content-Type': 'application/json'
    }
    try:
        res = requests.get(f'{settings.AUTH0_AUDIENCE}/users/{user_id}', headers=headers)
        user = res.json()
        return user
    except HTTPError as e:
        print(f'HTTPError: {str(e.code)} {str(e.reason)}')
    except URLRequired as e:
        print(f'URLRequired: {str(e.reason)}')
    except RequestException as e:
        print(f'RequestException: {e}')
    except Exception as e:
        print(f'Generic Exception: {e}')


def update_auth0_user(user_id, user_update):
    """
    :param user_id: string
    :param user_update: dictionary
    :return: Json Response w/updated user dictionary
    """
    need_to_update_stories = False
    headers = {
        'Authorization': f"Bearer {cache.get('Auth0_MGMT_API_JWT')}",
        'Content-Type': 'application/json'
    }
    try:
        # If name is in dictionary keys
        if json.loads(user_update).keys() >= {'name'}:
            need_to_update_stories = True
        res = requests.patch(f"{settings.AUTH0_AUDIENCE}/users/{str(user_id).replace('.', '|')}", user_update, headers=headers)
        updated_user = res.json()
        if 'statusCode' in updated_user.keys():
            status_code = updated_user['statusCode']
            error = updated_user['error']
            error_message = updated_user['message']
            return JsonResponse(status=status_code, data={'error': error, 'message': error_message})
        else:
            if need_to_update_stories:
                user = User.objects.filter(username=user_id).first()
                Post.objects.filter(author=user.id).update(author_name=updated_user['name'])
            return JsonResponse(updated_user)
    except HTTPError as e:
        print(f'HTTPError: {str(e.code)} {str(e.reason)}')
    except URLRequired as e:
        print(f'URLRequired: {str(e.reason)}')
    except RequestException as e:
        print(f'RequestException: {e}')
    except Exception as e:
        print(f'Generic Exception: {e}')


def jwt_get_username_from_payload_handler(payload):
    username = payload.get('sub').replace('|', '.')
    authenticate(remote_user=username)
    return username


def jwt_decode_token(token):
    header = jwt.get_unverified_header(token)
    jwks = requests.get(f"https://{settings.AUTH0_JWT_ISSUER}/.well-known/jwks.json").json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
    if public_key is None:
        raise Exception('Public key not found.')
    issuer = f"https://{settings.AUTH0_JWT_ISSUER}/"
    return jwt.decode(token, public_key, audience=settings.AUTH0_JWT_AUDIENCE, issuer=issuer, algorithms=['RS256'])
