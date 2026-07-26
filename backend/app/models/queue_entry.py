from app.extensions import db
from app.models.base import TimestampMixin
from app.utils.time import utcnow


class QueueEntry(TimestampMixin, db.Model):
    __tablename__ = "queue_entries"

    id = db.Column(db.Integer, primary_key=True)
    livestream_id = db.Column(db.Integer, db.ForeignKey("livestreams.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    position = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False, default="waiting", index=True)
    joined_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    livestream = db.relationship("Livestream", back_populates="queue_entries")
    user = db.relationship("User", back_populates="queue_entries")
