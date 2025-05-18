"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { checkSchema } = require('express-validator');
const authController = __importStar(require("@/controllers/auth.controller"));
const validate_middleware_1 = require("@/middleware/validate.middleware");
const registerSchema = {
    email: {
        isEmail: {
            errorMessage: 'Please provide a valid email'
        },
        normalizeEmail: true,
        trim: true
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long'
        },
        matches: {
            options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }
    },
    name: {
        notEmpty: {
            errorMessage: 'Please provide your name'
        },
        trim: true,
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: 'Name must be between 2 and 50 characters'
        }
    }
};
const loginSchema = {
    email: {
        isEmail: {
            errorMessage: 'Please provide a valid email'
        },
        normalizeEmail: true,
        trim: true
    },
    password: {
        notEmpty: {
            errorMessage: 'Please provide a password'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long'
        }
    }
};
const router = express_1.default.Router();
router.post('/register', checkSchema(registerSchema), validate_middleware_1.validateRequest, authController.register);
router.post('/login', checkSchema(loginSchema), validate_middleware_1.validateRequest, authController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map