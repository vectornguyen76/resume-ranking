from app.schemas.candidate_schema import (
    CandidateFilterSchema,
    CandidatePageSchema,
    CandidateSchema,
    UpdateCandidateSchema,
)
from app.services import candidate_service
from flask.views import MethodView
from flask_smorest import Blueprint

blp = Blueprint("Candidate", __name__, description="Candidate API")


@blp.route("/upload-cv")
class UploadCV(MethodView):
    def post(self):
        result = candidate_service.upload_file_cv()
        return result


@blp.route("/list-candidate")
class ListCandidate(MethodView):
    @blp.arguments(CandidateFilterSchema)
    @blp.response(200, CandidatePageSchema)
    def post(self, candidate_data):
        result = candidate_service.get_list_candidate(candidate_data)
        return result


@blp.route("/candidate/<string:candidate_id>")
class Candidate(MethodView):
    @blp.response(200, CandidateSchema)
    def get(self, candidate_id):
        result = candidate_service.get_candiate(candidate_id)
        return result

    @blp.arguments(UpdateCandidateSchema)
    def put(self, candidate_data, candidate_id):
        result = candidate_service.update_candidate(candidate_data, candidate_id)
        return result

    def delete(self, candidate_id):
        result = candidate_service.delete_candidate(candidate_id)
        return result
