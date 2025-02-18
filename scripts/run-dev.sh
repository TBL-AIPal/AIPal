#!/bin/bash

## RUN SCRIPT FROM ROOT FOLDER

## IMPORTANT: SETTING UP MONGODB_HOST AND SERVER_HOST
# 1. Use host.docker.internal (Docker Desktop Only)
# 2. Use the Host Machine's IP Address

# Exit immediately if any command fails
set -e

# Build the database image
echo "Building MongoDB image..."
docker build -t mongo -f ./packages/mongodb/Dockerfile.development ./packages/mongodb/

# Build the server image
echo "Building Server image..."
docker build -t server -f ./packages/server/Dockerfile.development ./packages/server/

# Build the client image
echo "Building Client image..."
docker build -t client -f ./packages/client/Dockerfile.development ./packages/client/

# Run the database container
echo "Running MongoDB container..."
docker run -d \
  --name mongodb-container \
  -p 27017:27017 \
  mongo

# Get MongoDB container's IP address
echo "Getting MongoDB container's IP address..."
MONGODB_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongodb-container)
if [ -z "$MONGODB_IP" ]; then
  echo "Failed to retrieve MongoDB container's IP address."
  exit 1
fi
echo "MongoDB container's IP address: $MONGODB_IP"

# Run the server container
echo "Running Server container..."
docker run -d \
  --name server-container \
  -p 5000:5000 \
  --env NODE_ENV=development \
  --env MONGODB_HOST=host.docker.internal \
  server

# Get server container's IP address
echo "Getting server container's IP address..."
SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server-container)
if [ -z "$SERVER_IP" ]; then
  echo "Failed to retrieve server container's IP address."
  exit 1
fi
echo "Server container's IP address: $SERVER_IP"

# Run the client container
echo "Running Client container..."
docker run -d \
  --name client-container \
  -p 3000:3000 \
  --env NODE_ENV=development \
  --env SERVER_HOST=host.docker.internal \
  client

# Cleanup Containers and Network (Optional)
# Uncomment the following lines if you want to clean up containers and networks after execution
# echo "Cleaning up containers and network..."
# docker stop mongodb-container server-container client-container || true
# sleep 5  # Wait for containers to stop
# docker rm mongodb-container server-container client-container || true
# docker network rm my-network || true

echo "Dev deployment complete!"