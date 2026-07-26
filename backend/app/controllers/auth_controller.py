from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required

from app.middleware.auth import current_user
from app.services.auth_service import login_with_google, update_profile
from app.utils.errors import APIError


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/google")
def google_login():
    payload = request.get_json(silent=True) or {}
    credential = payload.get("credential")
    result = login_with_google(credential, current_app.config["GOOGLE_CLIENT_ID"])
    return jsonify(result), 200


@auth_bp.get("/me")
@jwt_required()
def get_me():
    user = current_user()
    from app.utils.serialization import serialize_user

    return jsonify({"user": serialize_user(user)}), 200
