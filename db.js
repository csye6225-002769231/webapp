
const Sequelize = require('sequelize');
const {Pool} = require('pg');
const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const fastcsv = require('fast-csv');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    port: process.env.DATABASE_PORT,
    logging: false,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DIALECT
});

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT
})

async function bootstrapDatabase() {

    // const assignment = require("./model/assignment.js").assignment;
    // const foreignKey = require('./foreignKey.js');
    try {
        await pool.connect();
        const res = await pool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DATABASE}'`);

        if (res.rows.length === 0) {
            await pool.query(`CREATE DATABASE "${process.env.DATABASE}";`);
            console.log(`Created database ${process.env.DATABASE}.`);
        } else {
            console.log(`${process.env.DATABASE} database already exists.`);
        }

        await sequelize.sync();
        console.log('Database synchronization complete.');
        const path = process.env.DEFAULTUSERSPATH;
        const account = require("./model/account.js").account;
        async function importDataFromCSV() {
            try {
                if(path === ""){
                    console.log("Default users file not found", path)
                    return
                }else{
                    console.log("Reading default users from file: ", path)
                }
        
                fastcsv
                    .parseStream(fs.createReadStream(path), { headers: true })
                    .on('data', async (data) => {
                        const { first_name, last_name, email, password } = data;
        
                        const existemail = await account.findOne({
                            where: { email: email}
                        })
                        if(existemail == null){
                            await account.create({
                                first_name,
                                last_name,
                                email,
                                password,
                            })
                        }
                    })
                    .on('end', () => {
                        console.log('CSV data import completed.');
                    });
            } catch (error) {
                console.error('Error importing CSV data:', error);
            }
        }
        
        
        importDataFromCSV();
    } catch (error) {
        console.error('Error while bootstrapping the database:', error);
    }

    
}




// }
bootstrapDatabase();
// sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
//     port: process.env.DATABASE_PORT,
//     logging: false,
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DIALECT
// });

const conn = () => {
    return sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully. Returning true.');
            return true;
        })
        .catch((err) => {
            console.log('Unable to connect to the database:', err);
            return false;
        });
    }

module.exports = {
    sequelize: sequelize,
    bootstrapDatabase: bootstrapDatabase,
    conn:conn,
}