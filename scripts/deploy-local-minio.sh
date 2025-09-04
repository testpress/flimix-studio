#!/bin/bash

# Local MinIO Deployment Script for Flimix Studio Development
# Usage: ./scripts/deploy-local-minio.sh

set -e

# Load environment variables from env.local if exists
if [ -f "env.local" ]; then
    echo "📋 Loading environment from env.local"
    export $(cat env.local | grep -v '^#' | xargs)
else
    echo "📋 Using default environment variables"
    export AWS_ACCESS_KEY_ID=admin
    export AWS_SECRET_ACCESS_KEY=admin123
    export AWS_STORAGE_BUCKET_NAME=flimix
    export AWS_S3_ENDPOINT_URL=http://localhost:9000
    export AWS_S3_REGION_NAME=us-east-1
fi

# Build directory
BUILD_DIR="dist"
REMOTE_PATH="static/flimix-studio"

echo "🚀 Deploying Flimix Studio to Local MinIO"
echo "Endpoint: $AWS_S3_ENDPOINT_URL"
echo "Bucket: $AWS_STORAGE_BUCKET_NAME"
echo "Remote Path: $REMOTE_PATH"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory $BUILD_DIR not found!"
    echo "Run 'npm run build' first"
    exit 1
fi

# Check if MinIO client is installed
if ! command -v mc &> /dev/null; then
    echo "❌ MinIO client (mc) not found!"
    echo "Install it from: https://min.io/docs/minio/linux/reference/minio-mc.html"
    exit 1
fi

# Configure MinIO client
echo "📋 Configuring MinIO client..."
mc alias set local-minio "$AWS_S3_ENDPOINT_URL" "$AWS_ACCESS_KEY_ID" "$AWS_SECRET_ACCESS_KEY" --api s3v4

# Check if bucket exists, create if not
echo "🪣 Checking bucket..."
if ! mc ls local-minio/"$AWS_STORAGE_BUCKET_NAME" > /dev/null 2>&1; then
    echo "Creating bucket: $AWS_STORAGE_BUCKET_NAME"
    mc mb local-minio/"$AWS_STORAGE_BUCKET_NAME" --region "$AWS_S3_REGION_NAME"
    mc policy set public local-minio/"$AWS_STORAGE_BUCKET_NAME"
fi

# Upload files with cache headers
echo "📤 Uploading files to MinIO..."
mc cp --recursive --attr "Cache-Control=public,max-age=31536000,immutable" \
    "$BUILD_DIR/" local-minio/"$AWS_STORAGE_BUCKET_NAME/$REMOTE_PATH/"

# Set bucket policy for public read access
echo "🔓 Setting bucket policy..."
mc policy set public local-minio/"$AWS_STORAGE_BUCKET_NAME"

echo "✅ Deployment completed successfully!"
echo "🌐 Access URL: $AWS_S3_ENDPOINT_URL/$AWS_STORAGE_BUCKET_NAME/$REMOTE_PATH/"
echo "📊 Files deployed:"
mc ls local-minio/"$AWS_STORAGE_BUCKET_NAME/$REMOTE_PATH/" --recursive
