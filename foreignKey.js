const account = require("./model/account.js").account;
const assignment = require('./model/assignment.js').assignment;

// account.hasMany(assignment,{as: 'assignment', foreignKey: 'account_id'})
assignment.belongsTo(account)