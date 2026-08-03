from flask import Blueprint, jsonify, request

from extensions import db
from models.chat import Chat

chat_bp = Blueprint(
    "chat",
    __name__,
    url_prefix="/chat"
)


@chat_bp.route("/all", methods=["GET"])
def get_all_messages():

    messages = Chat.query.order_by(
        Chat.sent_at.desc()
    ).all()

    return jsonify(

        [message.to_dict() for message in messages]

    )


@chat_bp.route("/conversation", methods=["GET"])
def conversation():

    sender_id = request.args.get("sender_id")

    receiver_id = request.args.get("receiver_id")

    messages = Chat.query.filter(

        (

            (Chat.sender_id == sender_id)

            &

            (Chat.receiver_id == receiver_id)

        )

        |

        (

            (Chat.sender_id == receiver_id)

            &

            (Chat.receiver_id == sender_id)

        )

    ).order_by(Chat.sent_at.asc()).all()

    return jsonify(

        [message.to_dict() for message in messages]

    )


@chat_bp.route("/send", methods=["POST"])
def send_message():

    data = request.get_json()

    message = Chat(

        sender_id=data["sender_id"],

        receiver_id=data["receiver_id"],

        message=data["message"],

        message_type=data.get(
            "message_type",
            "text"
        ),

        attachment=data.get(
            "attachment"
        ),

        file_name=data.get(
            "file_name"
        ),

        file_size=data.get(
            "file_size"
        )

    )

    db.session.add(message)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Message Sent Successfully"

    }), 201


@chat_bp.route("/mark-read/<int:id>", methods=["PUT"])
def mark_read(id):

    message = Chat.query.get(id)

    if message is None:

        return jsonify({

            "success": False,

            "message": "Message not found"

        }), 404

    message.is_seen = True

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Message marked as read"

    })


@chat_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_message(id):

    message = Chat.query.get(id)

    if message is None:

        return jsonify({

            "success": False,

            "message": "Message not found"

        }), 404

    db.session.delete(message)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Message Deleted Successfully"

    })


@chat_bp.route("/unread/<int:user_id>", methods=["GET"])
def unread_messages(user_id):

    unread = Chat.query.filter_by(

        receiver_id=user_id,

        is_seen=False

    ).count()

    return jsonify({

        "unread_messages": unread

    })


@chat_bp.route("/dashboard", methods=["GET"])
def dashboard():

    total = Chat.query.count()

    unread = Chat.query.filter_by(

        is_seen=False

    ).count()

    read = Chat.query.filter_by(

        is_seen=True

    ).count()

    return jsonify({

        "total_messages": total,

        "read_messages": read,

        "unread_messages": unread

    })