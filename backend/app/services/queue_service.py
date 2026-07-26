from app.extensions import db
from app.models.livestream import Livestream
from app.repositories.livestream_repository import get_livestream_by_id, save_livestream
from app.repositories.queue_repository import (
    ACTIVE_STATUSES,
    commit,
    create_queue_entry,
    get_active_entry_for_user,
    get_entry_by_id,
    get_entries_for_livestream,
    save_queue_entry,
)
from app.socket.notifications import broadcast_queue_update
from app.utils.errors import APIError
from app.utils.queue import normalize_queue_entries, queue_snapshot
from app.utils.serialization import serialize_queue_entry


def assert_streamer_or_admin(user, livestream: Livestream):
    if user.role == "admin":
        return
    if livestream.streamer_id != user.id:
        raise APIError("You can only manage your own livestreams.", 403)


def assert_livestream_open(livestream: Livestream):
    if livestream.status != "open":
        raise APIError("Registration is not open for this livestream.", 409)


def normalize_and_persist(livestream: Livestream):
    entries = get_entries_for_livestream(livestream.id)
    normalize_queue_entries(entries, livestream.slot_per_match)
    for entry in entries:
        save_queue_entry(entry)
    db.session.commit()
    broadcast_queue_update(livestream.id)
    return entries


def get_queue_state(livestream: Livestream):
    entries = get_entries_for_livestream(livestream.id)
    snapshot = queue_snapshot(entries)
    return {
        "livestream": livestream,
        "queue": [serialize_queue_entry(entry) for entry in snapshot["entries"]],
        "playing": [serialize_queue_entry(entry) for entry in snapshot["playing"]],
        "waiting": [serialize_queue_entry(entry) for entry in snapshot["waiting"]],
    }


def join_queue(user, livestream: Livestream):
    if user.role not in {"viewer", "admin"}:
        raise APIError("Only viewers can join queues.", 403)
    assert_livestream_open(livestream)
    active_entry = get_active_entry_for_user(livestream.id, user.id)
    if active_entry is not None:
        raise APIError("You already have an active queue entry in this livestream.", 409)
    entries = get_entries_for_livestream(livestream.id)
    position = len([entry for entry in entries if entry.status in ACTIVE_STATUSES]) + 1
    entry = create_queue_entry(livestream.id, user.id, position)
    db.session.commit()
    normalize_and_persist(livestream)
    return serialize_queue_entry(entry)


def leave_queue(user, livestream: Livestream):
    entry = get_active_entry_for_user(livestream.id, user.id)
    if entry is None:
        raise APIError("You do not have an active queue entry in this livestream.", 404)
    entry.status = "cancelled"
    db.session.commit()
    normalize_and_persist(livestream)
    return serialize_queue_entry(entry)


def finish_match(user, livestream: Livestream):
    assert_streamer_or_admin(user, livestream)
    entries = get_entries_for_livestream(livestream.id)
    playing_entries = [entry for entry in entries if entry.status == "playing"]
    if not playing_entries:
        return get_queue_state(livestream)
    for entry in playing_entries:
        entry.status = "finished"
    db.session.commit()
    normalize_and_persist(livestream)
    return get_queue_state(livestream)


def skip_next_player(user, livestream: Livestream):
    assert_streamer_or_admin(user, livestream)
    entries = get_entries_for_livestream(livestream.id)
    waiting_entries = [entry for entry in entries if entry.status == "waiting"]
    if not waiting_entries:
        raise APIError("No waiting player is available to skip.", 409)
    entry = waiting_entries[0]
    entry.status = "skipped"
    db.session.commit()
    normalize_and_persist(livestream)
    return serialize_queue_entry(entry)


def remove_queue_entry(user, livestream: Livestream, entry_id: int):
    assert_streamer_or_admin(user, livestream)
    entry = get_entry_by_id(entry_id)
    if entry is None or entry.livestream_id != livestream.id:
        raise APIError("Queue entry not found.", 404)
    if entry.status in ACTIVE_STATUSES:
        entry.status = "cancelled"
    else:
        entry.status = "cancelled"
    db.session.commit()
    normalize_and_persist(livestream)
    return serialize_queue_entry(entry)
