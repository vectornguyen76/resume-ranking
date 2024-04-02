#!/bin/sh

echo "Start run entrypoint script..."

echo "Enviroment:" $APP_ENV

if [ "$APP_ENV" = "local" ]; then
    echo "Run app with gunicorn server..."
    gunicorn --bind $API_HOST:$API_PORT $API_ENTRYPOINT --timeout 1200 --workers 4;
fi
