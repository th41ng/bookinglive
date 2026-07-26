from app.extensions import db
from app.models.queue_entry import QueueEntry

ACTIVE_STATUSES = {"waiting", "playing"}


def get_entry_by_id(entry_id: int):
    return db.session.get(QueueEntry, entry_id)


def get_entries_for_livestream(livestream_id: int):
    return (
        QueueEntry.query.filter_by(livestream_id=livestream_id)
        .order_by(QueueEntry.joined_at.asc(), QueueEntry.id.asc())
        .all()
    )


def get_active_entry_for_user(livestream_id: int, user_id: int):
    return (
        QueueEntry.query.filter(
            QueueEntry.livestream_id == livestream_id,
            QueueEntry.user_id == user_id,
            QueueEntry.status.in_(ACTIVE_STATUSES),
        )
        .first()
    )


def create_queue_entry(livestream_id: int, user_id: int, position: int):
    entry = QueueEntry(livestream_id=livestream_id, user_id=user_id, position=position, status="waiting")
    db.session.add(entry)
    db.session.flush()
    return entry


def save_queue_entry(entry: QueueEntry):
    db.session.add(entry)
    return entry


def commit():
    db.session.commit()
