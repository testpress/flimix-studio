#!/bin/bash

# Local MinIO deployment script
# 
# This script requires a .env file with the following variables:
# MINIO_ENDPOINT=http://your-minio-endpoint
# MINIO_ACCESS_KEY=your-access-key
# MINIO_SECRET_KEY=your-secret-key
# BUCKET_NAME=your-bucket-name
# REMOTE_DIR=your-remote-directory
#
# Create .env file and run: ./scripts/deploy-local.sh

set -e

# Load .env file if it exists
if [ -f .env ]; then
    echo "Loading configuration from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "No .env file found!"
    echo "Please create a .env file with required MinIO configuration."
    exit 1
fi

echo "Starting local MinIO deployment..."

# MinIO configuration (must be provided via .env file)
MINIO_ENDPOINT="${MINIO_ENDPOINT}"
MINIO_ACCESS_KEY="${MINIO_ACCESS_KEY}"
MINIO_SECRET_KEY="${MINIO_SECRET_KEY}"
BUCKET_NAME="${BUCKET_NAME}"
REMOTE_DIR="${REMOTE_DIR}"

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
