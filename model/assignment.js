const { DataTypes } = require("sequelize");


const sequelize = require('../db.js').sequelize;

const submission = require('./submission.js').submission;
const assignment = sequelize.define("assignment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            max: 100,   
            min: 1,                  
        },
    },
    num_of_attempts: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            max: 100,   
            min: 1,                  
        },
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    }
},
    {
        timestamps: true,
        createdAt: 'assignment_created',
        updatedAt: 'assignment_updated',
        underscore: true
    });


    assignment.hasMany(submission)

module.exports = {
    assignment: assignment
}