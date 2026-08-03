from flask import Blueprint, jsonify, request

from extensions import db
from models.notification import Notification

notification_bp = Blueprint(
    "notification",
    __name__,
    url_prefix="/notification"
)


@notification_bp.route("/all", methods=["GET"])
def get_notifications():

    notifications = Notification.query.all()

    return jsonify(

        [notification.to_dict() for notification in notifications]

    )


@notification_bp.route("/<int:id>", methods=["GET"])
def get_notification(id):

    notification = Notification.query.get(id)

    if notification is None:

        return jsonify({

            "success": False,

            "message": "Notification not found"

        }), 404

    return jsonify(

        notification.to_dict()

    )


@notification_bp.route("/send", methods=["POST"])
def send_notification():

    data = request.get_json()

    notification = Notification(

        sender_id=data["sender_id"],

        receiver_id=data["receiver_id"],

        title=data["title"],

        message=data["message"],

        notification_type=data.get(
            "notification_type",
            "System"
        ),

        priority=data.get(
            "priority",
            "Normal"
        ),

        action_url=data.get(
            "action_url"
        ),

        icon=data.get(
            "icon"
        )

    )

    db.session.add(notification)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Notification Sent Successfully"

    }), 201


@notification_bp.route("/receiver/<int:user_id>", methods=["GET"])
def receiver_notifications(user_id):

    notifications = Notification.query.filter_by(

        receiver_id=user_id

    ).all()

    return jsonify(

        [notification.to_dict() for notification in notifications]

    )


@notification_bp.route("/mark-read/<int:id>", methods=["PUT"])
def mark_read(id):

    notification = Notification.query.get(id)

    if notification is None:

        return jsonify({

            "success": False,

            "message": "Notification not found"

        }), 404

    notification.is_read = True

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Notification marked as read"

    })


@notification_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_notification(id):

    notification = Notification.query.get(id)

    if notification is None:

        return jsonify({

            "success": False,

            "message": "Notification not found"

        }), 404

    db.session.delete(notification)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Notification Deleted"

    })


@notification_bp.route("/dashboard", methods=["GET"])
def dashboard():

    total = Notification.query.count()

    unread = Notification.query.filter_by(

        is_read=False

    ).count()

    read = Notification.query.filter_by(

        is_read=True

    ).count()

    return jsonify({

        "total_notifications": total,

        "read": read,

        "unread": unread

    })