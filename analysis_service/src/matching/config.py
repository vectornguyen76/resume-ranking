from pydantic_settings import BaseSettings


class MachingConfig(BaseSettings):
    MODEL_NAME: str = "gpt-4.1-mini"


matching_config = MachingConfig()
