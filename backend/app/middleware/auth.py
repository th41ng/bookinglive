from functools import wraps

from flask import g
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.repositories.user_repository import get_user_by_id
from app.utils.errors import APIError


def current_user():
    identity = get_jwt_identity()
    if identity is None:
        raise APIError("Authentication required.", 401)
    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        raise APIError("Invalid authentication token.", 401)

    user = get_user_by_id(user_id)
    if user is None:
        raise APIError("Authenticated user not found.", 401)
    g.current_user = user
    return user


def require_role(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user = current_user()
            if "admin" not in allowed_roles and user.role == "admin":
                return fn(*args, **kwargs)
            if user.role not in allowed_roles:
                raise APIError("You do not have permission to perform this action.", 403)
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def require_auth(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user()
        return fn(*args, **kwargs)

    return wrapper
