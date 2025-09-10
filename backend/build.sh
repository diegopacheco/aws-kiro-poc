#!/bin/bash

echo "Building coaching app backend..."

cd "$(dirname "$0")"

echo "Installing dependencies..."
go mod tidy

echo "Formatting code..."
go fmt ./...

echo "Building application..."
go build -o coaching-app-backend .

if [ $? -eq 0 ]; then
    echo "Build successful!"
else
    echo "Build failed!"
    exit 1
fi