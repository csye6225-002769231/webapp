const Assignment = require('../model/assignment.js').assignment;
const Submission = require('../model/submission.js').submission;
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const StatsD = require('node-statsd');
const stats = new StatsD({ host: 'localhost', port: 8125 });

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

function customLogger(logger, level, message, error, method) {
    const { filePath, line, column } = getStackInfo();
    const logObject = {
        message,
        method,
        filePath: __filename,
        line: parseInt(line),
    };
    if (error) logObject.error = error.stack || error.toString();

    logger[level](logObject);
}

const createSubmission = async (req, res) => {
    const { submission_url } = req.body;
    const assignmentId = req.params.id;
    const accountId = req.account.id;
    try {

        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (bodyLength == 0) {
            customLogger(logger, 'error', 'Body Should not be Empty', null, req.method)
            res.status(400).send();

        }

        if (typeof submission_url !== 'string' ||
         !submission_url) {
        customLogger(logger, 'error', 'Invalid Data Types', null, req.method)
        return res.status(400).send();
    }
    if (Object.keys(req.body).every(key => ['submission_url'].includes(key)) === false) {
        customLogger(logger, 'error', 'Invalid Details', null, req.method)
        return res.status(400).send();
    }
        const assignment = await Assignment.findByPk(assignmentId);
        if (assignment == null) {
            customLogger(logger, 'error', 'Assignment Not Found', null, req.method)
            res.status(404).send()
        } else {

            const dueDate = new Date(assignment.deadline);
            const currentDate = new Date();
            if (currentDate > dueDate) {
                customLogger(logger, 'error', 'Submission deadline has passed', null, req.method)
                res.status(400).send();
                return;
            }

            const submissionsCount = await Submission.count({
                where: {
                    assignmentId: assignment.id,
                    accountId: accountId,
                }
            });

            if (submissionsCount >= assignment.num_of_attempts) {
                customLogger(logger, 'error', 'Attempts Exceeded', null, req.method)
                res.status(400).send();
            } else {
                const submission = await Submission.create({
                    submission_url,
                    assignmentId,
                    accountId
                });
                logger.info('Submission Successful');
                const reqSubmission = {
                    id: submission.id,
                    assignment_id: assignment.id,
                    submission_url: submission.submission_url,
                    submission_date: submission.submission_date,
                    assignment_updated: assignment.assignment_updated
                    // Add other properties as needed
                };
                res.status(201).send(reqSubmission);
            }
        }

    } catch (e) {
        console.log(e)

    };
}

module.exports = {
    createSubmission: createSubmission
}