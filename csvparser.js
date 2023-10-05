const account = require('./model/account.js').account;
const db = require('./db.js');
const fs = require('fs');
const fastcsv = require('fast-csv');
require('dotenv').config();


// Import the Sequelize instance from your db.js
 // Import the Sequelize model for the 'account' table
const path = process.env.DEFAULTUSERSPATH;

async function importDataFromCSV() {
    await db.bootstrapDatabase();
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

// Call the importDataFromCSV function to initiate data import

