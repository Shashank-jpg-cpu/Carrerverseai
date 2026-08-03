from flask import Blueprint, jsonify, request

from extensions import db
from models.interview import Interview

interview_bp = Blueprint(
    "interview",
    __name__,
    url_prefix="/interview"
)


@interview_bp.route("/all", methods=["GET"])
def get_all_interviews():

    interviews = Interview.query.order_by(
        Interview.interview_date.desc()
    ).all()

    return jsonify(
        [interview.to_dict() for interview in interviews]
    )


@interview_bp.route("/<int:id>", methods=["GET"])
def get_interview(id):

    interview = Interview.query.get(id)

    if interview is None:

        return jsonify({
            "success": False,
            "message": "Interview not found"
        }), 404

    return jsonify(interview.to_dict())

@interview_bp.route("/schedule", methods=["POST"])
def schedule_interview():

    from models.job_application import JobApplication
    from models.job import Job

    data = request.get_json()

    application = JobApplication.query.get(data["application_id"])

    if application is None:

        return jsonify({
            "success": False,
            "message": "Application not found"
        }), 404

    job = Job.query.get(application.job_id)

    if job is None:

        return jsonify({
            "success": False,
            "message": "Job not found"
        }), 404

    interview = Interview(

        application_id=application.id,

        recruiter_id=job.recruiter_id,

        student_id=application.student_id,

        interview_title=data.get(
            "interview_title",
            "Technical Interview"
        ),

        interview_type=data.get(
            "interview_type",
            "Technical"
        ),

        interview_mode=data.get(
            "interview_mode",
            "Online"
        ),

        interview_date=data["interview_date"],

        interview_time=data["interview_time"],

        duration=data.get(
            "duration",
            60
        ),

        meeting_link=data.get(
            "meeting_link",
            ""
        ),

        meeting_password=data.get(
            "meeting_password",
            ""
        ),

        location=data.get(
            "location",
            ""
        ),

        interviewer_name=data.get(
            "interviewer_name",
            ""
        ),

        interviewer_email=data.get(
            "interviewer_email",
            ""
        )

    )

    db.session.add(interview)

    application.application_status = "Interview Scheduled"

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Interview Scheduled Successfully",

    }), 201

@interview_bp.route("/update/<int:id>", methods=["PUT"])
def update_interview(id):

    interview = Interview.query.get(id)

    if interview is None:
        return jsonify({
            "success": False,
            "message": "Interview not found"
        }), 404

    data = request.get_json()

    interview.interview_status = data.get(
        "interview_status",
        interview.interview_status
    )

    interview.result = data.get(
        "result",
        interview.result
    )

    interview.feedback = data.get(
        "feedback",
        interview.feedback
    )

    interview.rating = data.get(
        "rating",
        interview.rating
    )

    # Update application status when interview is completed
    if interview.interview_status == "Completed":
        from models.job_application import JobApplication

        application = JobApplication.query.get(interview.application_id)

        if application:
            application.application_status = "Interview Completed"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Interview Updated Successfully"
    })
@interview_bp.route("/student/<int:student_id>", methods=["GET"])
def student_interviews(student_id):

    interviews = Interview.query.filter_by(

        student_id=student_id

    ).all()

    return jsonify(

        [interview.to_dict() for interview in interviews]

    )


@interview_bp.route("/recruiter/<int:user_id>", methods=["GET"])
def recruiter_interviews(user_id):

    from models.recruiter import Recruiter

    recruiter = Recruiter.query.filter_by(
        user_id=user_id
    ).first()

    if recruiter is None:
        return jsonify([])

    interviews = Interview.query.filter_by(
        recruiter_id=recruiter.id
    ).order_by(
        Interview.interview_date.desc()
    ).all()

    return jsonify(

        [interview.to_dict() for interview in interviews]

    )


@interview_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_interview(id):

    interview = Interview.query.get(id)

    if interview is None:

        return jsonify({

            "success": False,

            "message": "Interview not found"

        }), 404

    db.session.delete(interview)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Interview Deleted Successfully"

    })


@interview_bp.route("/dashboard", methods=["GET"])
def dashboard():

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

        "total_interviews": total,

        "scheduled": scheduled,

        "completed": completed,

        "cancelled": cancelled

    })