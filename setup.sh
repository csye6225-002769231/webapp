#! /bin/bash

sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm postgresql

sudo -u postgres psql -c "ALTER USER '$DATABASE_USER' WITH PASSWORD '$DATABASE_PASS';"
          
PGPASSWORD="$DATABASE_PASS" psql -U "$DATABASE_USER" -d "$DATABASE" -h "$DATABASE_HOST"-p "$DATABASE_PORT"

sudo apt install unzip

cd /tmp

mv user.csv /opt

unzip webapp.zip

cd webapp

npm i