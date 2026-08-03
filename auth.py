from flask import Blueprint
from flask import request
from flask import jsonify

from extensions import db
from extensions import bcrypt

from models.user import User
from models.student import Student

auth_bp = Blueprint(
    "auth",
    __name__
)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    role = "Student"

    if not full_name or not email or not password:

        return jsonify({

            "success": False,

            "message": "All required fields are mandatory."

        }), 400

    existing_user = User.query.filter_by(

        email=email

    ).first()

    if existing_user:

        return jsonify({

            "success": False,

            "message": "Email already exists."

        }), 409

    hashed_password = bcrypt.generate_password_hash(

        password

    ).decode("utf-8")

    user = User(

        full_name=full_name,

        email=email,

        password=hashed_password,

        role=role,

        phone=phone

    )

    db.session.add(user)
    db.session.commit()

    student = Student(

        user_id=user.id,

        college="",

        university="",

        degree="",

        branch="",

        semester=1,

        cgpa=0.0

    )

    db.session.add(student)
    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Registration Successful"

    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    print("========== LOGIN ==========")
    print(data)
    print("EMAIL   :", repr(email))
    print("PASSWORD:", repr(password))
    # Fixed Admin Login
    if (

        email == "admin@careerverse.ai"

        and

        password == "Admin@123"

    ):

        return jsonify({

            "success": True,

            "message": "Admin Login Successful",

            "user": {

                "id": 0,

                "full_name": "Administrator",

                "email": "admin@careerverse.ai",

                "role": "Admin"

            }

        }), 200

    user = User.query.filter_by(

        email=email

    ).first()

    if user is None:

        return jsonify({

            "success": False,

            "message": "Invalid Email"

        }), 404

    if not bcrypt.check_password_hash(

        user.password,

        password

    ):

        return jsonify({

            "success": False,

            "message": "Incorrect Password"

        }), 401
    user_data = user.to_dict()

    if user.role == "Student":

        student = Student.query.filter_by(
            user_id=user.id
        ).first()

        if student:

            user_data["student_id"] = student.id

    return jsonify({

        "success": True,

        "message": "Login Successful",

        "user": user_data

    }), 200

@auth_bp.route("/change-password", methods=["PUT"])
def change_password():

    data = request.get_json()

    user_id = data.get("user_id")
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not user_id or not current_password or not new_password:

        return jsonify({

            "success": False,

            "message": "All fields are required."

        }), 400

    user = User.query.get(user_id)

    if user is None:

        return jsonify({

            "success": False,

            "message": "User not found."

        }), 404

    if not bcrypt.check_password_hash(

        user.password,

        current_password

    ):

        return jsonify({

            "success": False,

            "message": "Current password is incorrect."

        }), 401

    user.password = bcrypt.generate_password_hash(

        new_password

    ).decode("utf-8")

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Password changed successfully."

    }), 200


@auth_bp.route("/test")
def test():

    return jsonify({

        "message": "Authentication Route Working"

    })

