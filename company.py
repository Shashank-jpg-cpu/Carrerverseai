from flask import Blueprint
from flask import jsonify
from flask import request

from extensions import db
from extensions import bcrypt

from models.company import Company
from models.user import User

company_bp = Blueprint(
    "company",
    __name__,
    url_prefix="/company"
)


@company_bp.route("/all", methods=["GET"])
def get_all_companies():

    companies = Company.query.all()

    return jsonify(

        [company.to_dict() for company in companies]

    )


@company_bp.route("/<int:id>", methods=["GET"])
def get_company(id):

    company = Company.query.get(id)

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    return jsonify(

        company.to_dict()

    )


@company_bp.route("/create", methods=["POST"])
def create_company():

    data = request.get_json()

    existing = User.query.filter_by(

        email=data["company_email"]

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

        full_name=data["company_name"],

        email=data["company_email"],

        password=hashed_password,

        role="Company",

        phone=data["company_phone"]

    )

    db.session.add(user)

    db.session.commit()

    company = Company(

        user_id=user.id,

        company_name=data["company_name"],

        company_email=data["company_email"],

        company_phone=data["company_phone"],

        website=data["website"],

        industry=data["industry"],

        company_size=data["company_size"],

        founded_year=data["founded_year"],

        location=data["location"],

        address=data["address"],

        description=data["description"],

        linkedin=data["linkedin"],

        twitter=data["twitter"],

        facebook=data["facebook"],

        instagram=data["instagram"]

    )

    db.session.add(company)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Company Created Successfully",

        "login": {

            "email": user.email,

            "password": data["password"]

        }

    })


@company_bp.route("/update/<int:id>", methods=["PUT"])
def update_company(id):

    company = Company.query.get(id)

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    data = request.get_json()

    company.company_name = data["company_name"]
    company.company_email = data["company_email"]
    company.company_phone = data["company_phone"]
    company.website = data["website"]
    company.industry = data["industry"]
    company.company_size = data["company_size"]
    company.founded_year = data["founded_year"]
    company.location = data["location"]
    company.address = data["address"]
    company.description = data["description"]
    company.linkedin = data["linkedin"]
    company.twitter = data["twitter"]
    company.facebook = data["facebook"]
    company.instagram = data["instagram"]

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Company Updated Successfully"

    })


@company_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_company(id):

    company = Company.query.get(id)

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    user = User.query.get(company.user_id)

    if user:

        db.session.delete(user)

    db.session.delete(company)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Company Deleted Successfully"

    })

@company_bp.route("/profile/<int:user_id>", methods=["GET"])
def company_profile(user_id):

    from models.recruiter import Recruiter
    from models.job import Job

    company = Company.query.filter_by(

        user_id=user_id

    ).first()

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    recruiter_count = Recruiter.query.filter_by(

        company_id=company.id

    ).count()

    jobs = Job.query.filter_by(

        company_id=company.id

    ).count()

    return jsonify({

        "company_name": company.company_name,

        "company_email": company.company_email,

        "company_phone": company.company_phone,

        "website": company.website,

        "industry": company.industry,

        "company_size": company.company_size,

        "founded_year": company.founded_year,

        "location": company.location,

        "address": company.address,

        "description": company.description,

        "linkedin": company.linkedin,

        "twitter": company.twitter,

        "facebook": company.facebook,

        "instagram": company.instagram,

        "verified": company.verified,

        "recruiters": recruiter_count,

        "jobs": jobs

    })

