import express from 'express';
const { checkSchema } = require('express-validator');
import * as healthController from '@/controllers/health.controller';
import { protect } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validate.middleware';
import { ValidationSchema } from '@/types/validation';

export interface HealthMetricBody {
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar';
  value: string | number;
  unit: string;
  timestamp?: string;
}

const metricSchema: ValidationSchema = {
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
      options: (value: string | number, { req }: { req: express.Request }) => {
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
      options: (unit: string, { req }: { req: express.Request }) => {
        const validUnits: Record<string, string[]> = {
          weight: ['kg', 'lbs'],
          blood_pressure: ['mmHg'],
          heart_rate: ['bpm'],
          blood_sugar: ['mg/dL', 'mmol/L']
        };
        return validUnits[req.body.type]?.includes(unit);
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

const metricParamSchema: ValidationSchema = {
  type: {
    in: ['params'],
    isIn: {
      options: [['weight', 'blood_pressure', 'heart_rate', 'blood_sugar']],
      errorMessage: 'Invalid metric type'
    }
  }
};

const dateQuerySchema: ValidationSchema = {
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

const router = express.Router();

// Protect all routes
router.use(protect);

// Get health recommendations
router.get('/recommendations', healthController.getHealthRecommendations);

// Log health metrics
router.post<{}, {}, HealthMetricBody>(
  '/metrics',
  checkSchema(metricSchema),
  validateRequest,
  healthController.logHealthMetric
);

// Get health metrics history
router.get(
  '/metrics/:type',
  checkSchema({ ...metricParamSchema, ...dateQuerySchema }),
  validateRequest,
  healthController.getHealthMetrics
);

// Get health summary
router.get('/summary', healthController.getHealthSummary);

export default router; 