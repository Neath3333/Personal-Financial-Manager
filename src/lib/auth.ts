import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { memoryStorage } from './memory-storage';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const getUserFromToken = async (token: string) => {
  try {
    const decoded = verifyToken(token);
    const user = memoryStorage.users.find(u => u.id === decoded.id);

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};