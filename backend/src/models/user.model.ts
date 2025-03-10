import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'sender' | 'traveler';
  joinedDate: Date;
  isVerified: boolean;
  accountStatus: 'active' | 'pending' | 'suspended';
  walletBalance: number;
  preferredLanguage: string;
  currency: string;
  profileImage?: string;
  // KYC Fields
  kyc: {
    status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
    idType: 'passport' | 'driving_license' | 'national_id';
    idNumber: string;
    idImage: string;
    selfieImage: string;
    addressProofImage: string;
    rejectionReason?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
  };
  // Bank Account Fields
  bankAccount: {
    status: 'not_added' | 'pending' | 'verified' | 'rejected';
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    isDefault: boolean;
    verifiedAt?: Date;
  }[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['sender', 'traveler'],
      default: 'sender',
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending',
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    preferredLanguage: {
      type: String,
      default: 'English',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    profileImage: {
      type: String,
    },
    kyc: {
      status: {
        type: String,
        enum: ['not_submitted', 'pending', 'verified', 'rejected'],
        default: 'not_submitted',
      },
      idType: {
        type: String,
        enum: ['passport', 'driving_license', 'national_id'],
      },
      idNumber: String,
      idImage: String,
      selfieImage: String,
      addressProofImage: String,
      rejectionReason: String,
      submittedAt: Date,
      verifiedAt: Date,
    },
    bankAccount: [{
      status: {
        type: String,
        enum: ['not_added', 'pending', 'verified', 'rejected'],
        default: 'not_added',
      },
      accountHolder: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
    }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 