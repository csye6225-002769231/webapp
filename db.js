
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


// const pool = mariadb.createPool({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASS
// })
// const assignment = require("./model/assignment.js");
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
    // await mysql.createConnection({
    //     user: process.env.DATABASE_USER,
    //     password: process.env.DATABASE_PASS
    //   }).then((connection) => {
    //     connection.query(`CREATE DATABASE IF NOT EXISTS\`${process.env.DATABASE}\`;`)
    //   });
    // await pool.getConnection({
    //     user: process.env.DATABASE_USER,
    //     password: process.env.DATABASE_PASS
    // }).then((connection) => {
    //     connection.query(`CREATE DATABASE IF NOT EXISTS\`${process.env.DATABASE}\`;`)
    //     console.log("line 35 connectionc created")
    // });

    // pool.getConnection()
    //     .then((connection) => {
    //         console.log('Connected to the MariaDB database');
    //         try{
    //             connection.query(`CREATE DATABASE IF NOT EXISTS\`${process.env.DATABASE}\`;`)
    //             console.log("line 43: created db")
    //         } catch(err){
    //             console.log("line 45: database already exi")
    //         }
    //     })
    //     .catch((err) => {
    //         console.error('Error connecting to the database:', err);
    //     })
    //     .finally(() => {
    //         // Close the pool when you're done with all connections (usually during application shutdown)
    //         pool.end()
    //             .then(() => {
    //                 console.log('line 50: Connection pool closed');
    //             })
    //             .catch((err) => {
    //                 console.error('Error closing the connection pool:', err);
    //             });
    //     });
};


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