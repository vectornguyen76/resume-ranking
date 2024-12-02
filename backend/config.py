import os

basedir = os.path.abspath(os.path.dirname(__file__))

ANALYSIS_SERVICE_URL = os.environ.get("ANALYSIS_SERVICE_URL")


class DefaultConfig:
    """
    Default Configuration
    """

    # Flask Configuration
    APP_NAME = os.environ.get("APP_NAME")
    SECRET_KEY = os.environ.get("SECRET_KEY")
    PROPAGATE_EXCEPTIONS = True
    DEBUG = False
    TESTING = False

    # Config API documents
    API_TITLE = "Template REST API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/swagger-ui"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    # Database configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SHOW_SQLALCHEMY_LOG_MESSAGES = False

    # App Environments
    APP_ENV_LOCAL = "local"
    APP_ENV_TESTING = "testing"
    APP_ENV_DEVELOP = "develop"
    APP_ENV_PRODUCTION = "production"
    APP_ENV = ""

    # Logging
    DATE_FMT = "%Y-%m-%d %H:%M:%S"
    LOG_FILE_API = f"{basedir}/logs/api.log"


class DevelopConfig(DefaultConfig):
    # App environment
    APP_ENV = DefaultConfig.APP_ENV_DEVELOP

    # Activate debug mode
    DEBUG = True

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    MONGO_URI = os.environ.get("MONGO_URL")


class TestingConfig(DefaultConfig):
    # App environment
    APP_ENV = DefaultConfig.APP_ENV_TESTING

    # Flask disables error catching during request handling for better error reporting in tests
    TESTING = True

    # Activate debug mode
    DEBUG = True

    # False to disable CSRF protection during tests
    WTF_CSRF_ENABLED = False

    # Logging
    LOG_FILE_API = f"{basedir}/logs/api_tests.log"

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")

    MONGO_URI = os.environ.get("MONGO_TEST_URL")


class LocalConfig(DefaultConfig):
    # App environment
    APP_ENV = DefaultConfig.APP_ENV_LOCAL

    # Activate debug mode
    DEBUG = False

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    MONGO_URI = os.environ.get("MONGO_URL")


class ProductionConfig(DefaultConfig):
    # App environment
    APP_ENV = DefaultConfig.APP_ENV_PRODUCTION

    # Activate debug mode
    DEBUG = False

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    MONGO_URI = os.environ.get("MONGO_URL")
