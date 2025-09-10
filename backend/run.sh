#!/bin/bash

echo "Starting coaching app backend..."

cd "$(dirname "$0")"

export DB_HOST=${DB_HOST:-localhost}
export DB_PORT=${DB_PORT:-3306}
export DB_USER=${DB_USER:-root}
export DB_PASSWORD=${DB_PASSWORD:-}
export DB_NAME=${DB_NAME:-coaching_app}
export SERVER_PORT=${SERVER_PORT:-8080}

echo "Environment variables:"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_USER: $DB_USER"
echo "DB_NAME: $DB_NAME"
echo "SERVER_PORT: $SERVER_PORT"

if [ ! -f "./coaching-app-backend" ]; then
    echo "Binary not found. Building application..."
    ./build.sh
fi

echo "Starting server on port $SERVER_PORT..."
./coaching-app-backend