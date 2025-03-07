"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBank = void 0;
const mongoose_1 = require("mongoose");
const bankAccountSchema = new mongoose_1.Schema({
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
const userBankSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    accounts: [bankAccountSchema]
});
exports.UserBank = (0, mongoose_1.model)('UserBank', userBankSchema);
