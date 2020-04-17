import Task from '../models/Task';
import { RequestHandler } from 'express';
import { authRequest, newTaskType, taskDocument } from '../helpers/interfaces.module';
import { errorThrower } from '../helpers/helperFunctions';
import {validationResult} from 'express-validator';
import User from '../models/User';


export const createTask: RequestHandler = async (req: authRequest, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorThrower("Validation error! Please check your inputs.", 400);
    }
    if(!req.isAuth || !req.userId){
        errorThrower('Unauthorized', 401);
    }

    const title: string = (req.body as {title:string;}).title;
    const due_date: number = (req.body as {due_date:number;}).due_date;
    const description: string = (req.body as {description:string;}).description;
    const assigned_to: string | undefined  = (req.body as {assigned_to?:string;})?.assigned_to;
    try{
        const user = await User.findById(req.userId);
        if(!user){
            errorThrower("User not found.", 401);
            return;
        }

        const newTaskObject: newTaskType = {
            title,
            dueDate: due_date,
            description,
            createdBy: user
        }
        assigned_to ? newTaskObject.assignedTo = assigned_to : null;

        const task = new Task({...newTaskObject});
        const savedTask: taskDocument = await task.save();

        user.tasksCreated?.push(savedTask);
        await user.save();

        res.status(201).json({message: "Task created successfully.", task: {
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
        }});


    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

    
}