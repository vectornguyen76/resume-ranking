from pydantic_settings import BaseSettings


class CandidateConfig(BaseSettings):
    MODEL_NAME: str = "gpt-3.5-turbo-16k"

    CV_UPLOAD_DIR: str = "./candidate_cv/"


candidate_config = CandidateConfig()
