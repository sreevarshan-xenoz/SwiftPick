import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

interface AuthRequest extends Request {
  user?: { 
    id: string; 
    role?: 'sender' | 'traveler' | 'admin';
    accountStatus?: 'active' | 'pending' | 'suspended';
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = { 
      id: user.id, 
      role: user.role,
      accountStatus: user.accountStatus 
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Middleware to check if user is a sender
export const isSender = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'sender') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, sender access required' });
  }
};

// Middleware to check if user is a traveler
export const isTraveler = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'traveler') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, traveler access required' });
  }
};

export const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const isActive = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.accountStatus === 'active') {
    next();
  } else {
    res.status(403).json({ message: 'Account is not active' });
  }
};