import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { IUser } from '../models/user.model';
import { FileArray } from 'express-fileupload';

export interface AuthUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: 'sender' | 'traveler' | 'admin';
  accountStatus: 'active' | 'pending' | 'suspended';
  walletBalance?: number;
  preferredLanguage?: string;
  currency?: string;
  phone?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  files?: FileArray;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
} 