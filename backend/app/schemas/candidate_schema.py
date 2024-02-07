from marshmallow import Schema, ValidationError, fields, validates_schema


class UploadFileSchema(Schema):
    file_upload = fields.Field(required=True)

    @validates_schema
    def validate_pdf_or_doc_file(self, data, **kwargs):
        file_upload = data["file_upload"]
        if not (
            file_upload.filename.endswith(".pdf")
            or file_upload.filename.endswith(".docx")
            or file_upload.filename.endswith(".PDF")
            or file_upload.filename.endswith(".DOCX")
        ):
            raise ValidationError("File must be a PDF or DOCX")


class PlainCandidateSchema(Schema):
    id = fields.Int(dump_only=True)
    candidate_name = fields.Str()
    candidate_phone = fields.Str()
    candidate_email = fields.Str()
    candidate_summary = fields.Str()
    recommended_jobs = fields.Str()
    cv_name = fields.Str()
    cv_hash = fields.Str()
    cv_type = fields.Str()
    cv_size = fields.Int()
    cv_date = fields.Str(dump_only=True)


class CandidateDetailSchema(Schema):
    id = fields.Int(dump_only=True)
    candidate_name = fields.Str()
    candidate_phone = fields.Str()
    candidate_email = fields.Str()
    candidate_summary = fields.Str()
    recommended_jobs = fields.Str()
    cv_name = fields.Str()
    cv_hash = fields.Str()
    cv_type = fields.Str()
    cv_size = fields.Int()
    education = fields.List(fields.Str())
    certification = fields.List(fields.Str())
    experiment = fields.List(fields.Str())
    responsibilities = fields.List(fields.Str())
    soft_skills = fields.List(fields.Str())
    technical_skills = fields.List(fields.Str())
    cv_date = fields.Str(dump_only=True)


class CandidateSchema(Schema):
    results = fields.List(fields.Nested(PlainCandidateSchema()))
    total_page = fields.Int()
    total_file = fields.Int()


class CandidateFilterSchema(Schema):
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)
