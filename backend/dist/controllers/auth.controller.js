"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("../middleware/errorHandler");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d',
    });
};
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return next(new errorHandler_1.AppError('Email already in use', 400));
        }
        const user = (await user_model_1.User.create({
            email,
            password,
            name,
        }));
        const token = signToken(user._id.toString());
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return next(new errorHandler_1.AppError('Incorrect email or password', 401));
        }
        const token = signToken(user._id.toString());
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map