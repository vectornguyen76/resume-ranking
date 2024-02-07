from app.controllers.candidate_controller import blp as CandidateBlueprint
from app.controllers.job_controller import blp as JobBlueprint
from app.controllers.matching_controller import blp as MatchingBlueprint
from flask_smorest import Api


# Register Blueprint
def register_routing(app):
    api = Api(app)
    api.register_blueprint(CandidateBlueprint)
    api.register_blueprint(JobBlueprint)
    api.register_blueprint(MatchingBlueprint)
