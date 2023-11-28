// importing required packages
const database = require('./db.js');
const express = require('express');
const app = express();
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



const basicAuth = require("./middleware/auth.js");
const assignment_controllers = require("./controllers/assignment_controllers.js")
const submission_controllers = require("./controllers/submission_controllers.js")


app.all('/healthz', async (req, res) => {
  assignment_controllers.stats.increment(`api.healthz.calls`)
  res.set('Cache-control', 'no-cache');

  try {
    const val = await database.conn();

    const bodyLength = parseInt(req.get('Content-Length') || '0', 10);

    if (req.method === 'GET') {
      // Checking for body and query lengths
      if (Object.keys(req.query).length > 0 || bodyLength > 0) {
        customLogger(logger, 'error', 'Cant Contain Body while GET request', null, req.method)
        res.status(400).send(); // Bad request
      } else {
        if (!val) {
          customLogger(logger, 'error', 'DataBase Error', null, req.method)
          res.status(503).send(); // Not connected
        } else {
          
          logger.info('Database Health Check Successful')
          await val.release();
          res.status(200).send(); // Connected
        }
      }
    } else {
      customLogger(logger, 'error', 'Method Not Allowed', null, req.method)
      res.status(405).send(); // Method not allowed (except GET)
    }
  } catch (error) {
    // Handle the database connection error here
    console.error('Database connection error in healthz:', error);
    res.status(503).send(); // Database connection error
  }
});

app.use(express.json())
app.post('/v1/assignments/:id/submission', basicAuth.basicAuth, submission_controllers.createSubmission);

app.all('/v1/assignments/:id/submission', (req, res) => {
  if (req.method !== 'POST') {
    customLogger(logger, 'error', 'Method Not Allowed', null, req.method);
    res.status(405).send(); // Method not allowed
  }
});

app.post('/v1/assignments', basicAuth.basicAuth, assignment_controllers.createAssignment);

// app.post('/v1/assignments/*', (req, res) => {
//   customLogger(logger, 'error', 'Cannot Post by ID', null, req.method)
//   res.status(404).send();
// });
app.get('/v1/assignments', basicAuth.basicAuth, assignment_controllers.getAllAssignments);
app.get('/v1/assignments/:id', basicAuth.basicAuth, assignment_controllers.getAssignmentById);
app.put('/v1/assignments/:id', basicAuth.basicAuth, assignment_controllers.updateAssignment);
app.delete('/v1/assignments/:id', basicAuth.basicAuth, assignment_controllers.deleteAssignment);

app.all('/*', (req, res) => {
  if (req.method === 'PATCH' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    customLogger(logger, 'error', 'Method not Allowed', null, req.method)
    res.status(405).send();
  } else {
    customLogger(logger, 'error', 'Link not Found', null, req.method)
    res.status(404).send();
  }
});



app.listen(3000, (err) => {
  if (err) throw err;
  else {
    logger.info(`Server is running on port 3000`);
  }
});


module.exports = {
  app
}