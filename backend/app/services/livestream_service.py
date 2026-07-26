from app.extensions import db
from app.models.livestream import Livestream
from app.repositories.livestream_repository import create_livestream, get_livestream_by_id, list_livestreams, save_livestream
from app.utils.errors import APIError
from app.utils.serialization import serialize_livestream
from app.utils.validation import ensure_non_empty_string, parse_slot_per_match


def assert_livestream_owner_or_admin(user, livestream: Livestream):
    if user.role == "admin":
        return
    if livestream.streamer_id != user.id:
        raise APIError("You can only manage your own livestreams.", 403)


def create_new_livestream(user, payload):
    title = ensure_non_empty_string(payload.get("title"), "title")
    game_name = ensure_non_empty_string(payload.get("game_name"), "game_name")
    slot_per_match = parse_slot_per_match(payload.get("slot_per_match", 1))
    livestream = create_livestream(user.id, title, game_name, slot_per_match)
    return serialize_livestream(livestream)


def update_existing_livestream(user, livestream: Livestream, payload):
    assert_livestream_owner_or_admin(user, livestream)
    if "title" in payload:
        livestream.title = ensure_non_empty_string(payload.get("title"), "title")
    if "game_name" in payload:
        livestream.game_name = ensure_non_empty_string(payload.get("game_name"), "game_name")
    if "slot_per_match" in payload:
        livestream.slot_per_match = parse_slot_per_match(payload.get("slot_per_match"))
    save_livestream(livestream)
    return serialize_livestream(livestream)


def set_livestream_status(user, livestream: Livestream, status: str):
    assert_livestream_owner_or_admin(user, livestream)
    livestream.status = status
    save_livestream(livestream)
    return serialize_livestream(livestream)


def get_livestream_details(livestream: Livestream):
    return serialize_livestream(livestream, include_streamer=True)


def list_visible_livestreams(current_user=None):
    role = getattr(current_user, "role", None)
    if role == "admin":
        livestreams = list_livestreams()
    else:
        livestreams = list_livestreams(status="open")
    return [serialize_livestream(livestream) for livestream in livestreams]


def list_my_livestreams(user):
    livestreams = list_livestreams(streamer_id=user.id)
    return [serialize_livestream(livestream) for livestream in livestreams]
