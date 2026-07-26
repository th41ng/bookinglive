from app.extensions import db
from app.models.user import User


def get_user_by_id(user_id: int):
    return db.session.get(User, user_id)


def get_user_by_google_id(google_id: str):
    return User.query.filter_by(google_id=google_id).first()


def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()


def save_user(user: User):
    db.session.add(user)
    db.session.flush()
    return user


def upsert_google_user(payload: dict, role: str = "viewer"):
    google_id = payload["sub"]
    email = payload.get("email")
    display_name = payload.get("name") or email
    avatar_url = payload.get("picture")

    user = get_user_by_google_id(google_id)
    if user is None:
        user = get_user_by_email(email)
        if user and user.google_id != google_id:
            user.google_id = google_id
        elif user is None:
            user = User(google_id=google_id, email=email, display_name=display_name, avatar_url=avatar_url, role=role)

    user.email = email
    user.display_name = display_name
    user.avatar_url = avatar_url
    if not user.role:
        user.role = role
    save_user(user)
    db.session.commit()
    return user


def update_user_profile(user: User, ingame_name: str, game_uid: str):
    user.ingame_name = ingame_name
    user.game_uid = game_uid
    db.session.commit()
    return user
