from flask import Blueprint
from flask import jsonify

from models.student import Student
from models.company import Company
from models.recruiter import Recruiter
from models.job import Job
from models.job_application import JobApplication
from models.interview import Interview
from models.resume import Resume

analytics_bp = Blueprint(
    "analytics",
    __name__,
    url_prefix="/analytics"
)


@analytics_bp.route("/overview", methods=["GET"])
def overview():

    total_students = Student.query.count()

    total_companies = Company.query.count()

    total_recruiters = Recruiter.query.count()

    total_jobs = Job.query.count()

    total_applications = JobApplication.query.count()

    total_interviews = Interview.query.count()

    total_resumes = Resume.query.count()

    return jsonify({

        "students": total_students,

        "companies": total_companies,

        "recruiters": total_recruiters,

        "jobs": total_jobs,

        "applications": total_applications,

        "interviews": total_interviews,

        "resumes": total_resumes

    })


@analytics_bp.route("/placement", methods=["GET"])
def placement():

    selected = JobApplication.query.filter_by(

        application_status="Selected"

    ).count()

    rejected = JobApplication.query.filter_by(

        application_status="Rejected"

    ).count()

    shortlisted = JobApplication.query.filter_by(

        application_status="Shortlisted"

    ).count()

    applied = JobApplication.query.filter_by(

        application_status="Applied"

    ).count()

    return jsonify({

        "selected": selected,

        "rejected": rejected,

        "shortlisted": shortlisted,

        "applied": applied

    })


@analytics_bp.route("/jobs", methods=["GET"])
def jobs():

    total_jobs = Job.query.count()

    open_jobs = Job.query.filter_by(

        status="Open"

    ).count()

    closed_jobs = Job.query.filter_by(

        status="Closed"

    ).count()

    return jsonify({

        "total_jobs": total_jobs,

        "open_jobs": open_jobs,

        "closed_jobs": closed_jobs

    })


@analytics_bp.route("/interviews", methods=["GET"])
def interviews():

    total = Interview.query.count()

    scheduled = Interview.query.filter_by(

        interview_status="Scheduled"

    ).count()

    completed = Interview.query.filter_by(

        interview_status="Completed"

    ).count()

    cancelled = Interview.query.filter_by(

        interview_status="Cancelled"

    ).count()

    return jsonify({

        "total": total,

        "scheduled": scheduled,

        "completed": completed,

        "cancelled": cancelled

    })


@analytics_bp.route("/resume", methods=["GET"])
def resume():

    total = Resume.query.count()

    return jsonify({

        "total_resumes": total

    })


@analytics_bp.route("/students", methods=["GET"])
def students():

    total = Student.query.count()

    return jsonify({

        "students": total

    })


@analytics_bp.route("/companies", methods=["GET"])
def companies():

    total = Company.query.count()

    verified = Company.query.filter_by(

        verified=True

    ).count()

    return jsonify({

        "companies": total,

        "verified_companies": verified

    })


@analytics_bp.route("/recruiters", methods=["GET"])
def recruiters():

    total = Recruiter.query.count()

    verified = Recruiter.query.filter_by(

        verified=True

    ).count()

    return jsonify({

        "recruiters": total,

        "verified_recruiters": verified

    })