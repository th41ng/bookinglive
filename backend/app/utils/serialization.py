def serialize_user(user):
    return {
        "id": user.id,
        "google_id": user.google_id,
        "email": user.email,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "ingame_name": user.ingame_name,
        "game_uid": user.game_uid,
        "role": user.role,
        "profile_complete": user.profile_complete,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
    }


def serialize_livestream(livestream, include_streamer=False):
    payload = {
        "id": livestream.id,
        "streamer_id": livestream.streamer_id,
        "title": livestream.title,
        "game_name": livestream.game_name,
        "status": livestream.status,
        "slot_per_match": livestream.slot_per_match,
        "created_at": livestream.created_at.isoformat() if livestream.created_at else None,
        "updated_at": livestream.updated_at.isoformat() if livestream.updated_at else None,
    }
    if include_streamer and livestream.streamer:
        payload["streamer"] = serialize_user(livestream.streamer)
    return payload


def serialize_queue_entry(entry):
    return {
        "id": entry.id,
        "livestream_id": entry.livestream_id,
        "user_id": entry.user_id,
        "position": entry.position,
        "status": entry.status,
        "joined_at": entry.joined_at.isoformat() if entry.joined_at else None,
        "updated_at": entry.updated_at.isoformat() if entry.updated_at else None,
        "user": serialize_user(entry.user) if entry.user else None,
    }
