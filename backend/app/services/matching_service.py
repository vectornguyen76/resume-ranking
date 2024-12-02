import logging
from math import ceil

import config
import requests
from app.db import mongo
from bson.objectid import ObjectId
from flask_smorest import abort

# Create logger for this module
logger = logging.getLogger(__name__)


# Helper function to serialize MongoDB ObjectId
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


def get_all_matching():
    result = mongo.db.matching.find()
    return result


def process_matching(matching_data):
    job_name = matching_data["job_name"]
    job = mongo.db.job.find_one_or_404({"job_name": job_name})

    # Get all candidate
    candidates = mongo.db.candidate.find()

    # Loop matching to caculate score for each candidate
    for candidate in candidates:
        # Check exist analyse
        matching_exist = mongo.db.matching.find_one(
            {"job_id": job["_id"], "candidate_id": candidate["_id"]}
        )

        if matching_exist:
            logger.info(
                f"Matching exist candidate & job: {candidate['candidate_name']} - {job['job_name']}"
            )
            continue

        matching_analyse = {
            "candidate": serialize_doc(candidate),
            "job": serialize_doc(job),
        }

        logger.info(
            f"Matching candidate & job: {candidate['candidate_name']} - {job['job_name']}"
        )

        analysis_endpoint_url = f"{config.ANALYSIS_SERVICE_URL}/matching/analyse"
        response = requests.post(analysis_endpoint_url, json=matching_analyse)

        # Check response status and return appropriate response
        if response.status_code != 200:
            abort(400, message="Fail to analyse matching!")

        # Get the content of the response
        response_content = response.json()

        response_content["job_id"] = ObjectId(job["_id"])
        response_content["candidate_id"] = ObjectId(candidate["_id"])

        # Add to database
        try:
            collection = mongo.db.matching
            result = collection.insert_one(response_content)

            logger.info(f"id matching {result.inserted_id}")

        except Exception as e:
            logger.error(f"Upload document to Database failed! Error: {str(e)}")
            abort(400, message="Upload document to Database failed!")

    return {"message": "Analyse matching successfully!"}


def filter_matching_data(matching_data):
    job_name = matching_data["job_name"]

    # Query the JobModel to get the job_id based on the job_name
    job_exist = mongo.db.job.find_one({"job_name": job_name})

    job_id = job_exist["_id"] if job_exist is not None else "id"

    # Filter
    results = filter_page(
        page_size=matching_data["page_size"],
        page=matching_data["page"],
        job_id=job_id,
    )
    try:
        pass
    except Exception as e:
        logger.error(f"Can not get list file! Error: {str(e)}")
        abort(400, message="Can not get list file!")

    return results


def filter_page(page_size, page, job_id):
    page_size = 10 if page_size is None else page_size
    page = 1 if page is None else page - 1

    # Connect to MongoDB and get the collection
    collection_candidate = mongo.db.candidate

    # Count total documents in the collection
    total_file = collection_candidate.count_documents({})

    # Calculate total pages
    total_page = ceil(total_file / page_size)

    # Validate page and page_size
    if page < 0 or page_size < 0:
        abort(400, message="Page number or page size is invalid.")

    # Create an empty list to store the modified candidates with scores.
    modified_results = []

    for candidate in collection_candidate.find():
        matching = mongo.db.matching.find_one(
            {"job_id": job_id, "candidate_id": candidate["_id"]}
        )

        # print("job_id", job_id)
        # print("candidate_id", candidate["_id"])
        # print("job_id", type(job_id))
        # print("candidate_id", type(candidate["_id"]))
        # print(f"matching {matching}")

        if matching is not None:
            score = matching["score"]
            summary_comment = matching["summary_comment"]
            matching_status = True
        else:
            score = 0
            summary_comment = ""
            matching_status = False

        modified_results.append(
            {
                "id": candidate["_id"],
                "candidate_name": candidate["candidate_name"],
                "candidate_email": candidate["email"],
                "candidate_phone": candidate["phone_number"],
                "cv_name": candidate["cv_name"],
                "score": score,
                "summary_comment": summary_comment,
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
        "total_matching": total_file,
    }


def get_matching_data(candidate_id, job_id):
    matching = mongo.db.matching.find_one(
        {"job_id": ObjectId(job_id), "candidate_id": ObjectId(candidate_id)}
    )

    candidate = mongo.db.candidate.find_one({"_id": ObjectId(candidate_id)})

    if not matching:
        return candidate

    job = mongo.db.job.find_one({"_id": ObjectId(job_id)})

    matching["job_name"] = job["job_name"]

    return matching
