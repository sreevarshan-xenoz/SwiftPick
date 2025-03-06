import { Document, Schema, model } from 'mongoose';

export interface BankAccount {
  _id?: Schema.Types.ObjectId;
  status: 'pending' | 'verified' | 'rejected' | 'not_added';
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  isDefault: boolean;
  verifiedAt?: Date;
}

export interface UserBankDocument extends Document {
  userId: Schema.Types.ObjectId;
  accounts: BankAccount[];
}

const bankAccountSchema = new Schema<BankAccount>({
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'not_added'],
    default: 'pending'
  },
  accountHolder: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  ifscCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  verifiedAt: { type: Date }
});

const userBankSchema = new Schema<UserBankDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accounts: [bankAccountSchema]
});

export const UserBank = model<UserBankDocument>('UserBank', userBankSchema); 