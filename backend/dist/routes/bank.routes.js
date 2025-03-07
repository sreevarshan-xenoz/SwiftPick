"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bank_controller_1 = require("../controllers/bank.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// @route   POST /api/bank/add
router.post('/add', auth_middleware_1.protect, bank_controller_1.addBankAccount);
// @route   GET /api/bank/accounts
router.get('/accounts', auth_middleware_1.protect, bank_controller_1.getBankAccounts);
// @route   PUT /api/bank/default/:accountId
router.put('/default/:accountId', auth_middleware_1.protect, bank_controller_1.setDefaultAccount);
// @route   DELETE /api/bank/:accountId
router.delete('/:accountId', auth_middleware_1.protect, bank_controller_1.deleteBankAccount);
// @route   PUT /api/bank/:userId/:accountId/verify
router.put('/:userId/:accountId/verify', auth_middleware_1.protect, auth_middleware_1.admin, bank_controller_1.verifyBankAccount);
exports.default = router;
