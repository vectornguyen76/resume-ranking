from marshmallow import Schema, fields


class ProcessMatchingSchema(Schema):
    job_name = fields.Str(required=True)


class AnalyseSchema(Schema):
    comment = fields.Str()
    score = fields.Int()


class MatchingSchema(Schema):
    _id = fields.Str()
    candidate_id = fields.Str()
    job_id = fields.Str()
    degree = fields.Nested(AnalyseSchema())
    experience = fields.Nested(AnalyseSchema())
    responsibility = fields.Nested(AnalyseSchema())
    soft_skill = fields.Nested(AnalyseSchema())
    technical_skill = fields.Nested(AnalyseSchema())
    certificate = fields.Nested(AnalyseSchema())
    summary_comment = fields.Str()
    score = fields.Float()


class MatchingFilterPageSchema(Schema):
    job_name = fields.Str(required=True)
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)


class PlainMatchingSchema(Schema):
    id = fields.Str(dump_only=True)
    candidate_name = fields.Str(required=True)
    candidate_email = fields.Str(required=True)
    candidate_email = fields.Str(required=True)
    cv_name = fields.Str(required=True)
    score = fields.Str(required=True)
    summary_comment = fields.Str(required=True)
    matching_status = fields.Bool(required=True)


class MatchingPageSchema(Schema):
    results = fields.List(fields.Nested(PlainMatchingSchema()))
    total_page = fields.Int()
    total_matching = fields.Int()


class MatchingDetailSchema(Schema):
    _id = fields.Str()
    candidate_name = fields.Str()
    phone_number = fields.Str()
    email = fields.Str()
    cv_name = fields.Str()
    job_recommended = fields.List(fields.Str())
    job_name = fields.Str()
    score = fields.Str()
    summary_comment = fields.Str()
    degree = fields.Nested(AnalyseSchema())
    experience = fields.Nested(AnalyseSchema())
    responsibility = fields.Nested(AnalyseSchema())
    soft_skill = fields.Nested(AnalyseSchema())
    technical_skill = fields.Nested(AnalyseSchema())
    certificate = fields.Nested(AnalyseSchema())
