import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { AuthRequest, JwtPayload } from '../types/auth';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
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

// Middleware to check if account is active
export const isActive = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.accountStatus === 'active') {
    next();
  } else {
    res.status(403).json({ message: 'Account is not active' });
  }
}; 