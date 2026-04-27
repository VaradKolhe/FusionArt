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
echo "Waiting for application to bind to port 8085..."
MAX_RETRIES=30
RETRY_COUNT=0
HEALTH_URL="http://localhost:8085/api/actuator/health"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    RESPONSE=$(curl -s $HEALTH_URL)
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo "Application is Healthy! (HTTP 200)"
        exit 0
    fi
    
    echo "Waiting for health check... (Attempt $((RETRY_COUNT+1))/$MAX_RETRIES, Status: $HTTP_STATUS)"
    echo "Response Body: $RESPONSE"
    RETRY_COUNT=$((RETRY_COUNT+1))
    sleep 5
done

echo "!!! APPLICATION FAILED TO PASS HEALTH CHECK WITHIN TIMEOUT !!!"
echo "--- Systemd Status ---"
sudo systemctl status fusionart
echo "--- Last 200 lines of Application Log ---"
if [ -f "$APP_LOG" ]; then
    tail -n 200 "$APP_LOG"
else
    echo "Log file $APP_LOG not found."
fi
exit 1
