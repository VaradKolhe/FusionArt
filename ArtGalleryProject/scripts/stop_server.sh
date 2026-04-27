#!/bin/bash
echo "Stopping FusionArt Application..."

# Use lsof to find the process using port 8085
PID=$(sudo lsof -t -i:8085)

if [ -z "$PID" ]; then
    echo "No process found on port 8085. Trying grep..."
    PID=$(ps -ef | grep ArtGalleryProject | grep -v grep | awk '{print $2}')
fi

if [ -z "$PID" ]; then
    echo "No application running."
else
    echo "Stopping process $PID..."
    sudo kill -15 $PID
    
    # Wait for up to 30 seconds for the process to exit
    for i in {1..30}; do
        if ! ps -p $PID > /dev/null; then
            echo "Application stopped gracefully."
            exit 0
        fi
        sleep 1
    done
    
    echo "Process did not exit, forcing kill -9..."
    sudo kill -9 $PID
    echo "Application stopped forcibly."
fi

exit 0
