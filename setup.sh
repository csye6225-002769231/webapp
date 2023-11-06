#! /bin/bash

sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm

sudo groupadd users-csye6225

# Giving privileges
sudo useradd -s /bin/false -g users-csye6225 -d /opt/webapp -m kshitij

sudo chown -R kshitij:users-csye6225 /opt/webapp

sudo chmod g+x /opt/webapp

sudo apt install unzip

sudo cp webapp.zip /opt/webapp

cd /opt/webapp

sudo unzip webapp.zip

sudo npm i

sudo mv user.csv /opt

sudo mv auto-run.service /etc/systemd/system

wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb

sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

sudo systemctl daemon-reload

sudo systemctl enable auto-run

sudo systemctl start auto-run






