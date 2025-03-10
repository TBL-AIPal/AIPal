#!/bin/bash

# Function to format logs
log_message() {
    local level="$1"
    local message="$3"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$LOG_FILE"
}

# Parse named arguments
while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --log-file)
            LOG_FILE="$2"
            shift 2
            ;;
        --script)
            SCRIPT="$2"
            shift 2
            ;;
        *)
            echo "Error: Unknown argument '$1'. Use --log-file and --script."
            exit 1
            ;;
    esac
done

# Ensure LOG_FILE is provided
if [[ -z "$LOG_FILE" ]]; then
    echo "Error: --log-file not provided."
    exit 1
fi

# Ensure SCRIPT is provided
if [[ -z "$SCRIPT" ]]; then
    echo "Error: --script not provided."
    exit 1
fi

# Log start time
log_message "INFO" "Starting $SCRIPT"

# Run the script and capture output
{
    "$SCRIPT"
    EXIT_CODE=$?
    if [[ $EXIT_CODE -eq 0 ]]; then
        log_message "INFO" "Completed $SCRIPT successfully"
    else
        log_message "ERROR" "$SCRIPT exited with code $EXIT_CODE"
    fi
} >> "$LOG_FILE" 2>&1

exit $EXIT_CODE
