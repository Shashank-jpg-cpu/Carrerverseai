from database import db

class MockQuestion(db.Model):
    __tablename__ = "mock_questions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    subject_id = db.Column(
        db.Integer,
        db.ForeignKey("mock_subjects.id", ondelete="CASCADE"),
        nullable=False
    )

    question_text = db.Column(
        db.Text,
        nullable=False
    )

    code_snippet = db.Column(
        db.Text,
        nullable=True
    )

    option_a = db.Column(
        db.String(255),
        nullable=False
    )

    option_b = db.Column(
        db.String(255),
        nullable=False
    )

    option_c = db.Column(
        db.String(255),
        nullable=False
    )

    option_d = db.Column(
        db.String(255),
        nullable=False
    )

    correct_option = db.Column(
        db.String(1),
        nullable=False
    )

    subject = db.relationship(
        "MockSubject",
        backref=db.backref(
            "questions",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "subject_id": self.subject_id,
            "subject_name": self.subject.name if self.subject else None,
            "question_text": self.question_text,
            "code_snippet": self.code_snippet,
            "option_a": self.option_a,
            "option_b": self.option_b,
            "option_c": self.option_c,
            "option_d": self.option_d
        }

    def to_dict_full(self):
        d = self.to_dict()
        d["correct_option"] = self.correct_option
        return d

    def __repr__(self):
        return f"<MockQuestion {self.id}>"
