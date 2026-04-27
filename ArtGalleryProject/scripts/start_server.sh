#!/bin/bash
echo "Starting FusionArt Application via Systemd..."

SERVICE_FILE="/etc/systemd/system/fusionart.service"
SOURCE_FILE="/home/ec2-user/scripts/fusionart.service"

# 1. Self-Installation Check
if [ ! -f "$SERVICE_FILE" ]; then
    echo "Service not found in systemd. Attempting auto-installation..."
    if [ -f "$SOURCE_FILE" ]; then
        sudo cp "$SOURCE_FILE" "$SERVICE_FILE"
        sudo systemctl daemon-reload
        sudo systemctl enable fusionart
        echo "Service installed successfully."
    else
        echo "ERROR: Source service file not found at $SOURCE_FILE"
        exit 1
    fi
fi

# 2. Start the service
echo "Restarting fusionart service..."
sudo systemctl restart fusionart

# 3. Validation
sleep 5
if systemctl is-active --quiet fusionart; then
    echo "Application started successfully."
    exit 0
else
    echo "Application failed to start. Printing logs for debugging:"
    sudo journalctl -u fusionart -n 50
    exit 1
fi
