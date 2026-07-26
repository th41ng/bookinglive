from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.middleware.auth import current_user
from app.services.auth_service import update_profile

me_bp = Blueprint("me", __name__)


@me_bp.put("/me")
@jwt_required()
def update_me():
    user = current_user()
    payload = request.get_json(silent=True) or {}
    updated_user = update_profile(user, payload)
    return jsonify({"user": updated_user}), 200
