from app.schemas.matching_schema import *
from app.services import matching_service
from flask.views import MethodView
from flask_smorest import Blueprint

blp = Blueprint("Matching", __name__, description="Matching API")


@blp.route("/process-matching")
class Matching(MethodView):
    @blp.arguments(MatchingSchema)
    def post(self, matching_data):
        result = matching_service.process_matching(matching_data)
        return result


@blp.route("/data-matching")
class MatchingFilter(MethodView):
    @blp.arguments(MatchingFilterPageSchema)
    @blp.response(200, MatchingPageSchema)
    def post(self, matching_data):
        result = matching_service.filter_candidate_matching(matching_data)
        return result


@blp.route("/candidate/<int:candidate_id>/job/<int:job_id>")
class GetMatchingData(MethodView):
    @blp.response(200, MatchingDetailSchema)
    def get(self, candidate_id, job_id):
        result = matching_service.get_matching_data(candidate_id, job_id)
        return result
