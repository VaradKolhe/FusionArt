#!/bin/bash
echo "Stopping FusionArt Application via Systemd..."

# Check if the service exists
if systemctl list-unit-files | grep -q fusionart.service; then
    echo "Stopping fusionart service..."
    sudo systemctl stop fusionart
else
    echo "Systemd service not found. Falling back to port-based stop."
fi

# Final check to ensure port is free (for the very first migration)
PID=$(sudo lsof -t -i:8085)
if [ ! -z "$PID" ]; then
    echo "Process $PID still using port 8085. Killing..."
    sudo kill -9 $PID
fi

exit 0
