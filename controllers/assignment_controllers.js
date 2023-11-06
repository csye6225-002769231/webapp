const { ValidationError } = require('sequelize');

const sequelize = require('../db.js').sequelize;
const account = require('../model/account.js').account;
const Assignment = require('../model/assignment.js').assignment;
const pino = require('pino');
const path = require('path');
const fs = require('fs');

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
  
  
// Create a new assignment
const createAssignment = async (req, res) => {

    const { name, points, num_of_attempts, deadline } = req.body;
    const accountId = req.account.id;
    const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
    const deadlineDate = new Date(deadline);

    try {
        if (bodyLength == 0) {
            customLogger(logger, 'error', 'Body cannot be empty',null,req.method)
            res.status(400).send();
        }
        if (typeof name !== 'string' ||
            typeof points !== 'number' ||
            typeof num_of_attempts !== 'number' ||
            typeof deadline !== 'string' ||
            !name || !points || !num_of_attempts || !deadline) {

                customLogger(logger, 'error', 'Invalid Data Types',null,req.method)
            return res.status(400).send();
        }
        if (!Number.isInteger(points) || !Number.isInteger(num_of_attempts)) {
            customLogger(logger, 'error', 'Not a Number Error',null,req.method)
            return res.status(400).send();
        }

        const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        if (!deadline.match(deadlineRegex)) {
            customLogger(logger, 'error', 'Invalid Date',null,req.method)
            return res.status(400).send();
        }
        if (Object.keys(req.body).every(key => ['name', 'points', 'num_of_attempts', 'deadline'].includes(key)) === false) {
            customLogger(logger, 'error', 'Invalid Details',null,req.method)
            return res.status(400).send();
        }
        const assignment = await Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,
            accountId,
        });
        const responseAssignment = {
            id: assignment.id,
            name: assignment.name,
            points: assignment.points,
            num_of_attempts: assignment.num_of_attempts,
            deadline: assignment.deadline,
            assignment_created: assignment.assignment_created,
            assignment_updated: assignment.assignment_updated
            // Add other properties as needed
        };
        logger.info('Assignment Create Successful');
        res.status(201).send(responseAssignment);

        // res.status(201).send(assignment);



    } catch (e) {
        if (e instanceof ValidationError) {
            customLogger(logger, 'error', 'validation error',e,req.method)
            res.status(400).send();
        }

    }
};

const getAllAssignments = async (req, res) => {

    try {
        const assignments = await Assignment.findAll({
            attributes: {
                exclude: ['accountId']
            }
        });
        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (Object.keys(req.query).length > 0 || bodyLength > 0) {
            customLogger(logger, 'error', 'Body Should be Empty',null,req.method)
            res.status(400).send();

        } else {
            logger.info('Assignment Get Successful');
            res.status(200).send(assignments);
        }

        // console.log(req.body)
    }
    catch (e) {
        customLogger(logger, 'error', 'Bad Request',e,req.method)
        res.status(400).send();
    }
};

const getAssignmentById = async (req, res) => {
    // await sequelize.query(`USE \`${process.env.DATABASE}\``);
    const { id } = req.params;
    try {
        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (Object.keys(req.query).length > 0 || bodyLength > 0) {
            customLogger(logger, 'error', 'Body Should be Empty',null,req.method)
            res.status(400).send();
        } else {
            const assignments = await Assignment.findByPk(id, {
                attributes: {
                    exclude: ['accountId']
                }
            });
            if (assignments == null) {
                customLogger(logger, 'error', 'Assignment Deleted/Does not Exist',null,req.method)
                res.status(404).send()
            } else {
                logger.info('Assignment Get by ID Successful');
                res.status(200).send(assignments);
            }
        }

    } catch (e) {
        customLogger(logger, 'error', 'Assignment Deleted/Does not Exist',e,req.method)
        res.status(404).send();
    }
};

const updateAssignment = async (req, res) => {
    const { name, points, num_of_attempts, deadline } = req.body;
    const { id } = req.params;
    const accountId = req.account.id;
    try {
        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (bodyLength == 0) {
            customLogger(logger, 'error', 'Body Should not be Empty',null,req.method)
            res.status(400).send();

        }
        if (typeof name !== 'string' ||
            typeof points !== 'number' ||
            typeof num_of_attempts !== 'number' ||
            typeof deadline !== 'string' ||
            !name || !points || !num_of_attempts || !deadline) {
            customLogger(logger, 'error', 'Invalid Data Types',null,req.method)
            return res.status(400).send();
        }
        if (!Number.isInteger(points) || !Number.isInteger(num_of_attempts)) {
            customLogger(logger, 'error', 'Not a Number Error',null,req.method)
            return res.status(400).send();
        }
        if (Object.keys(req.body).every(key => ['name', 'points', 'num_of_attempts', 'deadline'].includes(key)) === false) {
            customLogger(logger, 'error', 'Invalid Details',null,req.method)
            return res.status(400).send();
        }

        const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        if (!deadline.match(deadlineRegex)) {
            customLogger(logger, 'error', 'Invalid Date',null,req.method)
            return res.status(400).send();
        }
        
        const assignment = await Assignment.findByPk(id);
        if (assignment == null) {
            customLogger(logger, 'error', 'Assignment Not Found',null,req.method)
            res.status(404).send()
        } else {
            if (accountId != assignment.accountId) {
                customLogger(logger, 'error', 'Unauthorized to Update Assignment',null,req.method)
                res.status(403).send();
            } else {
                assignment.name = name;
                assignment.points = points;
                assignment.num_of_attempts = num_of_attempts;
                assignment.deadline = deadline;
                await assignment.save();
                logger.info('Assignment Update Successful')
                res.status(204).send(assignment);
            }
        }
    }
    catch (e) {
        if (e instanceof ValidationError) {
            customLogger(logger, 'error', 'validation error',null,req.method)
            res.status(400).send();
        }
    }
};

const deleteAssignment = async (req, res) => {
    const { id } = req.params;
    const accountId = req.account.id;
    try {
        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (Object.keys(req.query).length > 0 || bodyLength > 0) {
            customLogger(logger, 'error', 'Body Should be Empty',null,req.method)
            res.status(400).send();
        } else {
            const assignment = await Assignment.findByPk(id);
            if (assignment == null) {
                res.status(404).send();
            } else {
                if (accountId != assignment.accountId) {
                    customLogger(logger, 'error', 'Unauthorized to Delete Assignment',null,req.method)
                    res.status(403).send();
                } else {
                    await assignment.destroy();
                    res.status(204).send()
                }

            }
        }


    } catch (e) {
        res.status(403).send();
    }
};

module.exports = {
    createAssignment: createAssignment,
    getAllAssignments: getAllAssignments,
    getAssignmentById: getAssignmentById,
    updateAssignment: updateAssignment,
    deleteAssignment: deleteAssignment

}