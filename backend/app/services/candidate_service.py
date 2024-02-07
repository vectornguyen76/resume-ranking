import hashlib
import json
import logging
import os
import time
from datetime import datetime
from math import ceil

import config
from analysis_service.main import DocumentAnalyzer
from app.db import db
from app.models.candidate_model import CandidateModel
from app.models.matching_model import MatchingModel
from app.schemas.candidate_schema import UploadFileSchema
from flask import request
from flask_smorest import abort
from pytz import timezone
from sqlalchemy import asc

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


def get_candiate(candiate_id):
    results = CandidateModel.query.filter_by(id=candiate_id).first()

    if not results:
        abort(400, message="job not found!")

    path_file = config.CV_ANALYSIS_DIR + json_filename(results.cv_name_analyse)
    data_candidate = json2string(path=path_file)

    results.education = data_candidate["Degree"]
    results.experiment = data_candidate["Experience"]
    results.responsibilities = data_candidate["Responsibilities"]
    results.certification = data_candidate["Certificates"]
    results.soft_skills = data_candidate["SoftSkills"]
    results.technical_skills = data_candidate["TechnicalSkills"]

    return results


def get_list_candidate(file_data):
    results = CandidateModel.query.order_by(asc(CandidateModel.id))
    try:
        results = filter_page(
            results, page_size=file_data["page_size"], page=file_data["page"]
        )
    except:
        logger.error("Can not get list file!")
        abort(400, message="Can not get list file!")

    return results


def filter_page(results, page_size, page):
    if page_size == None:
        page_size = 10

    if page == None:
        page = 1

    else:
        page = page - 1

    total_file = results.count()
    total_page = ceil(total_file / page_size)

    if page < 0 or page_size < 0:
        abort(400, message="Number page or page size is wrong!")

    results = results.limit(page_size)
    results = results.offset(page * page_size)

    return {"results": results, "total_page": total_page, "total_file": total_file}


def process_upload_file(single_file):
    try:
        schema = UploadFileSchema()
        result = schema.load({"file_upload": single_file})

        # Get PDF file
        file_upload = result["file_upload"]

        # Add datetime
        time_upload = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
            "%Y%m%d%H%M%S-"
        )

        filename = time_upload + file_upload.filename
        logger.info(f"Filename: {filename}")
        filesize = len(file_upload.read())

        # Get hash
        file_upload.seek(0)
        filehash = hashlib.sha256(file_upload.read()).hexdigest()

        # Check if the file already exists in the database
        file_upload_new = CandidateModel.query.filter_by(cv_hash=filehash).first()
        if file_upload_new:
            # File already exists in the database
            logger.error("File is duplicate!")
            return {"message": "File is duplicate!"}, 409

        # Save the file to disk
        file_upload.seek(0)
        file_upload.save(os.path.join(config.CV_UPLOAD_DIR, f"{filename}"))

        # Get type file
        file_type = filename.split(".")[-1]
        file_name_upload = file_upload.filename.split(".")[0]
    except:
        logger.error("File incorrect format!")
        abort(400, message="File incorrect format")

    # Analyse Candidate
    try:
        analyzer = DocumentAnalyzer()
        output_analysis = analyzer.analyse_candidate(file_name=filename)
    except:
        logger.error("Can not analyse Candidate!")
        abort(400, message="Can not analyse Candidate!")

    # Add to database
    try:
        candidate_name = (
            output_analysis["name"]
            if output_analysis["name"] != ""
            else file_name_upload
        )
        current_datetime = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        file_upload_new = CandidateModel(
            candidate_name=candidate_name,
            candidate_phone=output_analysis["phone"],
            candidate_email=output_analysis["email"],
            candidate_summary=output_analysis["summary"],
            recommended_jobs=output_analysis["recommended_jobs"],
            cv_name=file_upload.filename,
            cv_name_analyse=filename,
            cv_hash=filehash,
            cv_type=file_type,
            cv_size=filesize,
            cv_date=current_datetime,
        )
        db.session.add(file_upload_new)
        db.session.commit()
    except:
        logger.error("Upload document to Database failed!")
        abort(400, message="Upload document to Database failed!")

    return None


def upload_file_cv():
    start_time = time.time()
    logger.info(request.files)
    logger.info(request.files.getlist("file_upload"))
    uploaded_files = request.files.getlist("file_upload")

    if len(uploaded_files) == 0:
        abort(400, message="Upload document to Database failed!")

    for file in uploaded_files:
        process_upload_file(single_file=file)

    logger.info(f"Time upload file: {time.time()-start_time:.2f}")

    return {"message": "File upload successful!"}


def delete_candidate(candidate_id):
    # Delete File in Database
    candidate = CandidateModel.query.filter_by(id=candidate_id).first()

    logger.info(f"Delete CV candidate: {candidate.cv_name}")

    # Delete in database
    try:
        MatchingModel.query.filter_by(candidate_id=candidate_id).delete()
        CandidateModel.query.filter_by(id=candidate_id).delete()
        db.session.commit()
    except:
        logger.error(f"Can not delete File: {candidate.cv_name} in database")
        abort(400, message="File Upload doesn't exist, cannot delete!")

    return {"message": "Delete successfully!"}
