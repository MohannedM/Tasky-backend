"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = __importDefault(require("../models/Task"));
const helperFunctions_1 = require("../helpers/helperFunctions");
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
exports.createTask = async (req, res, next) => {
    var _a, _b;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        helperFunctions_1.errorThrower("Validation error! Please check your inputs.", 400);
    }
    if (!req.isAuth || !req.userId) {
        helperFunctions_1.errorThrower('Unauthorized', 401);
    }
    const title = req.body.title;
    const due_date = req.body.due_date;
    const description = req.body.description;
    const assigned_to = (_a = req.body) === null || _a === void 0 ? void 0 : _a.assigned_to;
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            helperFunctions_1.errorThrower("User not found.", 401);
            return;
        }
        const newTaskObject = {
            title,
            dueDate: due_date,
            description,
            createdBy: user
        };
        assigned_to ? newTaskObject.assignedTo = assigned_to : null;
        const task = new Task_1.default({ ...newTaskObject });
        const savedTask = await task.save();
        (_b = user.tasksCreated) === null || _b === void 0 ? void 0 : _b.push(savedTask);
        await user.save();
        res.status(201).json({ message: "Task created successfully.", task: {
                id: savedTask._id.toString(),
                title: savedTask.title,
                description: savedTask.description,
                dueDate: savedTask.dueDate,
                assignedTo: savedTask.assignedTo,
                createdBy: {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                createdAt: savedTask.createdAt.toISOString(),
                updatedAt: savedTask.updatedAt.toISOString(),
            } });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
