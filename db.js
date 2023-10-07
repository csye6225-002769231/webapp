
const Sequelize = require('sequelize');
const mariadb = require('mariadb');
const mysql = require('mysql2/promise');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    port: process.env.DATABASE_PORT,
    logging: false,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DIALECT
});
async function bootstrapDatabase() {
    // const account = require("./model/account.js").account;
    // const assignment = require("./model/assignment.js").assignment;
    // const foreignKey = require('./foreignKey.js');
    try {
        await sequelize.sync();
    } catch (err) {
    }
    try {
        return sequelize
            .authenticate()
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    } catch (error) {
        console.log("Failed creating tables")
    }





// const conn = () => {
//     return sequelize
//         .authenticate()
//         .then(() => {
//             return true;
//         })
//         .catch(() => {
//             return false;
//         });

// }
bootstrapDatabase();
// sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
//     port: process.env.DATABASE_PORT,
//     logging: false,
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DIALECT
// });

module.exports = {
    sequelize: sequelize,
    bootstrapDatabase: bootstrapDatabase,
}