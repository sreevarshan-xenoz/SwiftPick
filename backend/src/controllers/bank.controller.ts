import { Request, Response } from 'express';
import { UserBank, BankAccount } from '../models/bank.model';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const addBankAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accountHolder, accountNumber, bankName, ifscCode } = req.body;

    const newAccount: BankAccount = {
      status: 'pending',
      accountHolder,
      accountNumber,
      bankName,
      ifscCode,
      isDefault: false
    };

    let userBank = await UserBank.findOne({ userId });

    if (!userBank) {
      userBank = new UserBank({
        userId,
        accounts: [newAccount]
      });
    } else {
      userBank.accounts.push(newAccount);
    }

    await userBank.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bank account', error });
  }
};

export const getBankAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userBank = await UserBank.findOne({ userId });
    if (!userBank) {
      return res.json({ accounts: [] });
    }

    res.json({ accounts: userBank.accounts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bank accounts', error });
  }
};

export const setDefaultAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accountId } = req.params;

    const userBank = await UserBank.findOne({ userId });
    if (!userBank) {
      return res.status(404).json({ message: 'No bank accounts found' });
    }

    userBank.accounts = userBank.accounts.map(account => ({
      ...account,
      isDefault: account._id?.toString() === accountId
    }));

    await userBank.save();
    res.json({ message: 'Default account updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting default account', error });
  }
};

export const deleteBankAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accountId } = req.params;

    const userBank = await UserBank.findOne({ userId });
    if (!userBank) {
      return res.status(404).json({ message: 'No bank accounts found' });
    }

    userBank.accounts = userBank.accounts.filter(
      account => account._id?.toString() !== accountId
    );

    await userBank.save();
    res.json({ message: 'Bank account deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bank account', error });
  }
};

export const verifyBankAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, accountId } = req.params;
    const { status } = req.body;

    const userBank = await UserBank.findOne({ userId });
    if (!userBank) {
      return res.status(404).json({ message: 'No bank accounts found' });
    }

    const account = userBank.accounts.find(
      acc => acc._id?.toString() === accountId
    );
    if (!account) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    account.status = status;
    if (status === 'verified') {
      account.verifiedAt = new Date();
    }

    await userBank.save();
    res.json({ message: 'Bank account verification status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying bank account', error });
  }
};