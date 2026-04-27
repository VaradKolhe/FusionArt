#!/bin/bash
echo "Setting up Systemd service..."

# The file should be at the destination we defined in appspec.yml
SOURCE_SERVICE_FILE="/home/ec2-user/scripts/fusionart.service"

if [ -f "$SOURCE_SERVICE_FILE" ]; then
    echo "Found service file at $SOURCE_SERVICE_FILE. Copying to systemd..."
    sudo cp "$SOURCE_SERVICE_FILE" /etc/systemd/system/fusionart.service
else
    echo "ERROR: Service file NOT found at $SOURCE_SERVICE_FILE"
    echo "Checking current directory contents..."
    ls -R
    exit 1
fi

echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "Enabling fusionart service..."
sudo systemctl enable fusionart

echo "Systemd service setup complete."
