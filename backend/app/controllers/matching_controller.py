from app.schemas.matching_schema import (
    ProcessMatchingSchema,
    MatchingSchema,
    MatchingFilterPageSchema,
    MatchingPageSchema,
    MatchingDetailSchema,
)
from app.services import matching_service
from flask.views import MethodView
from flask_smorest import Blueprint

blp = Blueprint("Matching", __name__, description="Matching API")


@blp.route("/process-matching")
class Matching(MethodView):
    @blp.arguments(ProcessMatchingSchema)
    def post(self, matching_data):
        result = matching_service.process_matching(matching_data)
        return result


@blp.route("/data-matching")
class MatchingFilter(MethodView):
    @blp.response(200, MatchingSchema(many=True))
    def get(self):
        result = matching_service.get_all_matching()
        return result

    @blp.arguments(MatchingFilterPageSchema)
    @blp.response(200, MatchingPageSchema)
    def post(self, matching_data):
        result = matching_service.filter_matching_data(matching_data)
        return result


@blp.route("/candidate/<string:candidate_id>/job/<string:job_id>")
class GetMatchingData(MethodView):
    @blp.response(200, MatchingDetailSchema)
    def get(self, candidate_id, job_id):
        result = matching_service.get_matching_data(candidate_id, job_id)
        return result
