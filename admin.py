from flask import Blueprint, jsonify, request

from models.user import User
from models.student import Student
from models.company import Company
from models.recruiter import Recruiter
from models.job import Job
from models.job_application import JobApplication
from models.interview import Interview
from models.resume import Resume
from models.notification import Notification
from extensions import db

admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/admin"
)


@admin_bp.route("/dashboard", methods=["GET"])
def dashboard():

    return jsonify({

        "total_users": User.query.count(),

        "total_students": Student.query.count(),

        "total_companies": Company.query.count(),

        "total_recruiters": Recruiter.query.count(),

        "total_jobs": Job.query.count(),

        "total_applications": JobApplication.query.count(),

        "total_interviews": Interview.query.count(),

        "total_resumes": Resume.query.count(),

        "total_notifications": Notification.query.count()

    })


@admin_bp.route("/users", methods=["GET"])
def users():

    users = User.query.all()

    return jsonify(

        [user.to_dict() for user in users]

    )


@admin_bp.route("/companies", methods=["GET"])
def companies():

    companies = Company.query.all()

    return jsonify(

        [company.to_dict() for company in companies]

    )


@admin_bp.route("/recruiters", methods=["GET"])
def recruiters():

    recruiters = Recruiter.query.all()

    return jsonify(

        [recruiter.to_dict() for recruiter in recruiters]

    )


@admin_bp.route("/jobs", methods=["GET"])
def jobs():

    jobs = Job.query.all()

    return jsonify(

        [job.to_dict() for job in jobs]

    )


@admin_bp.route("/applications", methods=["GET"])
def applications():

    applications = JobApplication.query.all()

    return jsonify(

        [application.to_dict() for application in applications]

    )


@admin_bp.route("/approve-company/<int:id>", methods=["PUT"])
def approve_company(id):

    company = Company.query.get(id)

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    company.verified = True

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Company Approved"

    })


@admin_bp.route("/approve-recruiter/<int:id>", methods=["PUT"])
def approve_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    recruiter.verified = True

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter Approved"

    })


@admin_bp.route("/delete-user/<int:id>", methods=["DELETE"])
def delete_user(id):

    user = User.query.get(id)

    if user is None:

        return jsonify({

            "success": False,

            "message": "User not found"

        }), 404

    db.session.delete(user)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "User Deleted Successfully"

    })


@admin_bp.route("/system-health", methods=["GET"])
def system_health():

    return jsonify({

        "server": "Running",

        "database": "Connected",

        "api": "Healthy",

        "version": "1.0.0"

    })


@admin_bp.route("/activity-log", methods=["GET"])
def activity_log():

    return jsonify({

        "message": "Activity Log Module Coming Soon"

    })