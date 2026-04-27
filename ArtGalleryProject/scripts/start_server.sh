#!/bin/bash
echo "Starting FusionArt Application via Systemd..."

# Verify the service file exists in systemd
if [ ! -f "/etc/systemd/system/fusionart.service" ]; then
    echo "ERROR: /etc/systemd/system/fusionart.service not found!"
    echo "Checking /etc/systemd/system directory..."
    ls /etc/systemd/system/fusionart*
    exit 1
fi

echo "Restarting fusionart service..."
sudo systemctl restart fusionart

# Check if it's running
sleep 5
if systemctl is-active --quiet fusionart; then
    echo "Application started successfully."
    exit 0
else
    echo "Application failed to start. Status:"
    sudo systemctl status fusionart
    echo "Recent Logs:"
    sudo journalctl -u fusionart -n 50
    exit 1
fi
