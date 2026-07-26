from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.utils.errors import APIError


def verify_google_credential(credential: str, client_id: str):
    if not credential:
        raise APIError("Google credential is required.", 400)
    if not client_id:
        raise APIError("Google client ID is not configured.", 500)
    try:
        payload = id_token.verify_oauth2_token(credential, google_requests.Request(), client_id)
    except ValueError as exc:
        raise APIError("Invalid Google credential.", 401) from exc
    return payload
