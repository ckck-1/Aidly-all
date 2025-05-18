import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7h';

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  } as SignOptions;
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 