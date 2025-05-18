"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logsDir = path_1.default.join(process.cwd(), 'logs');
try {
    if (!fs_1.default.existsSync(logsDir)) {
        fs_1.default.mkdirSync(logsDir, { recursive: true });
    }
}
catch (error) {
    console.error('Error creating logs directory:', error);
    process.exit(1);
}
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
    if (stack) {
        return `${timestamp} ${level}: ${message}\n${stack}`;
    }
    return `${timestamp} ${level}: ${message}`;
}));
const rotateOptions = {
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
    auditFile: path_1.default.join(logsDir, 'audit.json'),
    zippedArchive: true,
};
const fileRotateTransport = new winston_daily_rotate_file_1.default({
    ...rotateOptions,
    filename: path_1.default.join(logsDir, '%DATE%-combined.log'),
    handleExceptions: true,
    handleRejections: true,
});
const errorRotateTransport = new winston_daily_rotate_file_1.default({
    ...rotateOptions,
    filename: path_1.default.join(logsDir, '%DATE%-error.log'),
    level: 'error',
    handleExceptions: true,
    handleRejections: true,
});
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
    exports.logger.info(`Log rotated from ${oldFilename} to ${newFilename}`);
});
errorRotateTransport.on('rotate', (oldFilename, newFilename) => {
    exports.logger.info(`Error log rotated from ${oldFilename} to ${newFilename}`);
});
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        fileRotateTransport,
        errorRotateTransport,
    ],
    exitOnError: false,
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        handleExceptions: true,
        handleRejections: true,
    }));
}
exports.stream = {
    write: (message) => {
        exports.logger.info(message.trim());
    },
};
process.on('uncaughtException', (error) => {
    exports.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    exports.logger.error('Unhandled Rejection:', reason);
});
//# sourceMappingURL=logger.js.map