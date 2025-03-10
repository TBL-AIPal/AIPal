#!/bin/bash
echo "======================================================="
echo "$(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================="

# ===============================
# Load Environment Variables
# ===============================
ENV_FILE="/home/sadm/AIPal/.env"
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE..."
    source "$ENV_FILE"
else
    echo "$ENV_FILE not found. Exiting."
    exit 1
fi

# ===============================
# Function: Validate Required Variables
# ===============================
validate_variables() {
    local missing_vars=0
    for var in "$@"; do
        if [ -z "${!var}" ]; then
            echo "Error: Required variable '$var' is not set in $ENV_FILE."
            missing_vars=1
        fi
    done
    if [ $missing_vars -ne 0 ]; then
        echo "Please ensure all required variables are set in $ENV_FILE."
        exit 1
    fi
}

# ===============================
# Define Variables
# ===============================
REPO_NAME=${REPO_NAME:-"tbl-aipal/aipal"}

REQUIRED_VARS=(
    "GITHUB_TOKEN"
    "MONGODB_HOST"
    "MONGODB_PORT"
    "MONGODB_USERNAME"
    "MONGODB_PASSWORD"
    "MONGODB_DATABASE"
    "ENCRYPTION_KEY"
    "JWT_SECRET"
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_USERNAME"
    "SMTP_PASSWORD"
    "EMAIL_FROM"
    "SERVER_NAME"
    "SERVER_HOST"
    "SERVER_PORT"
    "CLIENT_NAME"
    "CLIENT_PORT"
    "NODE_ENV"
    "NEXT_PUBLIC_SHOW_LOGGER"
    "NEXT_PUBLIC_API_URL"
)

validate_variables "${REQUIRED_VARS[@]}"

SERVER_IMAGE="ghcr.io/${REPO_NAME}/server-${NODE_ENV}:latest"
CLIENT_IMAGE="ghcr.io/${REPO_NAME}/client-${NODE_ENV}:latest"

# ===============================
# Log in to GitHub Container Registry
# ===============================
echo "Logging in to GitHub Container Registry..."
echo "$GITHUB_TOKEN" | docker login ghcr.io -u tbl-aipal --password-stdin || {
    echo "Login failed"
    exit 1
}

# ===============================
# Function: Check for Newer Image
# ===============================
is_newer_image() {
    local IMAGE=$1
    local CONTAINER_NAME=$2
    # Pull the latest image
    echo "Pulling latest image: $IMAGE"
    docker pull "$IMAGE" > /dev/null
    # Get the digest of the pulled image
    NEW_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' "$IMAGE")
    # Check if the container exists
    if docker ps -a --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
        # Get the digest of the running container's image
        CURRENT_DIGEST=$(docker inspect --format='{{index .Image}}' "$CONTAINER_NAME")
        CURRENT_DIGEST_FULL=$(docker inspect --format='{{index .RepoDigests 0}}' "$(docker inspect --format='{{.Image}}' "$CONTAINER_NAME")")
        # Compare digests
        if [ "$NEW_DIGEST" == "$CURRENT_DIGEST_FULL" ]; then
            echo "No new version available for $CONTAINER_NAME."
            return 1
        else
            echo "New version detected for $CONTAINER_NAME."
            return 0
        fi
    else
        echo "Container $CONTAINER_NAME does not exist. Creating a new one."
        return 0
    fi
}

# ===============================
# Function: Pull and Run Container
# ===============================
pull_and_run_if_newer() {
    local IMAGE=$1
    local CONTAINER_NAME=$2
    local PORT_MAPPING=$3
    local ENV_VARS=$4
    local NETWORK=$5
    local VOLUME=$6
    if is_newer_image "$IMAGE" "$CONTAINER_NAME"; then
        echo "Stopping and removing existing container: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" || true
        docker rm "$CONTAINER_NAME" || true
        echo "Starting new container: $CONTAINER_NAME"
        docker run -d \
            --name "$CONTAINER_NAME" \
            $PORT_MAPPING \
            $ENV_VARS \
            $NETWORK \
            $VOLUME \
            "$IMAGE"
    fi
}

# ===============================
# Pull and Run Containers
# ===============================
# Server Container
pull_and_run_if_newer \
    "$SERVER_IMAGE" \
    "${SERVER_NAME}" \
    "-p ${SERVER_PORT}:${SERVER_PORT}" \
    "--env NODE_ENV=${NODE_ENV} \
    --env MONGODB_USERNAME=${MONGODB_USERNAME} \
    --env MONGODB_PASSWORD=${MONGODB_PASSWORD} \
    --env MONGODB_HOST=${MONGODB_HOST} \
    --env MONGODB_PORT=${MONGODB_PORT} \
    --env MONGODB_DATABASE=${MONGODB_DATABASE} \
    --env SERVER_PORT=${SERVER_PORT} \
    --env ENCRYPTION_KEY=${ENCRYPTION_KEY} \
    --env JWT_SECRET=${JWT_SECRET} \
    --env SMTP_HOST=${SMTP_HOST} \
    --env SMTP_PORT=${SMTP_PORT} \
    --env SMTP_USERNAME=${SMTP_USERNAME} \
    --env SMTP_PASSWORD=${SMTP_PASSWORD} \
    --env EMAIL_FROM=${EMAIL_FROM}" \
    "--network=host"

# Client Container
pull_and_run_if_newer \
    "$CLIENT_IMAGE" \
    "${CLIENT_NAME}" \
    "-p ${CLIENT_PORT}:${CLIENT_PORT}" \
    "--env NODE_ENV=${NODE_ENV} \
    --env NEXT_PUBLIC_SHOW_LOGGER=${NEXT_PUBLIC_SHOW_LOGGER} \
    --env SERVER_HOST=${SERVER_HOST} \
    --env SERVER_PORT=${SERVER_PORT} \
    --env NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" \
    "--network=host"

# ===============================
# Completion Message
# ===============================
echo "All containers checked and updated (if necessary)!"
