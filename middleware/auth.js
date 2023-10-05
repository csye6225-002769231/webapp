const db = require('../db.js');
const account = require('../model/account.js').account;
const bcrypt = require('bcrypt');

const basicAuth = async (req, res, next) => {
    const basicHeader = req.headers['authorization'];
  
    if (!basicHeader) {
      return res.status(401).send('Unauthorized');
    }
  
    const authParts = basicHeader.split(' ');
  
    if (authParts.length !== 2 || authParts[0].toLowerCase() !== 'basic') {
      return res.status(401).send('Unauthorized');
    }
  
    const authData = Buffer.from(authParts[1], 'base64').toString('utf-8');
    const [username, password] = authData.split(':');
  
    if (!username || !password) {
      return res.status(401).send('Unauthorized');
    }
  
    try {
      const user = await account.findOne({ where: { email: username } });
  
      if (!user) {
        return res.status(401).send('Unauthorized');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send('Unauthorized');
      }
  
      req.account = user;
      next();
    } catch (err) {
      console.error('Error:', err);
      return res.status(401).send('Unauthorized');
    }
  };

  module.exports = {
    basicAuth: basicAuth
  }