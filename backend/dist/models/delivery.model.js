"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const deliveryStatusSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
}, { _id: true });
const deliverySchema = new mongoose_1.Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
    },
    itemDescription: {
        type: String,
        required: [true, 'Item description is required'],
        trim: true,
    },
    itemWeight: {
        type: Number,
        required: [true, 'Item weight is required'],
    },
    pickupAddress: {
        type: String,
        required: [true, 'Pickup address is required'],
        trim: true,
    },
    dropAddress: {
        type: String,
        required: [true, 'Drop address is required'],
        trim: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required'],
    },
    traveler: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    urgency: {
        type: String,
        enum: ['normal', 'urgent', 'express'],
        default: 'normal',
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    distance: {
        type: Number,
        required: [true, 'Distance is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
        default: 'pending',
    },
    trackingHistory: [deliveryStatusSchema],
}, {
    timestamps: true,
});
// Add initial tracking history on creation
deliverySchema.pre('save', function (next) {
    if (this.isNew) {
        this.trackingHistory.push({
            status: 'pending',
            location: this.pickupAddress,
            timestamp: new Date(),
            description: 'Delivery request created',
        });
    }
    next();
});
exports.default = mongoose_1.default.model('Delivery', deliverySchema);
