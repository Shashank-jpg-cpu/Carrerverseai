from flask import Blueprint, jsonify, request

from extensions import db
from models.job import Job

job_bp = Blueprint(
    "job",
    __name__,
    url_prefix="/job"
)


@job_bp.route("/all", methods=["GET"])
def get_all_jobs():

    jobs = Job.query.all()

    return jsonify([job.to_dict() for job in jobs])


@job_bp.route("/<int:id>", methods=["GET"])
def get_job(id):

    job = Job.query.get(id)

    if job is None:

        return jsonify({

            "success": False,

            "message": "Job not found"

        }), 404

    return jsonify(job.to_dict())

@job_bp.route("/create", methods=["POST"])
def create_job():

    from models.recruiter import Recruiter
    from datetime import datetime

    data = request.get_json()

    recruiter = Recruiter.query.filter_by(

        user_id=data["user_id"]

    ).first()

    if recruiter is None:

        return jsonify({

            "success": False,

            "message": "Recruiter not found"

        }), 404

    job = Job(

        company_id=recruiter.company_id,

        recruiter_id=recruiter.id,

        job_title=data["job_title"],

        job_code="JOB" + datetime.now().strftime("%Y%m%d%H%M%S"),

        category=data.get("category"),

        employment_type=data.get("employment_type"),

        work_mode=data.get("work_mode"),

        experience=data.get("experience"),

        salary_min=data.get("salary_min"),

        salary_max=data.get("salary_max"),

        openings=data.get("openings", 1),

        location=data.get("location"),

        description=data["description"],

        responsibilities=data.get("responsibilities"),

        required_skills=data.get("required_skills"),

        preferred_skills=data.get("preferred_skills"),

        qualification=data.get("qualification"),

        application_deadline=data.get("application_deadline"),

        job_type=data.get("job_type", "Non-Tech"),

        test_subject_id=data.get("test_subject_id") if data.get("job_type") == "Tech" else None,

        test_num_questions=data.get("test_num_questions", 10)


    )

    db.session.add(job)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Job created successfully"

    }), 201

@job_bp.route("/update/<int:id>", methods=["PUT"])
def update_job(id):

    job = Job.query.get(id)

    if job is None:

        return jsonify({

            "success": False,

            "message": "Job not found"

        }), 404

    data = request.get_json()

    job.job_title = data.get(
        "job_title",
        job.job_title
    )

    job.category = data.get(
        "category",
        job.category
    )

    job.employment_type = data.get(
        "employment_type",
        job.employment_type
    )

    job.work_mode = data.get(
        "work_mode",
        job.work_mode
    )

    job.experience = data.get(
        "experience",
        job.experience
    )

    job.salary_min = data.get(
        "salary_min",
        job.salary_min
    )

    job.salary_max = data.get(
        "salary_max",
        job.salary_max
    )

    job.openings = data.get(
        "openings",
        job.openings
    )

    job.location = data.get(
        "location",
        job.location
    )

    job.description = data.get(
        "description",
        job.description
    )

    job.required_skills = data.get(
        "required_skills",
        job.required_skills
    )

    job.preferred_skills = data.get(
        "preferred_skills",
        job.preferred_skills
    )

    job.qualification = data.get(
        "qualification",
        job.qualification
    )

    job.job_type = data.get(
        "job_type",
        job.job_type
    )

    if job.job_type == "Tech":
        job.test_subject_id = data.get(
            "test_subject_id",
            job.test_subject_id
        )
        job.test_num_questions = data.get(
            "test_num_questions",
            job.test_num_questions
        )
    else:
        job.test_subject_id = None


    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Job updated successfully"

    })


@job_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_job(id):

    job = Job.query.get(id)

    if job is None:

        return jsonify({

            "success": False,

            "message": "Job not found"

        }), 404

    db.session.delete(job)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Job deleted successfully"

    })


@job_bp.route("/search", methods=["GET"])
def search_jobs():

    keyword = request.args.get("keyword", "")

    jobs = Job.query.filter(

        Job.job_title.ilike(f"%{keyword}%")

    ).all()

    return jsonify(

        [job.to_dict() for job in jobs]

    )

@job_bp.route("/recruiter/<int:user_id>", methods=["GET"])
def recruiter_jobs(user_id):

    from models.recruiter import Recruiter

    recruiter = Recruiter.query.filter_by(

        user_id=user_id

    ).first()

    if recruiter is None:

        return jsonify([])

    jobs = Job.query.filter_by(

        recruiter_id=recruiter.id

    ).all()

    return jsonify(

        [job.to_dict() for job in jobs]

    )
@job_bp.route("/dashboard", methods=["GET"])
def dashboard():

    jobs = Job.query.count()

    open_jobs = Job.query.filter_by(
        status="Open"
    ).count()

    closed_jobs = Job.query.filter_by(
        status="Closed"
    ).count()

    return jsonify({

        "total_jobs": jobs,

        "open_jobs": open_jobs,

        "closed_jobs": closed_jobs

    })