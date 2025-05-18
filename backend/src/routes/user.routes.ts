import express from 'express';
const { checkSchema } = require('express-validator');
import * as userController from '@/controllers/user.controller';
import { protect, restrictTo } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validate.middleware';
import { ValidationSchema } from '@/types/validation';

const router = express.Router();

const updateProfileSchema: ValidationSchema = {
  name: {
    optional: true,
    notEmpty: {
      errorMessage: 'Name cannot be empty'
    }
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: 'Please provide a valid email'
    }
  }
};

const updateHealthSchema: ValidationSchema = {
  height: {
    optional: true,
    isNumeric: {
      errorMessage: 'Height must be a number'
    }
  },
  weight: {
    optional: true,
    isNumeric: {
      errorMessage: 'Weight must be a number'
    }
  },
  bloodType: {
    optional: true,
    notEmpty: {
      errorMessage: 'Blood type cannot be empty'
    }
  },
  allergies: {
    optional: true,
    isArray: {
      errorMessage: 'Allergies must be an array'
    }
  },
  medications: {
    optional: true,
    isArray: {
      errorMessage: 'Medications must be an array'
    }
  },
  conditions: {
    optional: true,
    isArray: {
      errorMessage: 'Conditions must be an array'
    }
  }
};

// Protected routes
router.use(protect);

// Get current user profile
router.get('/me', userController.getMe);

// Update current user profile
router.patch(
  '/me',
  checkSchema(updateProfileSchema),
  validateRequest,
  userController.updateMe
);

// Update health data
router.patch(
  '/me/health',
  checkSchema(updateHealthSchema),
  validateRequest,
  userController.updateHealthData
);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);

export default router; 