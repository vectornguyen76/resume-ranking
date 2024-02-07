from marshmallow import Schema, fields


class MatchingSchema(Schema):
    job_name = fields.Str(required=True)


class MatchingFilterPageSchema(Schema):
    job_name = fields.Str(required=True)
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)


class PlainMatchingSchema(Schema):
    id = fields.Int(dump_only=True)
    candidate_name = fields.Str(required=True)
    candidate_email = fields.Str(required=True)
    candidate_email = fields.Str(required=True)
    cv_name = fields.Str(required=True)
    score = fields.Str(required=True)
    comment = fields.Str(required=True)
    matching_status = fields.Bool(required=True)


class MatchingPageSchema(Schema):
    results = fields.List(fields.Nested(PlainMatchingSchema()))
    total_page = fields.Int()
    total_matching = fields.Int()


class MatchingDetailSchema(Schema):
    id = fields.Int(dump_only=True)
    candidate_name = fields.Str(required=True)
    candidate_phone = fields.Str(required=True)
    cv_name = fields.Str(required=True)
    job_name = fields.Str(required=True)
    score = fields.Str(required=True)
    comment = fields.Str(required=True)
    recommended_jobs = fields.Str(required=True)
    education_comment = fields.Str(required=True)
    education_score = fields.Str(required=True)
    experiment_comment = fields.Str(required=True)
    experiment_score = fields.Str(required=True)
    responsibilities_comment = fields.Str(required=True)
    responsibilities_score = fields.Str(required=True)
    certification_comment = fields.Str(required=True)
    certification_score = fields.Str(required=True)
    soft_skills_comment = fields.Str(required=True)
    soft_skills_score = fields.Str(required=True)
    technical_skills_comment = fields.Str(required=True)
    technical_skills_score = fields.Str(required=True)
