
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
        const csv = require('./csvparser.js');

    } catch (error) {
        console.error('Error while bootstrapping the database:', error);
    }

    
}
bootstrapDatabase();

const conn = () => {
    return sequelize
        .authenticate()
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    }

module.exports = {
    sequelize: sequelize,
    bootstrapDatabase: bootstrapDatabase,
    conn:conn,
}