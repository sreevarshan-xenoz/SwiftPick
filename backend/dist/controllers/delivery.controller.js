"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryById = exports.getMyDeliveries = exports.updateDeliveryStatus = exports.acceptDelivery = exports.getAvailableDeliveries = exports.createDelivery = void 0;
const express_validator_1 = require("express-validator");
const delivery_model_1 = __importDefault(require("../models/delivery.model"));
// @desc    Create a new delivery request
// @route   POST /api/deliveries
// @access  Private (Senders only)
const createDelivery = async (req, res) => {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { itemName, itemDescription, itemWeight, pickupAddress, dropAddress, urgency, price, } = req.body;
        // Calculate distance (in a real app, this would use a mapping API)
        const distance = Math.floor(Math.random() * 50) + 5; // Mock distance between 5-55 km
        // Create new delivery request
        const delivery = await delivery_model_1.default.create({
            itemName,
            itemDescription,
            itemWeight,
            pickupAddress,
            dropAddress,
            urgency,
            price,
            distance,
            sender: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            status: 'pending',
            trackingHistory: [
                {
                    status: 'pending',
                    location: pickupAddress,
                    timestamp: new Date(),
                    description: 'Delivery request created',
                },
            ],
        });
        res.status(201).json(delivery);
    }
    catch (error) {
        console.error('Create delivery error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createDelivery = createDelivery;
// @desc    Get available deliveries for travelers
// @route   GET /api/deliveries/available
// @access  Private (Travelers only)
const getAvailableDeliveries = async (req, res) => {
    try {
        const { startLocation, endLocation } = req.query;
        let query = { status: 'pending' };
        // If start and end locations are provided, filter by them
        if (startLocation && endLocation) {
            query = {
                ...query,
                pickupAddress: { $regex: startLocation, $options: 'i' },
                dropAddress: { $regex: endLocation, $options: 'i' }
            };
        }
        const deliveries = await delivery_model_1.default.find(query)
            .populate('sender', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: deliveries
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching available deliveries',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAvailableDeliveries = getAvailableDeliveries;
// @desc    Accept a delivery
// @route   PUT /api/deliveries/:id/accept
// @access  Private (Travelers only)
const acceptDelivery = async (req, res) => {
    var _a, _b;
    try {
        const deliveryId = req.params.id;
        // Find delivery
        const delivery = await delivery_model_1.default.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        // Check if delivery is already accepted
        if (delivery.traveler) {
            return res.status(400).json({ message: 'Delivery already accepted by another traveler' });
        }
        // Check if delivery is pending
        if (delivery.status !== 'pending') {
            return res.status(400).json({ message: `Delivery cannot be accepted because it is ${delivery.status}` });
        }
        // Update delivery
        delivery.traveler = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        delivery.status = 'accepted';
        delivery.trackingHistory.push({
            status: 'accepted',
            location: delivery.pickupAddress,
            timestamp: new Date(),
            description: `Delivery accepted by ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.name}`,
        });
        await delivery.save();
        res.json(delivery);
    }
    catch (error) {
        console.error('Accept delivery error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.acceptDelivery = acceptDelivery;
// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private (Travelers only)
const updateDeliveryStatus = async (req, res) => {
    var _a, _b, _c;
    try {
        const deliveryId = req.params.id;
        const { status, location, description } = req.body;
        // Find delivery
        const delivery = await delivery_model_1.default.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        // Check if user is the assigned traveler
        if (((_a = delivery.traveler) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to update this delivery' });
        }
        // Validate status transition
        const validTransitions = {
            accepted: ['picked_up', 'cancelled'],
            picked_up: ['in_transit', 'cancelled'],
            in_transit: ['delivered', 'cancelled'],
        };
        if (!((_c = validTransitions[delivery.status]) === null || _c === void 0 ? void 0 : _c.includes(status))) {
            return res.status(400).json({
                message: `Cannot transition from ${delivery.status} to ${status}`,
            });
        }
        // Update delivery status
        delivery.status = status;
        delivery.trackingHistory.push({
            status,
            location,
            timestamp: new Date(),
            description,
        });
        await delivery.save();
        res.json(delivery);
    }
    catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateDeliveryStatus = updateDeliveryStatus;
// @desc    Get user's deliveries (sent or accepted)
// @route   GET /api/deliveries/my-deliveries
// @access  Private
const getMyDeliveries = async (req, res) => {
    var _a, _b;
    try {
        const { role } = req.user || {};
        let query = {};
        if (role === 'sender') {
            query = { sender: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id };
        }
        else if (role === 'traveler') {
            query = { traveler: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id };
        }
        const deliveries = await delivery_model_1.default.find(query)
            .sort({ createdAt: -1 })
            .populate('sender', 'name')
            .populate('traveler', 'name phone')
            .select('-__v');
        res.json(deliveries);
    }
    catch (error) {
        console.error('Get my deliveries error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMyDeliveries = getMyDeliveries;
// @desc    Get delivery by ID
// @route   GET /api/deliveries/:id
// @access  Private
const getDeliveryById = async (req, res) => {
    var _a, _b, _c;
    try {
        const deliveryId = req.params.id;
        const delivery = await delivery_model_1.default.findById(deliveryId)
            .populate('sender', 'name phone')
            .populate('traveler', 'name phone');
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        // Check if user is authorized to view this delivery
        const isAuthorized = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ||
            delivery.sender._id.toString() === ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()) ||
            (delivery.traveler && delivery.traveler._id.toString() === ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString()));
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to view this delivery' });
        }
        res.json(delivery);
    }
    catch (error) {
        console.error('Get delivery by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getDeliveryById = getDeliveryById;
