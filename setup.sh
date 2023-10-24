#! /bin/bash

# DATABASE_USER="${{'secrets.DATABASE_USERNAME'}}"
# DATABASE_PASS="$secrets.DATABASE_PASSWORD"
# DATABASE="$secrets.DATABASE_NAME"
# DATABASE_HOST="$secrets.DATABASE_HOST"
# DATABASE_PORT="$secrets.DATABASE_PORT"


sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm postgresql

sudo -u postgres psql -c "ALTER USER $DATABASE_USER WITH PASSWORD '$DATABASE_PASS';"
          
PGPASSWORD="$DATABASE_PASS" psql -U "$DATABASE_USER" -h "$DATABASE_HOST" -p "$DATABASE_PORT"

sudo groupadd users-csye6225

# Giving privileges
sudo useradd -s /bin/bash -g users-csye6225 -d /home/admin -m kshitij

sudo apt install unzip

unzip webapp.zip -d webapp

cd webapp

sudo mv user.csv /opt

sudo mv auto-run.service /lib/systemd/system

sudo npm i





