"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const { validationResult } = require('express-validator');
const errorHandler_1 = require("./errorHandler");
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
            if ('path' in error) {
                return `${error.path}: ${error.msg}`;
            }
            return error.msg;
        });
        return next(new errorHandler_1.AppError(formattedErrors.join('. '), 400));
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate.middleware.js.map