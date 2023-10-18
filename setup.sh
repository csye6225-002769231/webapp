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

sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root1234';"
          
PGPASSWORD="root1234" psql -U "postgres" -h "127.0.0.1" -p 5432 

sudo apt install unzip

unzip webapp.zip -d webapp

cd webapp

sudo npm i





