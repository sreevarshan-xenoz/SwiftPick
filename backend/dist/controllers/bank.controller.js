"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBankAccount = exports.deleteBankAccount = exports.setDefaultAccount = exports.getBankAccounts = exports.addBankAccount = void 0;
const bank_model_1 = require("../models/bank.model");
const addBankAccount = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { accountHolder, accountNumber, bankName, ifscCode } = req.body;
        const newAccount = {
            status: 'pending',
            accountHolder,
            accountNumber,
            bankName,
            ifscCode,
            isDefault: false
        };
        let userBank = await bank_model_1.UserBank.findOne({ userId });
        if (!userBank) {
            userBank = new bank_model_1.UserBank({
                userId,
                accounts: [newAccount]
            });
        }
        else {
            userBank.accounts.push(newAccount);
        }
        await userBank.save();
        res.status(201).json(newAccount);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding bank account', error });
    }
};
exports.addBankAccount = addBankAccount;
const getBankAccounts = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userBank = await bank_model_1.UserBank.findOne({ userId });
        if (!userBank) {
            return res.json({ accounts: [] });
        }
        res.json({ accounts: userBank.accounts });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bank accounts', error });
    }
};
exports.getBankAccounts = getBankAccounts;
const setDefaultAccount = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { accountId } = req.params;
        const userBank = await bank_model_1.UserBank.findOne({ userId });
        if (!userBank) {
            return res.status(404).json({ message: 'No bank accounts found' });
        }
        userBank.accounts = userBank.accounts.map(account => {
            var _a;
            return ({
                ...account,
                isDefault: ((_a = account._id) === null || _a === void 0 ? void 0 : _a.toString()) === accountId
            });
        });
        await userBank.save();
        res.json({ message: 'Default account updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error setting default account', error });
    }
};
exports.setDefaultAccount = setDefaultAccount;
const deleteBankAccount = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { accountId } = req.params;
        const userBank = await bank_model_1.UserBank.findOne({ userId });
        if (!userBank) {
            return res.status(404).json({ message: 'No bank accounts found' });
        }
        userBank.accounts = userBank.accounts.filter(account => { var _a; return ((_a = account._id) === null || _a === void 0 ? void 0 : _a.toString()) !== accountId; });
        await userBank.save();
        res.json({ message: 'Bank account deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting bank account', error });
    }
};
exports.deleteBankAccount = deleteBankAccount;
const verifyBankAccount = async (req, res) => {
    try {
        const { userId, accountId } = req.params;
        const { status } = req.body;
        const userBank = await bank_model_1.UserBank.findOne({ userId });
        if (!userBank) {
            return res.status(404).json({ message: 'No bank accounts found' });
        }
        const account = userBank.accounts.find(acc => { var _a; return ((_a = acc._id) === null || _a === void 0 ? void 0 : _a.toString()) === accountId; });
        if (!account) {
            return res.status(404).json({ message: 'Bank account not found' });
        }
        account.status = status;
        if (status === 'verified') {
            account.verifiedAt = new Date();
        }
        await userBank.save();
        res.json({ message: 'Bank account verification status updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error verifying bank account', error });
    }
};
exports.verifyBankAccount = verifyBankAccount;
