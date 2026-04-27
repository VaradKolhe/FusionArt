#!/bin/bash
echo "Stopping FusionArt Application..."
# Find the process ID and kill it
PID=$(ps -ef | grep ArtGalleryProject | grep -v grep | awk '{print $2}')
if [ -z "$PID" ]; then
    echo "No application running."
else
    kill -9 $PID
    echo "Application stopped."
fi
exit 0
