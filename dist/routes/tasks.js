"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_auth_1 = __importDefault(require("../middlewares/is-auth"));
const router = express_1.Router();
router.post("/", [
    express_validator_1.check('title').trim().isLength({ min: 5, max: 50 }),
    express_validator_1.check('description').trim().isLength({ min: 20, max: 250 }),
    express_validator_1.check('due_date').trim().isLength({ min: 3, max: 20 })
], is_auth_1.default);
exports.default = router;