@company_bp.route("/recruiters/<int:user_id>", methods=["GET"])
def company_recruiters(user_id):

    from models.recruiter import Recruiter
    from models.user import User
    from models.job import Job
    from models.job_application import JobApplication

    company = Company.query.filter_by(
        user_id=user_id
    ).first()

    if company is None:

        return jsonify([])

    recruiters = Recruiter.query.filter_by(
        company_id=company.id
    ).all()

    result = []

    for recruiter in recruiters:

        user = User.query.get(
            recruiter.user_id
        )

        jobs = Job.query.filter_by(
            recruiter_id=recruiter.id
        ).all()

        job_ids = [job.id for job in jobs]

        total_jobs = len(jobs)

        total_applications = 0

        total_selected = 0

        if len(job_ids) > 0:

            total_applications = JobApplication.query.filter(

                JobApplication.job_id.in_(job_ids)

            ).count()

            total_selected = JobApplication.query.filter(

                JobApplication.job_id.in_(job_ids),

                JobApplication.application_status == "Selected"

            ).count()

        result.append({

            "id": recruiter.id,

            "name": user.full_name,

            "email": user.email,

            "phone": user.phone,

            "designation": recruiter.designation,

            "department": recruiter.department,

            "experience": recruiter.experience,

            "verified": recruiter.verified,

            "jobs": total_jobs,

            "applications": total_applications,

            "hires": total_selected

        })

    return jsonify(result)
@company_bp.route("/jobs/<int:user_id>", methods=["GET"])
def company_jobs(user_id):

    from models.job import Job
    from models.recruiter import Recruiter
    from models.user import User
    from models.job_application import JobApplication

    company = Company.query.filter_by(
        user_id=user_id
    ).first()

    if company is None:

        return jsonify([])

    jobs = Job.query.filter_by(
        company_id=company.id
    ).all()

    result = []

    for job in jobs:

        recruiter = Recruiter.query.get(
            job.recruiter_id
        )

        recruiter_name = ""

        if recruiter:

            recruiter_user = User.query.get(
                recruiter.user_id
            )

            recruiter_name = recruiter_user.full_name

        applications = JobApplication.query.filter_by(
            job_id=job.id
        ).count()
        result.append({

    "id": job.id,

    "job_title": job.job_title,

    "job_code": job.job_code,

    "category": job.category,

    "location": job.location,

    "salary": f"₹{job.salary_min} - ₹{job.salary_max}",

    "deadline": job.application_deadline,

    "status": job.status,

    "recruiter": recruiter_name,

    "applications": applications

    })

    return jsonify(result) 

@company_bp.route("/dashboard/<int:user_id>", methods=["GET"])
def company_dashboard(user_id):

    from models.recruiter import Recruiter
    from models.job import Job
    from models.job_application import JobApplication
    from models.interview import Interview

    company = Company.query.filter_by(

        user_id=user_id

    ).first()

    if company is None:

        return jsonify({

            "success": False,

            "message": "Company not found"

        }), 404

    recruiters = Recruiter.query.filter_by(

        company_id=company.id

    ).all()

    recruiter_ids = [r.id for r in recruiters]

    total_recruiters = len(recruiters)

    jobs = Job.query.filter_by(

        company_id=company.id

    ).all()

    job_ids = [job.id for job in jobs]

    total_jobs = len(jobs)

    total_applications = 0
    shortlisted = 0
    rejected = 0
    selected = 0
    interviews = 0
    completed = 0

    if len(job_ids) > 0:

        total_applications = JobApplication.query.filter(

            JobApplication.job_id.in_(job_ids)

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

    if len(recruiter_ids) > 0:

        interviews = Interview.query.filter(

            Interview.recruiter_id.in_(recruiter_ids)

        ).count()

        completed = Interview.query.filter(

            Interview.recruiter_id.in_(recruiter_ids),

            Interview.interview_status == "Completed"

        ).count()

    hiring_rate = 0

    if total_applications > 0:

        hiring_rate = round(

            (selected / total_applications) * 100,

            2

        )

    return jsonify({

        "company_name": company.company_name,

        "industry": company.industry,

        "location": company.location,

        "website": company.website,

        "company_size": company.company_size,

        "verified": company.verified,

        "total_recruiters": total_recruiters,

        "active_jobs": total_jobs,

        "applications": total_applications,

        "shortlisted": shortlisted,

        "rejected": rejected,

        "selected": selected,

        "interviews": interviews,

        "completed_interviews": completed,

        "hiring_rate": hiring_rate

    })