from functools import wraps
import jwt
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework.decorators import api_view
from ..utils import refresh_auth0_token, is_auth0_token_valid, update_auth0_user, get_user_by_id
from ..models import Post, User
from ..serializers import PostSerializer
import json


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
            try:
                token = get_token_auth_header(args[0])
            except Exception as e:
                return JsonResponse(status=401, data={'error': f'Unauthorized', 'message': f'Authentication credentials were not provided.'})
            decoded = jwt.decode(token, verify=False)
            print(f'Decoded token => {decoded}')
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                print(f'Here are the users scopes => {token_scopes}')
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


def is_frontend_admin(user_id):
    """
    Check for frontend_admin in roles from the users app metadata
    :param user_id: Auth0 User ID
    :return: boolean
    """
    user_id = str(user_id)
    if not User.objects.filter(username=user_id).first().is_frontend_admin: return False
    check_token()
    user = json.loads(json.dumps(get_user_by_id(user_id)))
    user_app_metadata = user['app_metadata']
    if "roles" in user_app_metadata:
        if "frontend_admin" in user_app_metadata['roles']:
            return True
    else: return False


def check_token():
    token = cache.get('Auth0_MGMT_API_JWT')
    if token is None: refresh_auth0_token()
    else:
        if is_auth0_token_valid(token): pass
        else: refresh_auth0_token()
