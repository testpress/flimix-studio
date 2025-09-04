#!/bin/bash

# Local MinIO deployment script
set -e

echo "🚀 Starting local MinIO deployment..."

# MinIO configuration
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="admin"
MINIO_SECRET_KEY="admin123"
BUCKET_NAME="flimix"
REMOTE_DIR="static/studio"

# Check if MinIO is running
if ! curl -s "$MINIO_ENDPOINT/minio/health/live" > /dev/null; then
    echo "MinIO is not running. Please start it with: docker-compose up -d"
    exit 1
fi

echo "MinIO is running at $MINIO_ENDPOINT"

# Set up MinIO client alias
echo "🔧 Setting up MinIO client..."
mc alias set local $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to local MinIO
echo "Deploying to local MinIO..."
mc cp --recursive dist/ local/$BUCKET_NAME/$REMOTE_DIR/

echo "Successfully deployed to local MinIO!"
echo "Access your app at: $MINIO_ENDPOINT/$BUCKET_NAME/$REMOTE_DIR/"
echo "MinIO Console: http://localhost:9001"
echo "Files uploaded to: local/$BUCKET_NAME/$REMOTE_DIR/"
