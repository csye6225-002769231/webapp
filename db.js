const Sequelize = require('sequelize');
const { Pool } = require('pg');
const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const fastcsv = require('fast-csv');
const pino = require('pino');
const path = require('path');

const logger = pino({
  level: 'info',
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

function getStackInfo() {
  const stacklist = new Error().stack.split('\n').slice(3);

  for (let stack of stacklist) {
    if (stack.includes('node_modules') || stack.includes('internal')) continue; 
    const stackInfo = /at (.+) \((.+):(\d+):(\d+)\)$/.exec(stack) || /at (.+):(\d+):(\d+)$/.exec(stack);
    if (stackInfo) {
      let method, filePath, line, column;
      if (stackInfo.length === 5) {
        [, method, filePath, line, column] = stackInfo;
      } else {
        [, filePath, line, column] = stackInfo;
        method = filePath.split('/').pop();
      }
      filePath = path.relative(process.cwd(), filePath); 
      return { method, filePath, line, column };
    }
  }
  return {};
}

function customLogger(logger, level, message, error,method) {
    const {filePath, line, column } = getStackInfo();
    const logObject = {
      message,
      method,
      filePath: __filename,
      line: parseInt(line), 
    };
    if (error) logObject.error = error.stack || error.toString();
  
    logger[level](logObject);
  }
  
  
const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    port: process.env.DATABASE_PORT,
    logging: false,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DIALECT,
});

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
});

async function bootstrapDatabase() {
    try {
        await pool.connect();
        const res = await pool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DATABASE}'`);

        if (res.rows.length === 0) {
            await pool.query(`CREATE DATABASE "${process.env.DATABASE}";`);
            logger.info(`Created database ${process.env.DATABASE}.`);
        } else {
            logger.info(`${process.env.DATABASE} database already exists.`);
        }

        await sequelize.sync();
        logger.info('Database synchronization complete.');
        const path = process.env.DEFAULTUSERSPATH;
        const account = require('./model/account.js').account;

        async function importDataFromCSV() {
            try {
                if (path === "") {
                    logger.warn("Default users file not found", path);
                    return;
                } else {
                    logger.info("Reading default users from file: ", path);
                }

                fastcsv
                    .parseStream(fs.createReadStream(path), { headers: true })
                    .on('data', async (data) => {
                        const { first_name, last_name, email, password } = data;

                        const existemail = await account.findOne({
                            where: { email: email },
                        });

                        if (existemail == null) {
                            await account.create({
                                first_name,
                                last_name,
                                email,
                                password,
                            });
                        }
                    })
                    .on('end', () => {
                        logger.info('CSV data import completed.');
                    });
            } catch (error) {
                customLogger(logger, 'error', 'Error CSV Parsing', error)
            }
        }

        importDataFromCSV();
    } catch (error) {
        customLogger(logger, 'error', 'Error Bootstrapping Database', error)
    }
}

bootstrapDatabase();

const conn = () => {

    return pool
        .connect()
        .then((client) => {
            return client;
        })
        .catch((err) => {
            return null;
        });
};

module.exports = {
    sequelize: sequelize,
    bootstrapDatabase: bootstrapDatabase,
    conn: conn,
};
