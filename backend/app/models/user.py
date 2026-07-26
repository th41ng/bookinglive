from app.extensions import db
from app.models.base import TimestampMixin


class User(TimestampMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(255), nullable=False, unique=True, index=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    display_name = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(512), nullable=True)
    ingame_name = db.Column(db.String(255), nullable=True)
    game_uid = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), nullable=False, default="viewer")

    livestreams = db.relationship("Livestream", back_populates="streamer", cascade="all, delete-orphan")
    queue_entries = db.relationship("QueueEntry", back_populates="user")

    @property
    def profile_complete(self):
        return bool(self.ingame_name and self.game_uid)
