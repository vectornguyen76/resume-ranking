import json
import logging
import os
from datetime import datetime
from math import ceil

import config
from analysis_service.main import DocumentAnalyzer
from app.db import db
from app.models.candidate_model import CandidateModel
from app.models.job_model import JobModel
from app.models.matching_model import MatchingModel
from flask_smorest import abort
from pytz import timezone
from sqlalchemy import asc, desc

# Create logger for this module
logger = logging.getLogger(__name__)


def json_filename(file_name):
    """abc.pdf >>> abc.json"""
    base_name, file_extension = os.path.splitext(file_name)
    json_filename = base_name + ".json"
    return json_filename


def json2string(path):
    with open(path) as f:
        data = json.load(f)
    return data


def process_matching(matching_data):
    job_name = matching_data["job_name"]

    job = JobModel.query.filter_by(job_name=job_name).first()

    if not job:
        abort(400, message="job not found!")

    analyzer = DocumentAnalyzer()

    # Get all candidate
    candidates = CandidateModel.query.order_by(asc(CandidateModel.id)).all()

    # Loop matching to caculate score for each candidate
    for candidate in candidates:
        # Check exist analyse
        matching_records = MatchingModel.query.filter_by(
            candidate_id=candidate.id, job_id=job.id
        ).first()
        if matching_records:
            continue

        cv_file_name = analyzer.json_filename(candidate.cv_name_analyse)
        job_file_name = job_name + ".json"

        result = analyzer.analyse_matching(cv_file_name, job_file_name)

        # Get score return and save to database
        try:
            matching = MatchingModel(
                job_id=job.id,
                candidate_id=candidate.id,
                score=str(int(result["score"])),
                comment=result["comment"],
            )
            db.session.add(matching)
            db.session.commit()
        except:
            db.session.rollback()
            abort(400, message="Can not add Matching!")

    return {"message": "Analyse matching successfully!"}


def filter_candidate_matching(matching_data):
    job_name = matching_data["job_name"]

    # Query the JobModel to get the job_id based on the job_name
    job = JobModel.query.filter_by(job_name=job_name).first()

    job_id = job.id if job is not None else -1

    results = CandidateModel.query.order_by(asc(CandidateModel.id))

    # Filter
    results = filter_page(
        results,
        page_size=matching_data["page_size"],
        page=matching_data["page"],
        job_id=job_id,
    )
    try:
        pass
    except:
        logger.error("Can not get list file!")
        abort(400, message="Can not get list file!")

    return results


def filter_page(results, page_size, page, job_id):
    if page_size == None:
        page_size = 10

    if page == None:
        page = 1

    else:
        page = page - 1

    total_matching = results.count()
    total_page = ceil(total_matching / page_size)

    if page < 0 or page_size < 0:
        abort(400, message="Number page or page size is wrong!")

    # Create an empty list to store the modified candidates with scores.
    modified_results = []

    for candidate in results:
        matching_records = MatchingModel.query.filter_by(
            candidate_id=candidate.id, job_id=job_id
        ).first()
        if matching_records is not None:
            score = matching_records.score
            comment = matching_records.comment
            matching_status = True
        else:
            score = 0
            comment = ""
            matching_status = False

        modified_results.append(
            {
                "id": candidate.id,
                "candidate_name": candidate.candidate_name,
                "candidate_email": candidate.candidate_email,
                "candidate_phone": candidate.candidate_phone,
                "cv_name": candidate.cv_name,
                "score": score,
                "comment": comment,
                "matching_status": matching_status,
            }
        )

    modified_results = sorted(
        modified_results, key=lambda candidate: int(candidate["score"]), reverse=True
    )

    # Implement pagination on the modified_results list.
    start_index = page * page_size
    end_index = start_index + page_size
    paginated_results = modified_results[start_index:end_index]

    return {
        "results": paginated_results,
        "total_page": total_page,
        "total_matching": total_matching,
    }


def get_matching_data(candidate_id, job_id):
    candidate = CandidateModel.query.filter_by(id=candidate_id).first()
    matching = MatchingModel.query.filter_by(
        candidate_id=candidate_id, job_id=job_id
    ).first()

    if not matching:
        return candidate

    matching.candidate_name = candidate.candidate_name
    matching.candidate_phone = candidate.candidate_phone
    matching.cv_name = candidate.cv_name
    matching.recommended_jobs = candidate.recommended_jobs
    job = JobModel.query.filter_by(id=job_id).first()

    # Read file analysis matching
    base_cv_name, _ = os.path.splitext(candidate.cv_name_analyse)
    path_file = config.MATCHING_ANALYSIS_DIR + f"{job.job_name}-{base_cv_name}.json"
    data_matching = json2string(path=path_file)

    matching.job_name = job.job_name

    matching.education_comment = data_matching["Degree"]["comments"]
    matching.education_score = data_matching["Degree"]["score"]

    matching.experiment_comment = data_matching["Experience"]["comments"]
    matching.experiment_score = data_matching["Experience"]["score"]

    matching.responsibilities_comment = data_matching["Responsibilities"]["comments"]
    matching.responsibilities_score = data_matching["Responsibilities"]["score"]

    matching.certification_comment = data_matching["Certificates"]["comments"]
    matching.certification_score = data_matching["Certificates"]["score"]

    matching.soft_skills_comment = data_matching["SoftSkills"]["comments"]
    matching.soft_skills_score = data_matching["SoftSkills"]["score"]

    matching.technical_skills_comment = data_matching["TechnicalSkills"]["comments"]
    matching.technical_skills_score = data_matching["TechnicalSkills"]["score"]

    return matching
