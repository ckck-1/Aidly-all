import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';

interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: never; // Explicitly prevent password from being included
}

interface UpdateHealthDataBody {
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id) as IUser | null;
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request<{}, {}, UpdateUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    if ('password' in req.body) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updatePassword.',
          400
        )
      );
    }

    const filteredBody = filterObj<UpdateUserBody>(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const updateHealthData = async (
  req: Request<{}, {}, UpdateHealthDataBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const healthData = filterObj<UpdateHealthDataBody>(
      req.body,
      'height',
      'weight',
      'bloodType',
      'allergies',
      'medications',
      'conditions'
    ) as UpdateHealthDataBody;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { healthData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const filterObj = <T extends object>(obj: T, ...allowedFields: (keyof T)[]) => {
  const newObj: Partial<T> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el as keyof T)) {
      newObj[el as keyof T] = obj[el as keyof T];
    }
  });
  return newObj;
}; 