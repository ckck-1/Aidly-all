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
const healthController = __importStar(require("@/controllers/health.controller"));
const auth_middleware_1 = require("@/middleware/auth.middleware");
const validate_middleware_1 = require("@/middleware/validate.middleware");
const metricSchema = {
    type: {
        isIn: {
            options: [['weight', 'blood_pressure', 'heart_rate', 'blood_sugar']],
            errorMessage: 'Invalid metric type'
        }
    },
    value: {
        notEmpty: {
            errorMessage: 'Value is required'
        },
        custom: {
            options: (value, { req }) => {
                const { type } = req.body;
                if (type === 'blood_pressure') {
                    return /^\d{2,3}\/\d{2,3}$/.test(value.toString());
                }
                return !isNaN(Number(value));
            },
            errorMessage: 'Invalid value format for the specified metric type'
        }
    },
    unit: {
        notEmpty: {
            errorMessage: 'Unit is required'
        },
        custom: {
            options: (unit, { req }) => {
                var _a;
                const validUnits = {
                    weight: ['kg', 'lbs'],
                    blood_pressure: ['mmHg'],
                    heart_rate: ['bpm'],
                    blood_sugar: ['mg/dL', 'mmol/L']
                };
                return (_a = validUnits[req.body.type]) === null || _a === void 0 ? void 0 : _a.includes(unit);
            },
            errorMessage: 'Invalid unit for the specified metric type'
        }
    },
    timestamp: {
        optional: true,
        isISO8601: {
            errorMessage: 'Invalid timestamp format'
        }
    }
};
const metricParamSchema = {
    type: {
        in: ['params'],
        isIn: {
            options: [['weight', 'blood_pressure', 'heart_rate', 'blood_sugar']],
            errorMessage: 'Invalid metric type'
        }
    }
};
const dateQuerySchema = {
    from: {
        in: ['query'],
        optional: true,
        isISO8601: {
            errorMessage: 'Invalid from date format'
        }
    },
    to: {
        in: ['query'],
        optional: true,
        isISO8601: {
            errorMessage: 'Invalid to date format'
        }
    }
};
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.get('/recommendations', healthController.getHealthRecommendations);
router.post('/metrics', checkSchema(metricSchema), validate_middleware_1.validateRequest, healthController.logHealthMetric);
router.get('/metrics/:type', checkSchema({ ...metricParamSchema, ...dateQuerySchema }), validate_middleware_1.validateRequest, healthController.getHealthMetrics);
router.get('/summary', healthController.getHealthSummary);
exports.default = router;
//# sourceMappingURL=health.routes.js.map