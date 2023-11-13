# Project Name

WebApp - CSYE 6225

## Table of Contents

- [Project Name](#project-name)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Installation](#installation-1)
    - [Configuration](#configuration)
  - [Deployment](#deployment)

## Project Overview

This is a Assignment RESTApi which lets its users to CRUD on Assignments.

## Prerequisites

List the prerequisites and dependencies required to run your project. This may include Node.js, PostgreSQL, etc.

- Node.js (v 18)
- PostgreSQL (v16)
- A Droplet on DigitalOcean runing Debian 12

## Getting Started


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/csye6225-002769231/webapp.git

2. Add the .env mentioned below:

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_USER`
  
`DATABASE_PASS` 

`DATABASE`  

`DATABASE_HOST` 

`DATABASE_PORT` 

`DIALECT` 

`DEFAULTUSERSPATH` 

3. Zip the file:

   ```bash
   zip webapp

4. Connect to your vm:

   ```bash
   #assuming you have set ssh setting to digital ocean
   scp your-project-path ssh digitalocean:/root
   scp your-csv-path ssh digitalocean:/opt

5. ```scp``` the file and the User.csv file to your vm:

   ```bash
   #assuming you have set ssh setting to digital ocean
   scp your-project-path ssh digitalocean:/root
   scp your-csv-path ssh digitalocean:/opt

### Installation

1. To install postgreSQL:

   ```bash
    sudo apt-get install postgresql postgresql-client
    sudo service postgresql start
    pg_isready

2. To set password for postgreSQL (Just make sure these env details are the same as the .env file in the project):

   ```bash
    # Change the user's password using superuser privileges
    sudo -u postgres psql -c "ALTER USER $DATABASE_USER WITH PASSWORD '$DATABASE_PASS';"
          
    # Connect to the 'postgres' databasee using the specified user and password
    PGPASSWORD=$DATABASE_PASS psql -U $DATABASE_USER -d $DATABASE -h $DATABASE_HOST -p $DATABASE_PORT

### Configuration

1. To install nodeJS:

   ```bash
    sudo apt install -y nodejs npm postgresql

2. To install npm modules:

   ```bash
    cd your-project
    npm i

## Deployment

   ```bash
    cd your-project
    npm run dev
