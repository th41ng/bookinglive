from app.utils.errors import APIError


def require_json(payload, required_fields):
    if payload is None:
        raise APIError("Request body must be JSON.", 400)
    missing = [field for field in required_fields if payload.get(field) in (None, "")]
    if missing:
        raise APIError("Missing required fields.", 400, {"missing": missing})
    return payload


def parse_slot_per_match(value):
    try:
        slot = int(value)
    except (TypeError, ValueError):
        raise APIError("slot_per_match must be an integer.", 400)
    if slot not in (1, 2):
        raise APIError("slot_per_match must be either 1 or 2.", 400)
    return slot


def ensure_non_empty_string(value, field_name):
    if not isinstance(value, str) or not value.strip():
        raise APIError(f"{field_name} must be a non-empty string.", 400)
    return value.strip()
