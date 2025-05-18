"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("./errorHandler");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new errorHandler_1.AppError('You are not logged in. Please log in to get access.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await user_model_1.User.findById(decoded.id || decoded.userId);
        if (!user) {
            return next(new errorHandler_1.AppError('The user belonging to this token no longer exists.', 401));
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new errorHandler_1.AppError('Invalid token. Please log in again.', 401));
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.middleware.js.map