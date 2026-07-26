from app.extensions import socketio
from app.repositories.queue_repository import get_entries_for_livestream
from app.repositories.livestream_repository import get_livestream_by_id
from app.utils.serialization import serialize_livestream, serialize_queue_entry
from app.utils.queue import queue_snapshot


def broadcast_queue_update(livestream_id: int):
    livestream = get_livestream_by_id(livestream_id)
    if livestream is None:
        return
    entries = get_entries_for_livestream(livestream_id)
    snapshot = queue_snapshot(entries)
    socketio.emit(
        "livestream_updated",
        {
            "livestream": serialize_livestream(livestream),
            "queue": [serialize_queue_entry(entry) for entry in snapshot["entries"]],
            "playing": [serialize_queue_entry(entry) for entry in snapshot["playing"]],
            "waiting": [serialize_queue_entry(entry) for entry in snapshot["waiting"]],
        },
        room=f"livestream_{livestream_id}",
    )
