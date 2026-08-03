from flask import Blueprint
from flask import jsonify
from flask import request
from flask import send_file

from werkzeug.utils import secure_filename

import os
import re
import pdfplumber

from docx import Document

from extensions import db

from models.resume import Resume
from models.student import Student



resume_bp = Blueprint(

    "resume",

    __name__,

    url_prefix="/resume"

)


UPLOAD_FOLDER = "uploads/resumes"

os.makedirs(

    UPLOAD_FOLDER,

    exist_ok=True

)


# ==================================================
# PDF / DOCX TEXT EXTRACTION
# ==================================================

def extract_resume_text(filepath):

    text = ""

    try:

        if filepath.lower().endswith(".pdf"):

            with pdfplumber.open(filepath) as pdf:

                for page in pdf.pages:

                    page_text = page.extract_text()

                    if page_text:

                        text += page_text + "\n"

        elif filepath.lower().endswith(".docx"):

            doc = Document(filepath)

            for para in doc.paragraphs:

                text += para.text + "\n"

    except Exception as e:

        print(e)

    return text.lower()


# ==================================================
# SIMPLE ATS ANALYZER
# ==================================================

def analyze_resume(text):

    score = 0

    strengths = []

    weaknesses = []

    keywords = [

        "python",
        "java",
        "sql",
        "mysql",
        "react",
        "javascript",
        "html",
        "css",
        "flask",
        "django",
        "machine learning",
        "power bi",
        "excel",
        "git",
        "github",
        "docker",
        "aws",
        "linux"

    ]

    sections = [

        "education",

        "skills",

        "project",

        "experience",

        "certification"

    ]

    found_keywords = []


    # -----------------------------
    # Email
    # -----------------------------

    if re.search(

        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",

        text

    ):

        score += 10

        strengths.append(

            "Professional email found."

        )

    else:

        weaknesses.append(

            "Email missing."

        )


    # -----------------------------
    # Phone
    # -----------------------------

    if re.search(

        r"\d{10}",

        text

    ):

        score += 10

        strengths.append(

            "Phone number present."

        )

    else:

        weaknesses.append(

            "Phone number missing."

        )


    # -----------------------------
    # Important Sections
    # -----------------------------

    for sec in sections:

        if sec in text:

            score += 10

        else:

            weaknesses.append(

                f"{sec.title()} section missing."

            )


    # -----------------------------
    # Skills
    # -----------------------------

    for skill in keywords:

        if skill in text:

            found_keywords.append(skill)

            score += 2


    if len(found_keywords) >= 8:

        strengths.append(

            "Excellent technical skills."

        )

    elif len(found_keywords) >= 5:

        strengths.append(

            "Good technical skills."

        )

    else:

        weaknesses.append(

            "Add more technical skills."

        )


    # -----------------------------
    # Resume Length
    # -----------------------------

    words = len(text.split())

    if words >= 300:

        score += 10

        strengths.append(

            "Resume has good content."

        )

    else:

        weaknesses.append(

            "Resume is too short."

        )


    ats_score = min(score, 100)

    grammar_score = 90

    keyword_score = min(

        len(found_keywords) * 5,

        100

    )

    overall_score = int(

        (

            ats_score +

            grammar_score +

            keyword_score

        ) / 3

    )

    return {

        "overall_score": overall_score,

        "ats_score": ats_score,

        "grammar_score": grammar_score,

        "keyword_score": keyword_score,

        "strengths": ", ".join(strengths),

        "weaknesses": ", ".join(weaknesses),

        "skills": ", ".join(found_keywords),

        "feedback": "Resume analyzed successfully."

    }

@resume_bp.route("/view/<int:id>", methods=["GET"])
def view_resume(id):

    resume = Resume.query.get(id)

    if resume is None:

        return jsonify({

            "success": False,

            "message": "Resume not found"

        }), 404

    return send_file(

        resume.file_path,

        as_attachment=False

    )
# ==================================================
# ========= CONTINUE WITH upload_resume() =========
# ==================================================

@resume_bp.route("/upload", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:

        return jsonify({

            "success": False,

            "message": "No file selected."

        }), 400

    file = request.files["resume"]

    if file.filename == "":

        return jsonify({

            "success": False,

            "message": "No file selected."

        }), 400

    user_id = request.form.get("student_id")

    student = Student.query.filter_by(

        user_id=user_id

    ).first()

    if student is None:

        return jsonify({

            "success": False,

            "message": "Student not found."

        }), 404

    filename = secure_filename(

        file.filename

    )

    filepath = os.path.join(

        UPLOAD_FOLDER,

        filename

    )

    file.save(filepath)

    # Make previous resume non-primary

    old_resume = Resume.query.filter_by(

        student_id=student.id,

        is_primary=True

    ).first()

    if old_resume:

        old_resume.is_primary = False

    # Read Resume Text

    resume_text = extract_resume_text(

        filepath

    )

    # Analyze Resume

    analysis = analyze_resume(

        resume_text

    )

    resume = Resume(

        student_id=student.id,

        resume_title=os.path.splitext(filename)[0],

        file_name=filename,

        file_path=filepath,

        file_size=os.path.getsize(filepath),

        file_type=filename.split(".")[-1].upper(),

        ai_score=analysis["overall_score"],

        ats_score=analysis["ats_score"],

        grammar_score=analysis["grammar_score"],

        keyword_score=analysis["keyword_score"],

        overall_score=analysis["overall_score"],

        analyzed=True,

        is_primary=True,

        strengths=analysis["strengths"],

        weaknesses=analysis["weaknesses"],

        suggested_skills=analysis["skills"],

        ai_feedback=analysis["feedback"]

    )

    db.session.add(

        resume

    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Resume Uploaded Successfully",

        "resume": resume.to_dict()

    })