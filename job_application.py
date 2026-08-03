from flask import Blueprint
from flask import jsonify
from flask import request

from extensions import db

from models.job_application import JobApplication

job_application_bp = Blueprint(
    "job_application",
    __name__,
    url_prefix="/application"
)


@job_application_bp.route("/all", methods=["GET"])
def get_all_applications():

    applications = JobApplication.query.order_by(
        JobApplication.applied_at.desc()
    ).all()

    return jsonify(

        [application.to_dict() for application in applications]

    )


@job_application_bp.route("/<int:id>", methods=["GET"])
def get_application(id):

    application = JobApplication.query.get(id)

    if application is None:

        return jsonify({

            "success": False,

            "message": "Application not found"

        }), 404

    return jsonify(

        application.to_dict()

    )

@job_application_bp.route("/apply", methods=["POST"])
def apply_job():

    from models.student import Student
    from models.job import Job

    data = request.get_json()

    user_id = data.get("student_id")
    job_id = data.get("job_id")

    student = Student.query.filter_by(
        user_id=user_id
    ).first()

    if student is None:

        return jsonify({

            "success": False,
            "message": "Student profile not found."

        }), 404

    job = Job.query.get(job_id)

    if job is None:

        return jsonify({

            "success": False,
            "message": "Job not found."

        }), 404

    existing = JobApplication.query.filter_by(

        student_id=student.id,
        job_id=job_id

    ).first()

    if existing:

        return jsonify({

            "success": False,
            "message": "You have already applied for this job."

        }), 400

    application = JobApplication(

        student_id=student.id,

        job_id=job_id,

        resume_id=data.get("resume_id"),

        cover_letter=data.get("cover_letter"),

        expected_salary=data.get("expected_salary"),

        notice_period=data.get("notice_period"),

        application_status="Mock Test Pending" if job.job_type == "Tech" else "Applied"

    )

    db.session.add(application)

    job.total_applications += 1

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Job Application Submitted Successfully",

        "application_id": application.id

    }), 201

@job_application_bp.route("/update/<int:id>", methods=["PUT"])
def update_application(id):

    application = JobApplication.query.get(id)

    if application is None:

        return jsonify({

            "success": False,

            "message": "Application not found"

        }), 404

    data = request.get_json()

    application.cover_letter = data.get(

        "cover_letter",

        application.cover_letter

    )

    application.expected_salary = data.get(

        "expected_salary",

        application.expected_salary

    )

    application.notice_period = data.get(

        "notice_period",

        application.notice_period

    )

    application.recruiter_remark = data.get(

        "recruiter_remark",

        application.recruiter_remark

    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Application Updated Successfully"

    })

@job_application_bp.route("/status/<int:id>", methods=["PUT"])
def update_status(id):

    from models.student import Student

    application = JobApplication.query.get(id)

    if application is None:

        return jsonify({

            "success": False,

            "message": "Application not found"

        }), 404

    data = request.get_json()

    application.application_status = data.get(

        "application_status",

        application.application_status

    )

    application.recruiter_remark = data.get(

        "recruiter_remark",

        application.recruiter_remark

    )

    student = Student.query.get(application.student_id)

    if student:

        if application.application_status == "Applied":

            student.placement_status = "Applied"

        elif application.application_status == "Shortlisted":

            student.placement_status = "Shortlisted"

        elif application.application_status == "Selected":

            student.placement_status = "Placed"

        elif application.application_status == "Rejected":

            student.placement_status = "Rejected"

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Application Status Updated Successfully"

    })
@job_application_bp.route("/student/<int:user_id>", methods=["GET"])
def student_applications(user_id):

    from models.student import Student
    from models.job import Job

    student = Student.query.filter_by(

        user_id=user_id

    ).first()

    if student is None:

        return jsonify([])

    applications = JobApplication.query.filter_by(

        student_id=student.id

    ).order_by(

        JobApplication.applied_at.desc()

    ).all()

    result = []

    for application in applications:

        job = Job.query.get(

            application.job_id

        )

        result.append({

            "id": application.id,

            "job_id": application.job_id,

            "job_title": job.job_title if job else "Job Deleted",

            "company_id": job.company_id if job else None,

            "application_status": application.application_status,

            "applied_at": application.applied_at,

            "resume_id": application.resume_id,

            "cover_letter": application.cover_letter,

            "expected_salary": application.expected_salary,

            "notice_period": application.notice_period,

            "recruiter_remark": application.recruiter_remark,

            "test_subject_name": job.test_subject.name if (job and job.test_subject) else None,

            "test_num_questions": job.test_num_questions if job else 10

        })

    return jsonify(result)
@job_application_bp.route("/job/<int:job_id>", methods=["GET"])
def job_applications(job_id):

    applications = JobApplication.query.filter_by(

        job_id=job_id

    ).all()

    return jsonify(

        [application.to_dict() for application in applications]

    )


@job_application_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_application(id):

    application = JobApplication.query.get(id)

    if application is None:

        return jsonify({

            "success": False,

            "message": "Application not found"

        }), 404

    db.session.delete(application)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Application Deleted Successfully"

    })
@job_application_bp.route("/recruiter/<int:user_id>", methods=["GET"])
def recruiter_applications(user_id):

    from models.recruiter import Recruiter
    from models.job import Job

    recruiter = Recruiter.query.filter_by(

        user_id=user_id

    ).first()

    if recruiter is None:

        return jsonify([])

    jobs = Job.query.filter_by(

        recruiter_id=recruiter.id

    ).all()

    job_ids = [job.id for job in jobs]

    if len(job_ids) == 0:

        return jsonify([])

    applications = JobApplication.query.filter(

        JobApplication.job_id.in_(job_ids)

    ).order_by(

        JobApplication.applied_at.desc()

    ).all()

    return jsonify(

        [application.to_dict() for application in applications]

    )

@job_application_bp.route("/details/<int:id>", methods=["GET"])
def application_details(id):

    from models.student import Student
    from models.job import Job
    from models.resume import Resume
    from models.user import User

    application = JobApplication.query.get(id)

    if application is None:

        return jsonify({

            "success": False,

            "message": "Application not found"

        }), 404

    student = Student.query.get(application.student_id)

    job = Job.query.get(application.job_id)

    user = User.query.get(student.user_id)

    resume = Resume.query.filter_by(

        student_id=student.id,

        is_primary=True

    ).first()

    return jsonify({

        "application": application.to_dict(),

        "student": {

            "name": user.full_name,

            "email": user.email,

            "phone": user.phone,

            "college": student.college,

            "degree": student.degree,

            "branch": student.branch,

            "semester": student.semester,

            "cgpa": student.cgpa,

            "skills": student.skills,

            "linkedin": student.linkedin,

            "github": student.github,

            "portfolio": student.portfolio

        },

        "resume": resume.to_dict() if resume else None,

        "job": job.to_dict()

    })

@job_application_bp.route("/dashboard", methods=["GET"])
def dashboard():

    total = JobApplication.query.count()

    applied = JobApplication.query.filter_by(
        application_status="Applied"
    ).count()

    shortlisted = JobApplication.query.filter_by(
        application_status="Shortlisted"
    ).count()

    rejected = JobApplication.query.filter_by(
        application_status="Rejected"
    ).count()

    selected = JobApplication.query.filter_by(
        application_status="Selected"
    ).count()

    return jsonify({

        "total": total,

        "applied": applied,

        "shortlisted": shortlisted,

        "rejected": rejected,

        "selected": selected

    })