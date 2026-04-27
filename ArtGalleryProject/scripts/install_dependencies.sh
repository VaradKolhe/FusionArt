#!/bin/bash
echo "Installing dependencies and setting up Systemd..."
yum update -y
yum install -y java-17-amazon-corretto-devel lsof psmisc


echo "Dependency installation complete."
