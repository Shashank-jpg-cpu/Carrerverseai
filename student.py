from flask import Blueprint
from flask import jsonify
from flask import request

from extensions import db

from models.student import Student

student_bp = Blueprint(
    "student",
    __name__,
    url_prefix="/student"
)


@student_bp.route("/all", methods=["GET"])
def get_all_students():

    students = Student.query.all()

    return jsonify(

        [student.to_dict() for student in students]

    )


@student_bp.route("/<int:id>", methods=["GET"])
def get_student(id):

    student = Student.query.get(id)

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found"

        }), 404

    return jsonify(

        student.to_dict()

    )


@student_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):

    student = Student.query.filter_by(

        user_id=user_id

    ).first()

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found"

        }), 404

    return jsonify(

        student.to_dict()

    )


@student_bp.route("/profile/update/<int:user_id>", methods=["PUT"])
def update_profile(user_id):

    student = Student.query.filter_by(

        user_id=user_id

    ).first()

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found"

        }), 404

    data = request.get_json()

    student.college = data.get(

        "college",

        student.college

    )

    student.university = data.get(

        "university",

        student.university

    )

    student.degree = data.get(

        "degree",

        student.degree

    )

    student.branch = data.get(

        "branch",

        student.branch

    )

    student.semester = data.get(

        "semester",

        student.semester

    )

    student.cgpa = data.get(

        "cgpa",

        student.cgpa

    )

    student.skills = data.get(

        "skills",

        student.skills

    )

    student.linkedin = data.get(

        "linkedin",

        student.linkedin

    )

    student.github = data.get(

        "github",

        student.github

    )

    student.portfolio = data.get(

        "portfolio",

        student.portfolio

    )

    student.profile_summary = data.get(

        "profile_summary",

        student.profile_summary

    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Profile Updated Successfully"

    })


@student_bp.route("/create", methods=["POST"])
def create_student():

    data = request.get_json()

    student = Student(

        user_id=data["user_id"],

        college=data["college"],

        university=data["university"],

        degree=data["degree"],

        branch=data["branch"],

        semester=data["semester"],

        usn=data["usn"],

        cgpa=data["cgpa"],

        skills=data["skills"],

        linkedin=data["linkedin"],

        github=data["github"],

        portfolio=data["portfolio"],

        profile_summary=data["profile_summary"]

    )

    db.session.add(student)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Student Created Successfully"

    })


@student_bp.route("/update/<int:id>", methods=["PUT"])
def update_student(id):

    student = Student.query.get(id)

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found"

        }), 404

    data = request.get_json()

    student.college = data.get("college", student.college)

    student.university = data.get("university", student.university)

    student.degree = data.get("degree", student.degree)

    student.branch = data.get("branch", student.branch)

    student.semester = data.get("semester", student.semester)

    student.cgpa = data.get("cgpa", student.cgpa)

    student.skills = data.get("skills", student.skills)

    student.linkedin = data.get("linkedin", student.linkedin)

    student.github = data.get("github", student.github)

    student.portfolio = data.get("portfolio", student.portfolio)

    student.profile_summary = data.get(

        "profile_summary",

        student.profile_summary

    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Student Updated Successfully"

    })


@student_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_student(id):

    student = Student.query.get(id)

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found"

        }), 404

    db.session.delete(student)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Student Deleted Successfully"

    })
@student_bp.route("/dashboard/<int:id>", methods=["GET"])
def dashboard(id):

    from models.job_application import JobApplication
    from models.interview import Interview
    from models.resume import Resume

    student = Student.query.filter_by(
        user_id=id
    ).first()

    if student is None:

        return jsonify({

            "success": False,
            "message": "Student not found"

        }), 404

    # Total Applications
    total_applications = JobApplication.query.filter_by(
        student_id=student.id
    ).count()

    # Total Interviews
    total_interviews = Interview.query.filter_by(
        student_id=student.id
    ).count()

    # Latest Resume
    resume = Resume.query.filter_by(
        student_id=student.id
    ).order_by(
        Resume.id.desc()
    ).first()

    ai_resume_score = 0

    if resume:
        ai_resume_score = resume.ai_score or 0

    # Profile Completion
    fields = [

        student.college,
        student.university,
        student.degree,
        student.branch,
        student.skills,
        student.linkedin,
        student.github,
        student.portfolio,
        student.profile_summary

    ]

    completed = len(
        [f for f in fields if f not in [None, "", "NULL"]]
    )

    profile_completion = int(
        (completed / len(fields)) * 100
    )

    return jsonify({

        "student_name": student.user.full_name,

        "college": student.college,

        "cgpa": student.cgpa,

        "total_applications": total_applications,

        "total_interviews": total_interviews,

        "ai_resume_score": ai_resume_score,

        "certificates": student.certificates,

        "coding_score": student.coding_score,

        "profile_completion": profile_completion,

        "placement_status": student.placement_status

    })