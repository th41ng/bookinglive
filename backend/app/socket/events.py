from flask_socketio import join_room, leave_room


def register_socket_events(socketio):
    @socketio.on("join_livestream")
    def join_livestream(data):
        livestream_id = data.get("livestream_id")
        join_room(f"livestream_{livestream_id}")
        return {"status": "joined", "livestream_id": livestream_id}

    @socketio.on("leave_livestream")
    def leave_livestream(data):
        livestream_id = data.get("livestream_id")
        leave_room(f"livestream_{livestream_id}")
        return {"status": "left", "livestream_id": livestream_id}
