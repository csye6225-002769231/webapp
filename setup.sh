#! /bin/bash

sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm

sudo groupadd users-csye6225

# Giving privileges
sudo useradd -s /bin/false -g users-csye6225 -d /opt/webapp -m kshitij

sudo apt install unzip

unzip webapp.zip /opt/webapp

cd /opt/webapp

sudo mv user.csv /opt

sudo mv auto-run.service /etc/systemd/system

sudo systemctl daemon-reload

sudo systemctl enable auto-run

sudo systemctl start auto-run

sudo npm i





