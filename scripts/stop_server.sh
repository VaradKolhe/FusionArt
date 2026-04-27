#!/bin/bash
echo "Stopping existing Java processes..."
pkill -f 'java -jar' || true
