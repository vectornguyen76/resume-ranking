def init_app(app):
    if app.config["APP_ENV"] == "local":
        commands = []

    for command in commands:
        app.cli.add_command(app.cli.command()(command))
