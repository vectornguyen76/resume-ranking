import os
from flask import Flask
from app.extention import migrate, cors
from app.utils.logging import configure_logging
from app.db import db
from app.blueprint import register_routing
import manage

def create_app(settings_module):
    app = Flask(__name__)
    app.config.from_object(settings_module)

    # Initialize the extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, supports_credentials='true' ,resources={r"*": { "origins": "*" }})
    manage.init_app(app)

    # Logging configuration
    configure_logging(app)

    # Register Blueprint
    register_routing(app)

    return app

settings_module = os.getenv('APP_SETTINGS_MODULE')
app = create_app(settings_module)