import logging
from datetime import datetime

import pytz
from flask import Flask


def configure_logging(app: Flask):
    # Create a logger instance
    logger = logging.getLogger(app.name)

    # Set the logging level
    logger.setLevel(logging.DEBUG)

    # Set the timezone to Vietnam
    vietnam_timezone = pytz.timezone("Asia/Ho_Chi_Minh")

    # Configure logging with the Vietnam timezone
    logging.Formatter.converter = (
        lambda *args: pytz.utc.localize(datetime.utcnow())
        .astimezone(vietnam_timezone)
        .timetuple()
    )

    # Define the log format
    console_log_format = "%(asctime)s - %(levelname)s - %(message)s"
    file_log_format = (
        "%(asctime)s - %(levelname)s - %(message)s - (%(filename)s:%(lineno)d)"
    )

    # Create a console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(
        logging.Formatter(console_log_format, datefmt=app.config["DATE_FMT"])
    )
    logger.addHandler(console_handler)

    # Create a file handler
    file_handler = logging.FileHandler(
        filename=app.config["LOG_FILE_API"], encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(
        logging.Formatter(file_log_format, datefmt=app.config["DATE_FMT"])
    )
    logger.addHandler(file_handler)
