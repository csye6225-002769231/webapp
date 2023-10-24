#! /bin/bash

sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm

sudo groupadd users-csye6225

# Giving privileges
sudo useradd -s /bin/bash -g users-csye6225 -d /home/admin -m kshitij

sudo apt install unzip

unzip webapp.zip -d webapp

cd webapp

sudo mv user.csv /opt

sudo mv auto-run.service /etc/systemd/system

sudo npm i





