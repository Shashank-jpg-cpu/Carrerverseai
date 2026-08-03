import os

from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import init_extensions

load_dotenv()


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://"
        f"{os.getenv('DB_USER')}:"
        f"{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}:"
        f"{os.getenv('DB_PORT')}/"
        f"{os.getenv('DB_NAME')}"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)

    init_extensions(app)

    # =======================
    # Import Models
    # =======================

    from models.user import User
    from models.student import Student
    from models.company import Company
    from models.recruiter import Recruiter
    from models.job import Job
    from models.job_application import JobApplication
    from models.resume import Resume
    from models.notification import Notification
    from models.chat import Chat
    from models.interview import Interview
    from models.mock_subject import MockSubject
    from models.mock_question import MockQuestion
    from models.student_test_submission import StudentTestSubmission


    with app.app_context():
        from extensions import db
        db.create_all()
        seed_data(db)


    # =======================
    # Register Blueprints
    # =======================

    from routes.auth import auth_bp
    from routes.student import student_bp
    from routes.company import company_bp
    from routes.recruiter import recruiter_bp
    from routes.job import job_bp
    from routes.job_application import job_application_bp
    from routes.resume import resume_bp
    from routes.notification import notification_bp
    from routes.chat import chat_bp
    from routes.interview import interview_bp
    from routes.admin import admin_bp
    from routes.dashboard import dashboard_bp
    from routes.analytics import analytics_bp
    from routes.test import test_bp

    # Authentication
    app.register_blueprint(
        auth_bp,
        url_prefix="/auth"
    )

    # Other Modules
    app.register_blueprint(student_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(recruiter_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(job_application_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(notification_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(interview_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(test_bp)


    # =======================
    # Home Route
    # =======================

    @app.route("/")
    def home():

        return {
            "application": "CareerVerse AI",
            "version": "1.0.0",
            "status": "Running Successfully"
        }

    @app.route("/health")
    def health():

        return {
            "status": "OK",
            "database": "Connected"
        }

    return app


def seed_data(db):
    from models.mock_subject import MockSubject
    from models.mock_question import MockQuestion

    # 1. Seed Subjects
    subjects = ["Python", "SQL", "Python & SQL", "Java", "C++", "JavaScript", "Data Structures"]
    seeded_subjects = {}
    for sub_name in subjects:
        sub = MockSubject.query.filter_by(name=sub_name).first()
        if not sub:
            sub = MockSubject(name=sub_name)
            db.session.add(sub)
            db.session.commit()
        seeded_subjects[sub_name] = sub

    # 2. Seed Questions if empty
    if MockQuestion.query.count() == 0:
        questions = [
            # Python Questions
            {
                "subject": "Python",
                "question_text": "What does the following Python code output?",
                "code_snippet": "x = 2\ny = 3\nprint(x ^ y)",
                "option_a": "8",
                "option_b": "9",
                "option_c": "1",
                "option_d": "0",
                "correct_option": "C"
            },
            {
                "subject": "Python",
                "question_text": "What is the output of the following list slice?",
                "code_snippet": "nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])",
                "option_a": "[1, 2, 3]",
                "option_b": "[2, 3, 4]",
                "option_c": "[2, 3, 4, 5]",
                "option_d": "[1, 2, 3, 4]",
                "correct_option": "B"
            },
            {
                "subject": "Python",
                "question_text": "Which of the following data types is immutable in Python?",
                "code_snippet": None,
                "option_a": "List",
                "option_b": "Dictionary",
                "option_c": "Set",
                "option_d": "Tuple",
                "correct_option": "D"
            },
            {
                "subject": "Python",
                "question_text": "What is the output of this Python statement?",
                "code_snippet": "print(type([]) is list)",
                "option_a": "True",
                "option_b": "False",
                "option_c": "Error",
                "option_d": "None",
                "correct_option": "A"
            },
            {
                "subject": "Python",
                "question_text": "How do you add an element to the end of a list in Python?",
                "code_snippet": None,
                "option_a": "list.add(x)",
                "option_b": "list.append(x)",
                "option_c": "list.insert(x)",
                "option_d": "list.push(x)",
                "correct_option": "B"
            },
            # SQL Questions
            {
                "subject": "SQL",
                "question_text": "Which clause is used to filter group results in SQL?",
                "code_snippet": None,
                "option_a": "WHERE",
                "option_b": "HAVING",
                "option_c": "ORDER BY",
                "option_d": "GROUP BY",
                "correct_option": "B"
            },
            {
                "subject": "SQL",
                "question_text": "Which SQL statement is used to remove all records from a table without logging individual row deletions?",
                "code_snippet": None,
                "option_a": "DELETE",
                "option_b": "DROP",
                "option_c": "TRUNCATE",
                "option_d": "REMOVE",
                "correct_option": "C"
            },
            {
                "subject": "SQL",
                "question_text": "What does a LEFT JOIN return?",
                "code_snippet": None,
                "option_a": "All rows from the left table and matched rows from the right table",
                "option_b": "Only matched rows from both tables",
                "option_c": "All rows from the right table and matched rows from the left table",
                "option_d": "All rows from both tables",
                "correct_option": "A"
            },
            {
                "subject": "SQL",
                "question_text": "Which of the following is NOT a valid constraint in SQL?",
                "code_snippet": None,
                "option_a": "PRIMARY KEY",
                "option_b": "UNIQUE",
                "option_c": "FOREIGN KEY",
                "option_d": "INDEX",
                "correct_option": "D"
            },
            {
                "subject": "SQL",
                "question_text": "How do you select all columns from a table named 'Employees'?",
                "code_snippet": None,
                "option_a": "SELECT Employees.*",
                "option_b": "SELECT * FROM Employees",
                "option_c": "SELECT * Employees",
                "option_d": "GET * FROM Employees",
                "correct_option": "B"
            },
            # Java Questions
            {
                "subject": "Java",
                "question_text": "Which keyword is used to inherit a class in Java?",
                "code_snippet": None,
                "option_a": "implements",
                "option_b": "extends",
                "option_c": "inherits",
                "option_d": "super",
                "correct_option": "B"
            },
            # C++ Questions
            {
                "subject": "C++",
                "question_text": "Which of the following operators is used to access memory through pointers?",
                "code_snippet": None,
                "option_a": "&",
                "option_b": "*",
                "option_c": "->",
                "option_d": ".",
                "correct_option": "B"
            },
            # JavaScript Questions
            {
                "subject": "JavaScript",
                "question_text": "What is the output of the following comparison?",
                "code_snippet": "console.log(false == '0')",
                "option_a": "true",
                "option_b": "false",
                "option_c": "undefined",
                "option_d": "TypeError",
                "correct_option": "A"
            },
            # Data Structures
            {
                "subject": "Data Structures",
                "question_text": "What is the worst-case time complexity of searching in a Balanced Binary Search Tree (like AVL)?",
                "code_snippet": None,
                "option_a": "O(1)",
                "option_b": "O(log n)",
                "option_c": "O(n)",
                "option_d": "O(n log n)",
                "correct_option": "B"
            },
            {
                "subject": "Data Structures",
                "question_text": "Which data structure operates on a Last In First Out (LIFO) basis?",
                "code_snippet": None,
                "option_a": "Queue",
                "option_b": "Stack",
                "option_c": "Heap",
                "option_d": "Tree",
                "correct_option": "B"
            }
        ]

        # First add direct questions to specific subjects
        for q in questions:
            subject_name = q["subject"]
            sub = seeded_subjects[subject_name]
            q_model = MockQuestion(
                subject_id=sub.id,
                question_text=q["question_text"],
                code_snippet=q["code_snippet"],
                option_a=q["option_a"],
                option_b=q["option_b"],
                option_c=q["option_c"],
                option_d=q["option_d"],
                correct_option=q["correct_option"]
            )
            db.session.add(q_model)
        db.session.commit()

        # Secondly, add duplicates of all Python and SQL questions to the combined "Python & SQL" subject
        combined_sub = seeded_subjects["Python & SQL"]
        combined_questions = [q for q in questions if q["subject"] in ["Python", "SQL"]]
        for q in combined_questions:
            q_model = MockQuestion(
                subject_id=combined_sub.id,
                question_text=q["question_text"],
                code_snippet=q["code_snippet"],
                option_a=q["option_a"],
                option_b=q["option_b"],
                option_c=q["option_c"],
                option_d=q["option_d"],
                correct_option=q["correct_option"]
            )
            db.session.add(q_model)
        db.session.commit()



app = create_app()


if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )