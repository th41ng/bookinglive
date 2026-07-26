import os
import sys

from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///queuestream.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
    CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]
    AUTO_CREATE_TABLES = os.getenv("AUTO_CREATE_TABLES", "true").lower() == "true"
    SOCKETIO_ASYNC_MODE = os.getenv("SOCKETIO_ASYNC_MODE") or ("threading" if sys.version_info >= (3, 14) else "eventlet")


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    AUTO_CREATE_TABLES = True
    CORS_ORIGINS = ["http://localhost:5173"]


class ProductionConfig(BaseConfig):
    DEBUG = False
    AUTO_CREATE_TABLES = os.getenv("AUTO_CREATE_TABLES", "false").lower() == "true"


def get_config(config_name: str | None = None):
    normalized = (config_name or os.getenv("FLASK_ENV", "development")).lower()
    if normalized == "production":
        return ProductionConfig
    if normalized == "testing":
        return TestingConfig
    return DevelopmentConfig
