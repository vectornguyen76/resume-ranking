from pydantic_settings import BaseSettings


class MachingConfig(BaseSettings):
    MODEL_NAME: str = "gpt-3.5-turbo-16k"


matching_config = MachingConfig()
