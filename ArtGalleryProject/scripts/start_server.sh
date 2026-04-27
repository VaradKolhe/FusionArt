#!/bin/bash
echo "Starting FusionArt Application via Systemd..."

SERVICE_FILE="/etc/systemd/system/fusionart.service"
SOURCE_FILE="/home/ec2-user/scripts/fusionart.service"
APP_LOG="/home/ec2-user/app/app.log"

# 1. Ensure directory exists and permissions are correct
sudo mkdir -p /home/ec2-user/app
sudo chown -R ec2-user:ec2-user /home/ec2-user/app
sudo touch $APP_LOG
sudo chown ec2-user:ec2-user $APP_LOG

# 2. Self-Installation Check
if [ ! -f "$SERVICE_FILE" ]; then
    echo "Service not found in systemd. Attempting auto-installation..."
    if [ -f "$SOURCE_FILE" ]; then
        sudo cp "$SOURCE_FILE" "$SERVICE_FILE"
        sudo systemctl daemon-reload
        sudo systemctl enable fusionart
    else
        echo "ERROR: Source service file not found at $SOURCE_FILE"
        exit 1
    fi
fi

# 3. Start the service
echo "Restarting fusionart service..."
sudo systemctl restart fusionart

# 4. Validation
echo "Waiting for application to initialize..."
sleep 15 # Increased wait for Spring Boot startup

if systemctl is-active --quiet fusionart; then
    echo "Application started successfully."
    exit 0
else
    echo "!!! APPLICATION FAILED TO START !!!"
    echo "--- Systemd Status ---"
    sudo systemctl status fusionart
    echo "--- Last 100 lines of Application Log ---"
    if [ -f "$APP_LOG" ]; then
        tail -n 100 "$APP_LOG"
    else
        echo "Log file $APP_LOG not found."
    fi
    echo "--- Recent Journal Logs ---"
    sudo journalctl -u fusionart -n 50
    exit 1
fi
