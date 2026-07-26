from app.extensions import db
from app.models.livestream import Livestream


def get_livestream_by_id(livestream_id: int):
    return db.session.get(Livestream, livestream_id)


def list_livestreams(status=None, streamer_id=None):
    query = Livestream.query
    if status:
        query = query.filter(Livestream.status == status)
    if streamer_id:
        query = query.filter(Livestream.streamer_id == streamer_id)
    return query.order_by(Livestream.created_at.desc()).all()


def create_livestream(streamer_id: int, title: str, game_name: str, slot_per_match: int):
    livestream = Livestream(
        streamer_id=streamer_id,
        title=title,
        game_name=game_name,
        slot_per_match=slot_per_match,
    )
    db.session.add(livestream)
    db.session.commit()
    return livestream


def save_livestream(livestream: Livestream):
    db.session.add(livestream)
    db.session.commit()
    return livestream
