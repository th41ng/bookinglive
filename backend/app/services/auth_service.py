from flask_jwt_extended import create_access_token

from app.repositories.user_repository import upsert_google_user, update_user_profile
from app.utils.errors import APIError
from app.utils.google_auth import verify_google_credential
from app.utils.serialization import serialize_user
from app.utils.validation import ensure_non_empty_string


def login_with_google(credential: str, client_id: str):
    payload = verify_google_credential(credential, client_id)
    user = upsert_google_user(payload)
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return {
        "access_token": token,
        "user": serialize_user(user),
        "needs_profile_completion": not user.profile_complete,
    }


def update_profile(user, payload):
    ingame_name = ensure_non_empty_string(payload.get("ingame_name"), "ingame_name")
    game_uid = ensure_non_empty_string(payload.get("game_uid"), "game_uid")
    updated_user = update_user_profile(user, ingame_name, game_uid)
    return serialize_user(updated_user)
