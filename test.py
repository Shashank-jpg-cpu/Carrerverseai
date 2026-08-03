import random
from datetime import datetime
from flask import Blueprint, jsonify, request
from extensions import db
from models.mock_subject import MockSubject
from models.mock_question import MockQuestion
from models.student_test_submission import StudentTestSubmission
from models.job_application import JobApplication
from models.student import Student
from models.job import Job

test_bp = Blueprint("test", __name__, url_prefix="/test")

@test_bp.route("/subjects", methods=["GET"])
def get_subjects():
    subjects = MockSubject.query.all()
    return jsonify([sub.to_dict() for sub in subjects]), 200

@test_bp.route("/subjects/create", methods=["POST"])
def create_subject():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"success": False, "message": "Subject name is required."}), 400

    existing = MockSubject.query.filter_by(name=name).first()
    if existing:
        return jsonify({"success": False, "message": "Subject already exists."}), 400

    subject = MockSubject(name=name)
    db.session.add(subject)
    db.session.commit()
    return jsonify({"success": True, "message": "Subject created successfully.", "subject": subject.to_dict()}), 201

@test_bp.route("/questions/create", methods=["POST"])
def create_question():
    data = request.get_json()
    subject_id = data.get("subject_id")
    question_text = data.get("question_text")
    code_snippet = data.get("code_snippet")
    option_a = data.get("option_a")
    option_b = data.get("option_b")
    option_c = data.get("option_c")
    option_d = data.get("option_d")
    correct_option = data.get("correct_option") # 'A', 'B', 'C', 'D'

    if not subject_id or not question_text or not option_a or not option_b or not option_c or not option_d or not correct_option:
        return jsonify({"success": False, "message": "Missing required fields."}), 400

    subject = MockSubject.query.get(subject_id)
    if not subject:
        return jsonify({"success": False, "message": "Subject not found."}), 404

    # If the subject is "Python" or "SQL", let's also automatically add this question to the combined "Python & SQL" subject if it exists
    combined_subject = MockSubject.query.filter_by(name="Python & SQL").first()

    question = MockQuestion(
        subject_id=subject_id,
        question_text=question_text,
        code_snippet=code_snippet,
        option_a=option_a,
        option_b=option_b,
        option_c=option_c,
        option_d=option_d,
        correct_option=correct_option.upper()
    )
    db.session.add(question)
    db.session.commit()

    if combined_subject and subject.name in ["Python", "SQL"]:
        # Duplicate question to Python & SQL combined pool
        dup_question = MockQuestion(
            subject_id=combined_subject.id,
            question_text=question_text,
            code_snippet=code_snippet,
            option_a=option_a,
            option_b=option_b,
            option_c=option_c,
            option_d=option_d,
            correct_option=correct_option.upper()
        )
        db.session.add(dup_question)
        db.session.commit()

    return jsonify({"success": True, "message": "Question created successfully.", "question": question.to_dict_full()}), 201

@test_bp.route("/job/<int:job_id>", methods=["GET"])
def get_job_test(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"success": False, "message": "Job not found."}), 404

    if not job.test_subject_id:
        return jsonify({"success": False, "message": "This job does not have a configured mock test."}), 400

    # Fetch all questions for this subject
    questions = MockQuestion.query.filter_by(subject_id=job.test_subject_id).all()
    if not questions:
        return jsonify({"success": False, "message": "No mock questions found for this subject."}), 404

    # Sample a random subset
    num_to_select = min(job.test_num_questions, len(questions))
    selected_questions = random.sample(questions, num_to_select)

    # Return safe serialization (without correct answers)
    return jsonify([q.to_dict() for q in selected_questions]), 200

@test_bp.route("/application/<int:application_id>/submit", methods=["POST"])
def submit_test(application_id):
    app_record = JobApplication.query.get(application_id)
    if not app_record:
        return jsonify({"success": False, "message": "Job application not found."}), 404

    student = Student.query.get(app_record.student_id)
    if not student:
        return jsonify({"success": False, "message": "Student record not found."}), 404

    data = request.get_json()
    answers = data.get("answers", {}) # mapping of question_id (string/int) to selected_option (A/B/C/D)
    tab_switch_count = data.get("tab_switch_count", 0)
    terminated_due_to_cheating = data.get("terminated_due_to_cheating", False)

    score_percentage = 0.0

    if terminated_due_to_cheating:
        # Cheated: Score is 0
        score_percentage = 0.0
    else:
        correct_count = 0
        total_questions = len(answers)

        if total_questions > 0:
            for q_id, selected_opt in answers.items():
                question = MockQuestion.query.get(int(q_id))
                if question and question.correct_option == selected_opt.upper():
                    correct_count += 1
            score_percentage = (correct_count / total_questions) * 100

    # Save test submission
    submission = StudentTestSubmission(
        student_id=student.id,
        job_id=app_record.job_id,
        score=score_percentage,
        tab_switch_count=tab_switch_count
    )
    db.session.add(submission)

    # Update Student Coding Score (store the average or update with the latest score)
    student.coding_score = int(score_percentage)

    # Process score routing
    if score_percentage >= 75.0 and not terminated_due_to_cheating:
        # Pass -> Shortlist
        app_record.application_status = "Shortlisted"
        student.placement_status = "Shortlisted"
        passed = True
        msg = f"Congratulations! You scored {score_percentage:.1f}% and passed the mock test."
    else:
        # Fail -> Reject
        app_record.application_status = "Rejected"
        student.placement_status = "Rejected"
        passed = False
        if terminated_due_to_cheating:
            msg = "Mock test terminated due to excessive tab switching (cheating detected)."
        else:
            msg = f"Better luck next time. You scored {score_percentage:.1f}%, which is below the 75% threshold."

    db.session.commit()

    return jsonify({
        "success": True,
        "message": msg,
        "score": score_percentage,
        "passed": passed,
        "tab_switch_count": tab_switch_count,
        "application_status": app_record.application_status
    }), 200
