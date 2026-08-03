from flask import Blueprint, jsonify, request

from extensions import db
from extensions import bcrypt

from models.user import User
from models.recruiter import Recruiter
from models.job import Job
from models.job_application import JobApplication
from models.interview import Interview

recruiter_bp = Blueprint(
    "recruiter",
    __name__,
    url_prefix="/recruiter"
)


@recruiter_bp.route("/all", methods=["GET"])
def get_all_recruiters():

    recruiters = Recruiter.query.all()

    return jsonify(

        [r.to_dict() for r in recruiters]

    )


@recruiter_bp.route("/<int:id>", methods=["GET"])
def get_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    return jsonify(

        recruiter.to_dict()

    )


@recruiter_bp.route("/create", methods=["POST"])
def create_recruiter():

    data = request.get_json()

    existing = User.query.filter_by(

        email=data["email"]

    ).first()

    if existing:

        return jsonify({

            "success": False,

            "message": "Email already exists"

        }), 409

    hashed_password = bcrypt.generate_password_hash(

        data["password"]

    ).decode("utf-8")

    user = User(

        full_name=data["full_name"],

        email=data["email"],

        password=hashed_password,

        role="Recruiter",

        phone=data.get("phone")

    )

    db.session.add(user)

    db.session.commit()

    recruiter = Recruiter(

        user_id=user.id,

        company_id=data["company_id"],

        designation=data["designation"],

        department=data.get("department"),

        experience=data.get("experience", 0),

        bio=data.get("bio"),

        linkedin=data.get("linkedin")

    )

    db.session.add(recruiter)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter created successfully",

        "login": {

            "email": user.email,

            "password": data["password"]

        }

    }), 201


@recruiter_bp.route("/update/<int:id>", methods=["PUT"])
def update_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    data = request.get_json()

    recruiter.designation = data.get(

        "designation",

        recruiter.designation

    )

    recruiter.department = data.get(

        "department",

        recruiter.department

    )

    recruiter.experience = data.get(

        "experience",

        recruiter.experience

    )

    recruiter.bio = data.get(

        "bio",

        recruiter.bio

    )

    recruiter.linkedin = data.get(

        "linkedin",

        recruiter.linkedin

    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter updated successfully"

    })


@recruiter_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    user = User.query.get(

        recruiter.user_id

    )

    if user:

        db.session.delete(user)

    db.session.delete(recruiter)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter deleted successfully"

    })

@recruiter_bp.route("/dashboard/<int:user_id>", methods=["GET"])
def recruiter_dashboard(user_id):

    recruiter = Recruiter.query.filter_by(

        user_id=user_id

    ).first()

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    jobs = Job.query.filter_by(

        recruiter_id=recruiter.id

    ).all()

    job_ids = [job.id for job in jobs]

    total_jobs = len(jobs)

    total_applications = 0

    pending = 0

    shortlisted = 0

    rejected = 0

    selected = 0

    interviews = 0

    completed = 0

    if len(job_ids) > 0:

        total_applications = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids)

        ).count()

        pending = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Applied"

        ).count()

        shortlisted = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Shortlisted"

        ).count()

        rejected = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Rejected"

        ).count()

        selected = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Selected"

        ).count()

        interviews = Interview.query.filter_by(

            recruiter_id=recruiter.id

        ).count()

        completed = Interview.query.filter(

            Interview.recruiter_id == recruiter.id,

            Interview.interview_status == "Completed"

        ).count()

from flask import Blueprint, jsonify, request

from extensions import db
from extensions import bcrypt

from models.user import User
from models.recruiter import Recruiter
from models.job import Job
from models.job_application import JobApplication
from models.interview import Interview

recruiter_bp = Blueprint(
    "recruiter",
    __name__,
    url_prefix="/recruiter"
)


@recruiter_bp.route("/all", methods=["GET"])
def get_all_recruiters():

    recruiters = Recruiter.query.all()

    return jsonify(

        [r.to_dict() for r in recruiters]

    )


@recruiter_bp.route("/<int:id>", methods=["GET"])
def get_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    return jsonify(

        recruiter.to_dict()

    )


@recruiter_bp.route("/create", methods=["POST"])
def create_recruiter():

    data = request.get_json()

    existing = User.query.filter_by(

        email=data["email"]

    ).first()

    if existing:

        return jsonify({

            "success": False,

            "message": "Email already exists"

        }), 409

    hashed_password = bcrypt.generate_password_hash(

        data["password"]

    ).decode("utf-8")

    user = User(

        full_name=data["full_name"],

        email=data["email"],

        password=hashed_password,

        role="Recruiter",

        phone=data.get("phone")

    )

    db.session.add(user)

    db.session.commit()

    recruiter = Recruiter(

        user_id=user.id,

        company_id=data["company_id"],

        designation=data["designation"],

        department=data.get("department"),

        experience=data.get("experience", 0),

        bio=data.get("bio"),

        linkedin=data.get("linkedin")

    )

    db.session.add(recruiter)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter created successfully",

        "login": {

            "email": user.email,

            "password": data["password"]

        }

    }), 201


@recruiter_bp.route("/update/<int:id>", methods=["PUT"])
def update_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    data = request.get_json()

    recruiter.designation = data.get(

        "designation",

        recruiter.designation

    )

    recruiter.department = data.get(

        "department",

        recruiter.department

    )

    recruiter.experience = data.get(

        "experience",

        recruiter.experience

    )

    recruiter.bio = data.get(

        "bio",

        recruiter.bio

    )

    recruiter.linkedin = data.get(

        "linkedin",

        recruiter.linkedin

    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter updated successfully"

    })


@recruiter_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_recruiter(id):

    recruiter = Recruiter.query.get(id)

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    user = User.query.get(

        recruiter.user_id

    )

    if user:

        db.session.delete(user)

    db.session.delete(recruiter)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Recruiter deleted successfully"

    })

@recruiter_bp.route("/dashboard/<int:user_id>", methods=["GET"])
def recruiter_dashboard(user_id):

    recruiter = Recruiter.query.filter_by(

        user_id=user_id

    ).first()

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    jobs = Job.query.filter_by(

        recruiter_id=recruiter.id

    ).all()

    job_ids = [job.id for job in jobs]

    total_jobs = len(jobs)

    total_applications = 0

    pending = 0

    shortlisted = 0

    rejected = 0

    selected = 0

    interviews = 0

    completed = 0

    if len(job_ids) > 0:

        total_applications = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids)

        ).count()

        pending = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Applied"

        ).count()

        shortlisted = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Shortlisted"

        ).count()

        rejected = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Rejected"

        ).count()

        selected = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids),

            JobApplication.application_status == "Selected"

        ).count()

        interviews = Interview.query.filter_by(

            recruiter_id=recruiter.id

        ).count()

        completed = Interview.query.filter(

            Interview.recruiter_id == recruiter.id,

            Interview.interview_status == "Completed"

        ).count()

    return jsonify({

        "designation": recruiter.designation,

        "department": recruiter.department,

        "experience": recruiter.experience,

        "jobs_posted": total_jobs,

        "applications": total_applications,

        "pending": pending,

        "shortlisted": shortlisted,

        "rejected": rejected,

        "selected": selected,

        "interviews": interviews,

        "completed": completed,

        "verified": recruiter.verified

    })