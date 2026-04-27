#!/bin/bash
echo "Setting up Systemd service..."

# Copy service file from the deployed location to systemd
sudo cp /home/ec2-user/scripts/fusionart.service /etc/systemd/system/fusionart.service

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable fusionart

echo "Systemd service setup complete."
