#! /bin/bash

sudo apt update

sudo apt upgrade -y

sudo "DEBIAN_FRONTEND = noninteractive"

sudo "CHECKPOINT_DISABLE=1"

sudo apt install -y nodejs npm postgresql

sudo apt install unzip

# unzip kshitij_prabhu_002769231_04
# cd kshitij_prabhu_002769231_04/webapp
# npm i
# npm run dev 