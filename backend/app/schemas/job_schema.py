from marshmallow import Schema, fields


class PlainJobSchema(Schema):
    _id = fields.Str(dump_only=True)
    job_name = fields.Str()
    job_description = fields.Str()
    created_at = fields.Str()
    degree = fields.List(fields.Str())
    experience = fields.List(fields.Str())
    technical_skill = fields.List(fields.Str())
    responsibility = fields.List(fields.Str())
    soft_skill = fields.List(fields.Str())
    certificate = fields.List(fields.Str())


class CreateUpdateJobSchema(Schema):
    job_name = fields.Str(required=True)
    job_description = fields.Str(required=True)


class JobFilterPageSchema(Schema):
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)


class JobPageSchema(Schema):
    results = fields.List(fields.Nested(PlainJobSchema()))
    total_page = fields.Int()
    total_job = fields.Int()


class JobDetailSchema(Schema):
    id = fields.Int(dump_only=True)
    job_name = fields.Str(required=True)
    education = fields.List(fields.Str())
    certification = fields.List(fields.Str())
    experiment = fields.List(fields.Str())
    responsibilities = fields.List(fields.Str())
    soft_skills = fields.List(fields.Str())
    technical_skills = fields.List(fields.Str())
    created_at = fields.Str(dump_only=True)
