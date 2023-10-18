#! /bin/bash

sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm postgresql

sudo -u postgres psql -c "ALTER USER '$(env DATABASE_USER)' WITH PASSWORD '$(env DATABASE_PASS)';"
          
PGPASSWORD="$(env DATABASE_PASS)" psql -U "$(env DATABASE_USER)" -d "$(env DATABASE)" -h "$(env DATABASE_HOST)"-p "$(env DATABASE_PORT)"

sudo apt install unzip
