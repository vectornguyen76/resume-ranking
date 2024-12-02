from app.schemas.job_schema import (
    PlainJobSchema,
    CreateUpdateJobSchema,
    JobFilterPageSchema,
    JobPageSchema,
)
from app.services import job_service
from flask.views import MethodView
from flask_smorest import Blueprint

blp = Blueprint("Job", __name__, description="Job API")


@blp.route("/job")
class JobList(MethodView):
    @blp.response(200, PlainJobSchema(many=True))
    def get(self):
        result = job_service.get_all_job()
        return result

    @blp.arguments(CreateUpdateJobSchema)
    @blp.response(200, PlainJobSchema())
    def post(self, job_data):
        result = job_service.post_job(job_data)
        return result


@blp.route("/job-page")
class JobPageList(MethodView):
    @blp.arguments(JobFilterPageSchema)
    @blp.response(200, JobPageSchema)
    def post(self, job_data):
        result = job_service.get_list_job(job_data)
        return result


@blp.route("/job/<string:job_id>")
class JobQnA(MethodView):
    @blp.response(200, PlainJobSchema)
    def get(self, job_id):
        result = job_service.get_job(job_id)
        return result

    @blp.arguments(CreateUpdateJobSchema)
    def put(self, job_data, job_id):
        result = job_service.update_job(job_data, job_id)
        return result

    def delete(self, job_id):
        result = job_service.delete_job(job_id)
        return result
