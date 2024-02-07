from app.db import db


class CandidateModel(db.Model):
    __tablename__ = "candidate"

    id = db.Column(db.Integer, primary_key=True)
    candidate_name = db.Column(db.String())
    candidate_phone = db.Column(db.String())
    candidate_email = db.Column(db.String())
    candidate_summary = db.Column(db.String())
    recommended_jobs = db.Column(db.String())
    cv_name = db.Column(db.String(), unique=True)
    cv_name_analyse = db.Column(db.String(), unique=True)
    cv_hash = db.Column(db.String())
    cv_type = db.Column(db.String())
    cv_size = db.Column(db.Integer)
    cv_date = db.Column(db.TIMESTAMP)

    jobs = db.relationship(
        "JobModel", back_populates="candidates", secondary="matching"
    )
