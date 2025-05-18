import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Error creating logs directory:', error);
  process.exit(1);
}

// Custom format for better error handling
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    if (stack) {
      // Format error logs with stack trace
      return `${timestamp} ${level}: ${message}\n${stack}`;
    }
    return `${timestamp} ${level}: ${message}`;
  })
);

// Configure file rotation options
const rotateOptions = {
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  auditFile: path.join(logsDir, 'audit.json'),
  zippedArchive: true,
};

// Create transports with error handling
const fileRotateTransport = new DailyRotateFile({
  ...rotateOptions,
  filename: path.join(logsDir, '%DATE%-combined.log'),
  handleExceptions: true,
  handleRejections: true,
});

const errorRotateTransport = new DailyRotateFile({
  ...rotateOptions,
  filename: path.join(logsDir, '%DATE%-error.log'),
  level: 'error',
  handleExceptions: true,
  handleRejections: true,
});

// Add event handlers for rotate events
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`Log rotated from ${oldFilename} to ${newFilename}`);
});

errorRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`Error log rotated from ${oldFilename} to ${newFilename}`);
});

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    fileRotateTransport,
    errorRotateTransport,
  ],
  exitOnError: false,
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      handleExceptions: true,
      handleRejections: true,
    })
  );
}

// Create a stream object for Morgan integration
export const stream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

// Add global error handlers
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
}); 