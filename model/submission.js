const { DataTypes } = require("sequelize");


const sequelize = require('../db.js').sequelize;
const submission = sequelize.define('submission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
          isUrl: true 
        }
      },
},
    {
        timestamps: true,
        createdAt: 'submission_date',
        updatedAt: 'submission_updated',
        underscore: true,

    });

    // submission.belongsTo(assignment)
    // submission.belongsTo(account)



module.exports = {
    submission: submission
}