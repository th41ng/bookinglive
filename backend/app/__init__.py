from flask import Flask

from app.config import get_config
from app.controllers.auth_controller import auth_bp
from app.controllers.livestream_controller import livestream_bp
from app.controllers.me_controller import me_bp
from app.extensions import cors, db, jwt, socketio
from app.middleware.errors import register_error_handlers
from app.models import Livestream, QueueEntry, User
from app.socket.events import register_socket_events


def create_app(config_name: str | None = None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    db.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)
    jwt.init_app(app)
    socketio.init_app(
        app,
        cors_allowed_origins=app.config["CORS_ORIGINS"],
        # Sửa "eventlet" thành "gevent" ở dòng dưới
        async_mode=app.config.get("SOCKETIO_ASYNC_MODE", "gevent"),
    )

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(me_bp, url_prefix="/")
    app.register_blueprint(livestream_bp, url_prefix="/")

    register_error_handlers(app)
    register_socket_events(socketio)

    with app.app_context():
        if app.config.get("AUTO_CREATE_TABLES", False):
            db.create_all()

    return app
