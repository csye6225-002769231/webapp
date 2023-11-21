const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');



const sequelize = require('../db.js').sequelize;

const assignment = require('./assignment.js').assignment;
const submission = require('./submission.js').submission;
const account = sequelize.define('account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        timestamps: true,
        createdAt: 'account_created',
        updatedAt: 'account_updated',
        underscore: true,

    });

account.beforeCreate(async (account) => {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    account.password = hashedPassword;
});


 account.hasMany(assignment)
account.hasMany(submission)

module.exports = {
    account: account
}