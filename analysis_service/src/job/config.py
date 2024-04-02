from pydantic_settings import BaseSettings


class JobConfig(BaseSettings):
    MODEL_NAME: str = "gpt-3.5-turbo-16k"


job_config = JobConfig()
