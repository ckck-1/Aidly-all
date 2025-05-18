"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("@/middleware/errorHandler");
const auth_routes_1 = __importDefault(require("@/routes/auth.routes"));
const user_routes_1 = __importDefault(require("@/routes/user.routes"));
const health_routes_1 = __importDefault(require("@/routes/health.routes"));
const logger_1 = require("@/utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev', { stream: logger_1.stream }));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/health', health_routes_1.default);
app.use(errorHandler_1.errorHandler);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aidly-health';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    logger_1.logger.info('Connected to MongoDB');
    app.listen(port, () => {
        logger_1.logger.info(`Server is running on port ${port}`);
        logger_1.logger.info(`Frontend URL: ${corsOptions.origin}`);
    });
})
    .catch((error) => {
    logger_1.logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map