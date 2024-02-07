from app.db import db


def create_db():
    """
    Create Database.
    """
    db.create_all()
    db.session.commit()


def reset_db():
    """
    Reset Database.
    """
    db.drop_all()
    db.create_all()
    db.session.commit()


def drop_db():
    """
    Drop Database.
    """
    db.drop_all()
    db.session.commit()


def init_app(app):
    if app.config["APP_ENV"] == "production":
        commands = [create_db, reset_db, drop_db]
    else:
        commands = [create_db, reset_db, drop_db]

    for command in commands:
        app.cli.add_command(app.cli.command()(command))
