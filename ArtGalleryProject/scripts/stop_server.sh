#!/bin/bash
echo "Stopping FusionArt Application..."

# 1. Try to find the process by port (most reliable)
PID=$(sudo lsof -t -i:8085)

# 2. If not found by port, try finding the specific JAR
if [ -z "$PID" ]; then
    echo "No process found on port 8085. Searching for JAR..."
    # pgrep -f is better as it searches the full command line
    # We look for the specific JAR name to avoid killing the script itself
    PID=$(pgrep -f "ArtGalleryProject-0.0.1-SNAPSHOT.jar")
fi

# 3. Last resort: grep but exclude the script's own name and the grep command
if [ -z "$PID" ]; then
    echo "Still no PID found. Using grep..."
    PID=$(ps -ef | grep "java -jar" | grep "ArtGalleryProject" | grep -v grep | grep -v "stop_server.sh" | awk '{print $2}')
fi

if [ -z "$PID" ]; then
    echo "No application process found. Nothing to stop."
    exit 0
fi

# Ensure we don't try to kill our own process if something went wrong with grep
MY_PID=$$
for p in $PID; do
    if [ "$p" == "$MY_PID" ]; then
        echo "Found my own PID ($p) in the list. Skipping..."
        continue
    fi
    
    echo "Attempting to stop process $p..."
    sudo kill -15 $p 2>/dev/null
    
    # Wait for the process to exit
    for i in {1..10}; do
        if ! ps -p $p > /dev/null; then
            echo "Process $p stopped gracefully."
            break
        fi
        sleep 1
    done
    
    # Force kill if still running
    if ps -p $p > /dev/null; then
        echo "Process $p still running. Forcing kill -9..."
        sudo kill -9 $p 2>/dev/null
    fi
done

echo "Stop script finished."
exit 0
