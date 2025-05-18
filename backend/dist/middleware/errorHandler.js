"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        logger_1.logger.error(`${err.status} - ${err.message}`);
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    logger_1.logger.error('Internal Server Error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map