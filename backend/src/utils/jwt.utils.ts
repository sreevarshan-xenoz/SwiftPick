import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '30d',
    }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '90d',
    }
  );
}; 