from flask import Blueprint, jsonify

from models.user import User
from models.student import Student
from models.company import Company
from models.recruiter import Recruiter
from models.job import Job
from models.job_application import JobApplication
from models.resume import Resume
from models.interview import Interview
from models.notification import Notification
from models.chat import Chat

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/dashboard"
)


@dashboard_bp.route("/overview", methods=["GET"])
def overview():

    return jsonify({

        "users": User.query.count(),

        "students": Student.query.count(),

        "companies": Company.query.count(),

        "recruiters": Recruiter.query.count(),

        "jobs": Job.query.count(),

        "applications": JobApplication.query.count(),

        "interviews": Interview.query.count(),

        "resumes": Resume.query.count(),

        "notifications": Notification.query.count(),

        "messages": Chat.query.count()

    })


@dashboard_bp.route("/student/<int:id>", methods=["GET"])
def student_dashboard(id):

    student = Student.query.get(id)

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found"

        }), 404

    return jsonify({

        "student": student.to_dict(),

        "applications": JobApplication.query.filter_by(

            student_id=id

        ).count(),

        "resumes": Resume.query.filter_by(

            student_id=id

        ).count(),

        "interviews": Interview.query.filter_by(

            student_id=id

        ).count()

    })


@dashboard_bp.route("/company/<int:id>", methods=["GET"])
def company_dashboard(id):

    company = Company.query.get(id)

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    return jsonify({

        "company": company.to_dict(),

        "jobs": Job.query.filter_by(

            company_id=id

        ).count(),

        "recruiters": Recruiter.query.filter_by(

            company_id=id

        ).count()

    })


@dashboard_bp.route("/recruiter/<int:id>", methods=["GET"])
def recruiter_dashboard(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    return jsonify({

        "recruiter": recruiter.to_dict(),

        "jobs": Job.query.filter_by(

            recruiter_id=id

        ).count(),

        "interviews": Interview.query.filter_by(

            recruiter_id=id

        ).count()

    })


@dashboard_bp.route("/admin", methods=["GET"])
def admin_dashboard():

    return jsonify({

        "users": User.query.count(),

        "students": Student.query.count(),

        "companies": Company.query.count(),

        "recruiters": Recruiter.query.count(),

        "jobs": Job.query.count(),

        "applications": JobApplication.query.count(),

        "interviews": Interview.query.count(),

        "messages": Chat.query.count(),

        "notifications": Notification.query.count()

    })


@dashboard_bp.route("/system", methods=["GET"])
def system_dashboard():

    return jsonify({

        "backend": "Running",

        "database": "Connected",

        "api": "Healthy",

        "platform": "CareerVerse AI",

        "version": "1.0.0"

    })