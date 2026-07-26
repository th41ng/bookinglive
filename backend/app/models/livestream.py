from app.extensions import db
from app.models.base import TimestampMixin


class Livestream(TimestampMixin, db.Model):
    __tablename__ = "livestreams"

    id = db.Column(db.Integer, primary_key=True)
    streamer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    game_name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="draft", index=True)
    slot_per_match = db.Column(db.Integer, nullable=False, default=1)

    streamer = db.relationship("User", back_populates="livestreams")
    queue_entries = db.relationship("QueueEntry", back_populates="livestream", cascade="all, delete-orphan")
