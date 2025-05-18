"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return next(new errorHandler_1.AppError(errorMessages.join(', '), 400));
    }
    next();
};
exports.validateRequest = validateRequest;
