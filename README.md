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
- [SSL Certificate Import for AWS ACM](#ssl-certificate-import-for-aws-acm)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites-1)
  - [Usage](#usage)
    - [Importing the Certificate](#importing-the-certificate)

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

1. To install NodeJS:

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
   
# SSL Certificate Import for AWS ACM

## Introduction

   This README provides instructions on how to import an SSL/TLS certificate into AWS Certificate Manager (ACM) using the AWS Command Line Interface (CLI). This process is essential for using your own certificate with various AWS services such as Elastic Load Balancing and Amazon CloudFront.

## Prerequisites

Before executing the command, ensure you have the following:

- AWS CLI installed and configured on your machine.
- Access to the necessary certificate files, which include:
  - Your SSL/TLS certificate (`.crt` file).
  - Your private key file (`.key`).
  - Your certificate chain file (`.ca-bundle`).
- Adequate AWS IAM permissions to import certificates into ACM.

## Usage

### Importing the Certificate

To import your SSL/TLS certificate into AWS ACM, use the following command structure:

```bash
sudo aws acm import-certificate --certificate fileb://(certificate_name).crt --private-key fileb://(private_key_filename).key --certificate-chain fileb://(ca_bundle_certificate_name).ca-bundle --region us-east-1 --profile (profile_imported_to)

Example:
```bash
sudo aws acm import-certificate --certificate fileb://demo_kshitijprabhu_me.crt --private-key fileb://private.key --certificate-chain fileb://demo_kshitijprabhu_me.ca-bundle --region us-east-1 --profile demo



