import hashlib
import logging
import time
from datetime import datetime
from math import ceil

import config
import requests
from app.db import mongo
from bson.objectid import ObjectId
from flask import request
from flask_smorest import abort
from pytz import timezone

# Create logger for this module
logger = logging.getLogger(__name__)


def get_candiate(candiate_id):
    collection = mongo.db.candidate
    result = collection.find_one_or_404({"_id": ObjectId(candiate_id)})
    return result


def get_list_candidate(file_data):
    page_size = file_data["page_size"]
    page = file_data["page"]

    if page_size is None:
        page_size = 10

    if page is None:
        page = 1

    try:
        results, total_page, total_file = filter_page(page_size=page_size, page=page)
    except Exception as e:
        logger.error(f"Can not get list file! Error: {str(e)}")
        abort(400, message="Can not get list file!")

    return {"results": results, "total_page": total_page, "total_file": total_file}


def filter_page(page_size=10, page=1):
    # Connect to MongoDB and get the collection
    collection = mongo.db.candidate

    # Count total documents in the collection
    total_file = collection.count_documents({})

    # Calculate total pages
    total_page = ceil(total_file / page_size)

    # Validate page and page_size
    if page < 1 or page_size < 1:
        abort(400, message="Page number or page size is invalid.")

    # Calculate skip and limit values for pagination
    skip = (page - 1) * page_size

    # Retrieve documents with pagination
    results = list(collection.find().skip(skip).limit(page_size))

    return results, total_page, total_file


def update_candidate(candidate_data, candidate_id):
    collection = mongo.db.candidate
    result = collection.update_one(
        {"_id": ObjectId(candidate_id)}, {"$set": candidate_data}
    )
    if result.modified_count == 1:
        return {"message": "Document updated successfully"}
    else:
        return abort("Document not found")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"pdf", "docx"}


def process_upload_file(file):
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # Check type pdf or docx
    if not allowed_file(file.filename):
        abort(400, message="Invalid file type. Allowed types: pdf, docx!")

    # Compute the SHA-256 hash of the file contents and convert it to hexadecimal
    filehash = hashlib.sha256(file.read()).hexdigest()

    # Check hashfile
    if mongo.db.candidate.find_one({"filehash": filehash}):
        abort(400, message=f"CV candidate is exists! File name: {file.filename}")

    # Move the cursor to the beginning of the file
    file.seek(0)

    analysis_endpoint_url = f"{config.ANALYSIS_SERVICE_URL}/candidate/analyse"
    files = {"file": (file.filename, file.stream, file.mimetype)}
    response = requests.post(analysis_endpoint_url, files=files)

    # Check response status and return appropriate response
    if response.status_code != 200:
        abort(400, message=f"Fail to analyse CV candidate! File name: {file.filename}")

    # Get the content of the response
    response_content = response.json()

    response_content["cv_name"] = file.filename
    response_content["created_at"] = created_at
    response_content["filehash"] = filehash

    # Add to database
    try:
        collection = mongo.db.candidate
        result = collection.insert_one(response_content)

        print("candidate_id", str(result.inserted_id))

    except Exception as e:
        logger.error(f"Upload document to Database failed! Error: {str(e)}")
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
        process_upload_file(file=file)

    logger.info(f"Time upload file: {time.time()-start_time:.2f}")

    return {"message": "File upload successful!"}


def delete_candidate(candidate_id):
    result = mongo.db.candidate.delete_one({"_id": ObjectId(candidate_id)})
    if result.deleted_count == 1:
        # Clean matching
        mongo.db.matching.delete_many({"candidate_id": ObjectId(candidate_id)})

        return {"message": "Document deleted successfully"}
    else:
        return abort("Document not found!")
