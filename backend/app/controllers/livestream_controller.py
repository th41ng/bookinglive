from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.middleware.auth import current_user, require_auth, require_role
from app.repositories.livestream_repository import get_livestream_by_id
from app.services.livestream_service import (
    create_new_livestream,
    get_livestream_details,
    list_my_livestreams,
    list_visible_livestreams,
    set_livestream_status,
    update_existing_livestream,
)
from app.services.queue_service import finish_match, get_queue_state, join_queue, leave_queue, remove_queue_entry, skip_next_player
from app.utils.errors import APIError
from app.utils.validation import ensure_non_empty_string, parse_slot_per_match

livestream_bp = Blueprint("livestreams", __name__)


def load_livestream_or_404(livestream_id: int):
    livestream = get_livestream_by_id(livestream_id)
    if livestream is None:
        raise APIError("Livestream not found.", 404)
    return livestream


def can_view_livestream(livestream):
    identity = get_jwt_identity()
    if livestream.status == "open" or identity is None:
        return livestream.status == "open"
    user = current_user()
    return user.role == "admin" or livestream.streamer_id == user.id


@livestream_bp.post("/livestreams")
@jwt_required()
def create_livestream():
    user = current_user()
    payload = request.get_json(silent=True) or {}
    response = create_new_livestream(user, payload)
    return jsonify({"livestream": response}), 201


@livestream_bp.get("/livestreams")
@jwt_required(optional=True)
def get_livestreams():
    scope = request.args.get("scope", "open")
    if scope == "mine":
        user = current_user()
        livestreams = list_my_livestreams(user)
    else:
        livestreams = list_visible_livestreams()
    return jsonify({"livestreams": livestreams}), 200


@livestream_bp.get("/livestreams/<int:livestream_id>")
@jwt_required(optional=True)
def get_livestream(livestream_id):
    livestream = load_livestream_or_404(livestream_id)
    if not can_view_livestream(livestream):
        raise APIError("Livestream not found.", 404)
    queue_state = get_queue_state(livestream)
    return jsonify({
        "livestream": get_livestream_details(livestream),
        "queue": queue_state["queue"],
        "playing": queue_state["playing"],
        "waiting": queue_state["waiting"],
    }), 200


@livestream_bp.put("/livestreams/<int:livestream_id>")
@jwt_required()
def update_livestream(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    payload = request.get_json(silent=True) or {}
    response = update_existing_livestream(user, livestream, payload)
    return jsonify({"livestream": response}), 200


@livestream_bp.patch("/livestreams/<int:livestream_id>/open")
@jwt_required()
def open_livestream(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    response = set_livestream_status(user, livestream, "open")
    return jsonify({"livestream": response}), 200


@livestream_bp.patch("/livestreams/<int:livestream_id>/close")
@jwt_required()
def close_livestream(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    response = set_livestream_status(user, livestream, "closed")
    return jsonify({"livestream": response}), 200


@livestream_bp.patch("/livestreams/<int:livestream_id>/slots")
@jwt_required()
def update_slots(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    payload = request.get_json(silent=True) or {}
    livestream.slot_per_match = parse_slot_per_match(payload.get("slot_per_match"))
    from app.repositories.livestream_repository import save_livestream

    save_livestream(livestream)
    from app.services.queue_service import normalize_and_persist

    normalize_and_persist(livestream)
    return jsonify({"livestream": get_livestream_details(livestream)}), 200


@livestream_bp.post("/livestreams/<int:livestream_id>/join")
@jwt_required()
def join_livestream(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    entry = join_queue(user, livestream)
    return jsonify({"entry": entry}), 201


@livestream_bp.delete("/livestreams/<int:livestream_id>/leave")
@jwt_required()
def leave_livestream(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    entry = leave_queue(user, livestream)
    return jsonify({"entry": entry}), 200


@livestream_bp.get("/livestreams/<int:livestream_id>/queue")
@jwt_required(optional=True)
def get_queue(livestream_id):
    livestream = load_livestream_or_404(livestream_id)
    if not can_view_livestream(livestream):
        raise APIError("Livestream not found.", 404)
    return jsonify(get_queue_state(livestream)), 200


@livestream_bp.post("/livestreams/<int:livestream_id>/finish")
@jwt_required()
def finish_livestream_match(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    response = finish_match(user, livestream)
    return jsonify(response), 200


@livestream_bp.post("/livestreams/<int:livestream_id>/skip")
@jwt_required()
def skip_livestream_player(livestream_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    response = skip_next_player(user, livestream)
    return jsonify({"entry": response}), 200


@livestream_bp.delete("/livestreams/<int:livestream_id>/queue/<int:entry_id>")
@jwt_required()
def delete_queue_entry(livestream_id, entry_id):
    user = current_user()
    livestream = load_livestream_or_404(livestream_id)
    response = remove_queue_entry(user, livestream, entry_id)
    return jsonify({"entry": response}), 200
