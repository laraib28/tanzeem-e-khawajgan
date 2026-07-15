#!/bin/bash
# Digital Ocean Deployment Script
# Run this on your DO Droplet after uploading the project

set -e

echo "=== Tanzeem-e-Khawajgan Deployment ==="

# Check .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "ERROR: .env.prod not found!"
    echo "Copy .env.prod.example to .env.prod and fill in your values."
    exit 1
fi

# Load env vars to verify
source .env.prod
if [ -z "$SERVER_URL" ] || [ "$SERVER_URL" = "http://YOUR_DROPLET_IP" ]; then
    echo "ERROR: Set SERVER_URL in .env.prod to your actual Droplet IP or domain."
    exit 1
fi

echo "Server URL: $SERVER_URL"
echo "Building and starting containers..."

# Stop existing containers
docker-compose -f docker-compose.prod.yml --env-file .env.prod down

# Build fresh and start
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

echo ""
echo "=== Deployment Complete ==="
echo "Site is running at: $SERVER_URL"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop:         docker-compose -f docker-compose.prod.yml down"
echo "  Restart:      docker-compose -f docker-compose.prod.yml restart"
