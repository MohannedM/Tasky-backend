import mongoose from 'mongoose'
export interface JsonError extends Error{
    statusCode?: number;
}

export interface userDocument extends mongoose.Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tasksCreated?: [taskDocument];
    tasksAssigned?: [taskDocument];
}

export interface taskDocument extends mongoose.Document{
    title: string;
    description: string;
    dueDate: number;
    status: string;
    createdBy: userDocument;
    assignedTo?: userDocument;
}
