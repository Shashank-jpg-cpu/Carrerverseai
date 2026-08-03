from datetime import datetime

from database import db

from flask_bcrypt import generate_password_hash
from flask_bcrypt import check_password_hash


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    full_name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False
    )

    phone = db.Column(
        db.String(20)
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    profile_image = db.Column(
        db.String(255),
        default="default.png"
    )

    last_login = db.Column(
        db.DateTime
    )

    def set_password(self, password):

        self.password = generate_password_hash(
            password
        ).decode("utf-8")

    def check_password(self, password):

        return check_password_hash(
            self.password,
            password
        )

    def to_dict(self):

        return {

            "id": self.id,

            "full_name": self.full_name,

            "email": self.email,

            "role": self.role,

            "phone": self.phone,

            "profile_image": self.profile_image,

            "is_active": self.is_active,

            "created_at": self.created_at

        }

    def __repr__(self):

        return f"<User {self.email}>"