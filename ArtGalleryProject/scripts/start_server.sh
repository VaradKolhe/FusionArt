#!/bin/bash
echo "Starting FusionArt Application via Systemd..."

# Start the service
sudo systemctl restart fusionart

# Check if it's running
sleep 5
if systemctl is-active --quiet fusionart; then
    echo "Application started successfully."
    exit 0
else
    echo "Application failed to start. Logs:"
    sudo journalctl -u fusionart -n 50
    exit 1
fi
