from marshmallow import Schema, fields


class UpdateCandidateSchema(Schema):
    candidate_name = fields.Str(required=True)
    phone_number = fields.Str(required=True)
    email = fields.Str(required=True)
    comment = fields.Str(required=True)


class CandidateSchema(Schema):
    _id = fields.Str(dump_only=True)
    candidate_name = fields.Str()
    phone_number = fields.Str()
    email = fields.Str()
    comment = fields.Str()
    certificate = fields.List(fields.Str())
    degree = fields.List(fields.Str())
    experience = fields.List(fields.Str())
    technical_skill = fields.List(fields.Str())
    responsibility = fields.List(fields.Str())
    soft_skill = fields.List(fields.Str())
    job_recommended = fields.List(fields.Str())
    cv_name = fields.Str()
    created_at = fields.Str()
    sql = fields.Int()
    office = fields.Int()


class CandidatePageSchema(Schema):
    results = fields.List(fields.Nested(CandidateSchema()))
    total_page = fields.Int()
    total_file = fields.Int()


class CandidateFilterSchema(Schema):
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)
