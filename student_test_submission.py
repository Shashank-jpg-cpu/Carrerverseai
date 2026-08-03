from datetime import datetime
from database import db

class StudentTestSubmission(db.Model):
    __tablename__ = "student_test_submissions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    job_id = db.Column(
        db.Integer,
        db.ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    score = db.Column(
        db.Float,
        default=0.0
    )

    tab_switch_count = db.Column(
        db.Integer,
        default=0
    )

    completed_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    student = db.relationship(
        "Student",
        backref=db.backref(
            "test_submissions",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

    job = db.relationship(
        "Job",
        backref=db.backref(
            "test_submissions",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "job_id": self.job_id,
            "job_title": self.job.job_title if self.job else None,
            "score": self.score,
            "tab_switch_count": self.tab_switch_count,
            "completed_at": self.completed_at
        }

    def __repr__(self):
        return f"<StudentTestSubmission {self.id}>"
