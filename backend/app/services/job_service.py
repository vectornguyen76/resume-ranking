import json
import logging
from datetime import datetime
from math import ceil

import config
from analysis_service.main import DocumentAnalyzer
from app.db import db
from app.models.job_model import JobModel
from app.models.matching_model import MatchingModel
from flask_smorest import abort
from pytz import timezone
from sqlalchemy import asc, desc

# Create logger for this module
logger = logging.getLogger(__name__)


def filter_page(results, page_size, page):
    # Filter page
    if page_size == None:
        page_size = 10

    if page == None:
        page = 1

    # Start with 1
    else:
        page = page - 1

    # Get total page
    total_job = results.count()
    total_page = ceil(total_job / page_size)

    if page < 0 or page_size < 0:
        abort(400, message="Number page or page size is wrong!")

    results = results.limit(page_size)
    results = results.offset(page * page_size)

    return {"results": results, "total_page": total_page, "total_job": total_job}


def get_job_page(job_data):
    results = JobModel.query.order_by(asc(JobModel.id))
    try:
        results = filter_page(
            results, page_size=job_data["page_size"], page=job_data["page"]
        )
    except:
        abort(400, message="Can not get Job!")

    return results


def get_all_job():
    results = JobModel.query.order_by(asc(JobModel.id)).all()
    return results


def post_job(job_data):
    job_name = job_data["job_name"].strip()
    job_description = job_data["job_description"].strip()
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # Analyse Job
    try:
        analyzer = DocumentAnalyzer()
        analyzer.analyse_job(job_name=job_name, job_description=job_description)
    except:
        logger.error("Can not analyse Job!")
        abort(400, message="Can not analyse Job!")

    # Add to database
    try:
        new_job = JobModel(
            job_name=job_name, job_description=job_description, created_at=created_at
        )

        db.session.add(new_job)
        db.session.commit()
    except:
        db.session.rollback()
        abort(400, message="Can not add job!")

    return {"message": "Add successfully!"}


def get_job(job_id):
    results = JobModel.query.filter_by(id=job_id).first()

    if not results:
        abort(400, message="job not found!")

    return results


def update_job(job_data, job_id):
    job_name = job_data["job_name"].strip()
    job_description = job_data["job_description"].strip()

    job_exist = JobModel.query.filter_by(id=job_id).first()

    if not job_exist:
        abort(400, message="job doesn't exist, cannot update!")

    try:
        if (
            job_exist.job_name != job_name
            or job_exist.job_description != job_description
        ):
            logger.info("Update analyse job")

            # Update analyse job name
            try:
                analyzer = DocumentAnalyzer()
                analyzer.analyse_job(job_name=job_name, job_description=job_description)
            except:
                logger.error("Can not analyse Job!")
                abort(400, message="Can not analyse Job!")

        if job_name:
            job_exist.job_name = job_name

        if job_description:
            job_exist.job_description = job_description

        db.session.commit()
    except:
        db.session.rollback()
        abort(400, message="Can not update job!")

    return {"message": "Update successfully!"}


def delete_job(job_id):
    job = JobModel.query.filter_by(id=job_id).first()

    logger.info(f"Delete job_name: {job.job_name}")

    # Delete job in Database
    try:
        MatchingModel.query.filter_by(job_id=job_id).delete()
        JobModel.query.filter_by(id=job_id).delete()

        db.session.commit()
    except:
        abort(400, message="Can not delete job in Database!")

    return {"message": "Delete successfully!"}


def json2string(path):
    with open(path) as f:
        data = json.load(f)
    return data


def get_job_detail(job_id):
    results = JobModel.query.filter_by(id=job_id).first()

    if not results:
        abort(400, message="job not found!")

    path_file = config.JOB_ANALYSIS_DIR + results.job_name + ".json"
    data_job = json2string(path=path_file)

    results.education = data_job["Degree"]
    results.experiment = data_job["Experience"]
    results.responsibilities = data_job["Responsibilities"]
    results.certification = data_job["Certificates"]
    results.soft_skills = data_job["SoftSkills"]
    results.technical_skills = data_job["TechnicalSkills"]

    return results
