from pydantic_settings import BaseSettings


class JobConfig(BaseSettings):
    MODEL_NAME: str = "gpt-4.1-mini"


job_config = JobConfig()
