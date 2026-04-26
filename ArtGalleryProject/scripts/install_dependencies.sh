#!/bin/bash
echo "Installing Java 17..."
yum update -y
yum install -y java-17-amazon-corretto-devel
mkdir -p /home/ec2-user/app
chown -y ec2-user:ec2-user /home/ec2-user/app
