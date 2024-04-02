import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

basedir = os.path.abspath(os.path.dirname(__file__))

ENVIRONMENT = os.getenv(key="ENVIRONMENT", default="DEVELOP")

if ENVIRONMENT == "DEVELOP":
    # Load environment variables from the .env file
    load_dotenv()


class Settings(BaseSettings):
    # App config
    APP_NAME: str = "API Analysis Service"
    APP_ENV: str = "develop"

    # Logging setting
    DATE_FMT: str = "%Y-%m-%d %H:%M:%S"
    LOG_DIR: str = f"{basedir}/logs/api.log"


settings = Settings()
