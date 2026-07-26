from flask import jsonify
from werkzeug.exceptions import HTTPException

from app.utils.errors import APIError


def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify({"error": error.message, "details": error.details})
        response.status_code = error.status_code
        return response

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        response = jsonify({"error": error.description})
        response.status_code = error.code or 500
        return response

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.exception("Unhandled error: %s", error)
        response = jsonify({"error": "Internal server error."})
        response.status_code = 500
        return response
