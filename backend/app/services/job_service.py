import logging
from datetime import datetime
from math import ceil

import config
import requests
from app.db import mongo
from bson.objectid import ObjectId
from flask_smorest import abort
from pytz import timezone

# Create logger for this module
logger = logging.getLogger(__name__)


def get_all_job():
    collection = mongo.db.job
    result = collection.find()

    return result


def post_job(job_data):
    job_data["job_name"] = job_data["job_name"].strip()
    job_data["job_description"] = job_data["job_description"].strip()
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    analysis_endpoint_url = f"{config.ANALYSIS_SERVICE_URL}/job/analyse"
    response = requests.post(analysis_endpoint_url, json=job_data)

    # Check response status and return appropriate response
    if response.status_code != 200:
        abort(400, message=f"Fail to analyse job! Job name: {job_data['job_name']}")

    # Get the content of the response
    response_content = response.json()

    response_content["job_name"] = job_data["job_name"]
    response_content["job_description"] = job_data["job_description"]
    response_content["created_at"] = created_at

    # Add to database
    try:
        collection = mongo.db.job
        result = collection.insert_one(response_content)

        print("job_id", str(result.inserted_id))

    except Exception as e:
        logger.error(f"Upload document to Database failed! Error: {str(e)}")
        abort(400, message="Upload document to Database failed!")

    return response_content


def get_list_job(job_data):
    page_size = job_data["page_size"]
    page = job_data["page"]

    if page_size is None:
        page_size = 10

    if page is None:
        page = 1

    try:
        results, total_page, total_job = filter_page(page_size=page_size, page=page)
    except Exception as e:
        logger.error(f"Can not get list file! Error: {str(e)}")
        abort(400, message="Can not get list file!")

    return {"results": results, "total_page": total_page, "total_job": total_job}


def filter_page(page_size=10, page=1):
    # Connect to MongoDB and get the collection
    collection = mongo.db.job

    # Count total documents in the collection
    total_job = collection.count_documents({})

    # Calculate total pages
    total_page = ceil(total_job / page_size)

    # Validate page and page_size
    if page < 1 or page_size < 1:
        abort(400, message="Page number or page size is invalid.")

    # Calculate skip and limit values for pagination
    skip = (page - 1) * page_size

    # Retrieve documents with pagination
    results = list(collection.find().skip(skip).limit(page_size))

    return results, total_page, total_job


def get_job(job_id):
    collection = mongo.db.job
    result = collection.find_one_or_404({"_id": ObjectId(job_id)})
    return result


def update_job(job_data, job_id):
    job_data["job_name"] = job_data["job_name"].strip()
    job_data["job_description"] = job_data["job_description"].strip()
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    collection = mongo.db.job
    job_exist = collection.find_one_or_404({"_id": ObjectId(job_id)})

    if (
        job_exist["job_name"] != job_data["job_name"]
        or job_exist["job_description"] != job_data["job_description"]
    ):
        logger.info("Update analyse job")

        analysis_endpoint_url = f"{config.ANALYSIS_SERVICE_URL}/job/analyse"
        response = requests.post(analysis_endpoint_url, json=job_data)

        # Check response status and return appropriate response
        if response.status_code != 200:
            abort(400, message=f"Fail to analyse job! Job name: {job_data['job_name']}")

        # Get the content of the response
        response_content = response.json()

        response_content["job_name"] = job_data["job_name"]
        response_content["job_description"] = job_data["job_description"]
        response_content["created_at"] = created_at

        result = collection.update_one(
            {"_id": ObjectId(job_id)}, {"$set": response_content}
        )

        if result.modified_count == 1:
            return {"message": "Document updated successfully"}
        else:
            return abort("Document not found")

    return {"message": "Document updated successfully"}


def delete_job(job_id):
    result = mongo.db.job.delete_one({"_id": ObjectId(job_id)})
    if result.deleted_count == 1:
        # Clean matching
        mongo.db.matching.delete_many({"job_id": ObjectId(job_id)})

        return {"message": "Document deleted successfully"}
    else:
        return abort("Document not found!")
