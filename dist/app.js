"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const auth_1 = __importDefault(require("./routes/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = express_1.default();
app.use(body_parser_1.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use('/auth', auth_1.default);
app.use((err, _req, res, _next) => {
    if (!err.message) {
        err.message = "Something went wrong";
    }
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).json({ message: err.message });
});
mongoose_1.default.connect("mongodb+srv://mohannedm:zip123@cluster0-usvsi.mongodb.net/tasky?retryWrites=true&w=majority")
    .then(() => {
    app.listen("8080");
});
