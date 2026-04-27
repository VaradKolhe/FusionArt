#!/bin/bash
echo "Starting FusionArt Application..."
cd /home/ec2-user/app
nohup java -jar ArtGalleryProject-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
echo "Application started in background."
