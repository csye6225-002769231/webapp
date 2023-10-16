const { ValidationError } = require('sequelize');

const sequelize = require('../db.js').sequelize;
const account = require('../model/account.js').account;
const Assignment = require('../model/assignment.js').assignment;

// Create a new assignment
const createAssignment = async (req, res) => {

    const { name, points, num_of_attempts, deadline } = req.body;
    const accountId = req.account.id;
    const bodyLength = parseInt(req.get('Content-Length') || '0', 10)

    try {
        if (bodyLength == 0) {
            res.status(400).send();
        }
        if (typeof name !== 'string' ||
            typeof points !== 'number' ||
            typeof num_of_attempts !== 'number' ||
            typeof deadline !== 'string' ||
            !name || !points || !num_of_attempts || !deadline) {
            return res.status(400).send();
        }
        if (!Number.isInteger(points) || !Number.isInteger(num_of_attempts)) {
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

        res.status(201).send(responseAssignment);

        // res.status(201).send(assignment);



    } catch (e) {
        if (e instanceof ValidationError) {
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
            res.status(400).send();

        } else {
            res.status(200).send(assignments);
        }

        // console.log(req.body)
    }
    catch (e) {
        res.status(400).send();
    }
};

const getAssignmentById = async (req, res) => {
    // await sequelize.query(`USE \`${process.env.DATABASE}\``);
    const { id } = req.params;
    try {
        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (Object.keys(req.query).length > 0 || bodyLength > 0) {
            res.status(400).send();
        } else {
            const assignments = await Assignment.findByPk(id, {
                attributes: {
                    exclude: ['accountId']
                }
            });
            if (assignments == null) {
                res.status(404).send()
            } else {
                res.status(200).send(assignments);
            }
        }

    } catch (e) {
        res.status(400).send();
    }
};

const updateAssignment = async (req, res) => {
    const { name, points, num_of_attempts, deadline } = req.body;
    const { id } = req.params;
    const accountId = req.account.id;
    try {
        const bodyLength = parseInt(req.get('Content-Length') || '0', 10)
        if (bodyLength == 0) {
            res.status(400).send();

        }
        if (typeof name !== 'string' ||
            typeof points !== 'number' ||
            typeof num_of_attempts !== 'number' ||
            typeof deadline !== 'string' ||
            !name || !points || !num_of_attempts || !deadline) {
            return res.status(400).send();
        }
        if (!Number.isInteger(points) || !Number.isInteger(num_of_attempts)) {
            return res.status(400).send();
        }
        if (Object.keys(req.body).every(key => ['name', 'points', 'num_of_attempts', 'deadline'].includes(key)) === false) {
            return res.status(400).send();
        }
        const assignment = await Assignment.findByPk(id);
        if (assignment == null) {
            res.status(404).send()
        } else {
            if (accountId != assignment.accountId) {
                res.status(403).send();
            } else {
                assignment.name = name;
                assignment.points = points;
                assignment.num_of_attempts = num_of_attempts;
                assignment.deadline = deadline;
                await assignment.save();
                res.status(204).send(assignment);
            }
        }
    }
    catch (e) {
        if (e instanceof ValidationError) {
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
            res.status(400).send();
        } else {
            const assignment = await Assignment.findByPk(id);
            if (assignment == null) {
                res.status(404).send();
            } else {
                if (accountId != assignment.accountId) {
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