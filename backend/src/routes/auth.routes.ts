import express from 'express';
const { checkSchema } = require('express-validator');
import * as authController from '@/controllers/auth.controller';
import { validateRequest } from '@/middleware/validate.middleware';
import { ValidationSchema } from '@/types/validation';

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

const registerSchema: ValidationSchema = {
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

const loginSchema: ValidationSchema = {
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

const router = express.Router();

router.post<{}, {}, RegisterBody>(
  '/register',
  checkSchema(registerSchema),
  validateRequest,
  authController.register
);

router.post<{}, {}, LoginBody>(
  '/login',
  checkSchema(loginSchema),
  validateRequest,
  authController.login
);

export default router; 