import { Request } from 'express';

export interface ValidationSchema {
  [field: string]: {
    optional?: boolean;
    notEmpty?: {
      errorMessage: string;
    };
    isEmail?: {
      errorMessage: string;
    };
    isNumeric?: {
      errorMessage: string;
    };
    isArray?: {
      errorMessage: string;
    };
    isLength?: {
      options: { min: number; max?: number };
      errorMessage: string;
    };
    matches?: {
      options: RegExp;
      errorMessage: string;
    };
    isIn?: {
      options: [string[]];
      errorMessage: string;
    };
    custom?: {
      options: (value: any, { req }: { req: Request }) => boolean;
      errorMessage: string;
    };
    isISO8601?: {
      errorMessage: string;
    };
    in?: string[];
    normalizeEmail?: boolean;
    trim?: boolean;
  };
} 