import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '@/models/user.model';
import { AppError } from './errorHandler';

interface JwtPayload {
  id: string;
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to get access.', 401)
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    const user = await User.findById(decoded.id || decoded.userId);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token. Please log in again.', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
}; 