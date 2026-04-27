#!/bin/bash
echo "Starting FusionArt Application..."
cd /home/ec2-user/app

# Ensure the log file exists and is writable
touch app.log
chmod 666 app.log

# Start the JAR in the background
# We use the exact name from the build output
nohup java -jar ArtGalleryProject-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# Wait a few seconds to see if it crashed immediately
sleep 10
if ps -ef | grep -v grep | grep ArtGalleryProject ; then
    echo "Application started successfully."
    exit 0
else
    echo "Application failed to start. Check app.log"
    cat app.log
    exit 1
fi
