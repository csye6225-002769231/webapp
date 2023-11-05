const db = require('../db.js');
const account = require('../model/account.js').account;
const bcrypt = require('bcrypt');
const pino = require('pino');
const path = require('path');

const logger = pino({
  level: 'info',
  time: true,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, 
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
    level: level.toString(),
    message,
    method,
    filePath: __filename,
    line: parseInt(line), 
    time: new Date().toISOString(),
  };
  if (error) logObject.error = error.stack || error.toString();

  logger[level](logObject);
}

const basicAuth = async (req, res, next) => {
  const basicHeader = req.headers['authorization'];

  if (!basicHeader) {
    customLogger(logger, 'error', 'Unauthorized Auth Type')
    return res.status(401).send();
  }

  const authParts = basicHeader.split(' ');

  if (authParts.length !== 2 || authParts[0].toLowerCase() !== 'basic') {
    customLogger(logger, 'error', 'Unauthorized Auth Type')
    return res.status(401).send();
  }

  const authData = Buffer.from(authParts[1], 'base64').toString('utf-8');
  const [username, password] = authData.split(':');

  if (!username || !password) {
    customLogger(logger, 'error', 'Unauthorized')
    return res.status(401).send();
  }

  try {
    const user = await account.findOne({ where: { email: username } });

    if (!user) {
      customLogger(logger, 'error', 'Unauthorized User')
      return res.status(401).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      customLogger(logger, 'error', 'Invalid Password')
      return res.status(401).send();
    }

    req.account = user;
    next();
  } catch (error) {
    customLogger(logger, 'error', 'Database Not Connected',error,null)
    return res.status(503).send('Database connection error');
  }
};

module.exports = {
  basicAuth: basicAuth
};
