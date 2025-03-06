import mongoose, { Document, Schema } from 'mongoose';

export interface IDeliveryStatus {
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  location: string;
  timestamp: Date;
  description: string;
}

export interface IDelivery extends Document {
  itemName: string;
  itemDescription: string;
  itemWeight: number;
  pickupAddress: string;
  dropAddress: string;
  sender: mongoose.Types.ObjectId;
  traveler?: mongoose.Types.ObjectId;
  urgency: 'normal' | 'urgent' | 'express';
  price: number;
  distance: number;
  status: IDeliveryStatus['status'];
  trackingHistory: IDeliveryStatus[];
  createdAt: Date;
  updatedAt: Date;
}

const deliveryStatusSchema = new Schema<IDeliveryStatus>(
  {
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
  },
  { _id: true }
);

const deliverySchema = new Schema<IDelivery>(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    traveler: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

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

export default mongoose.model<IDelivery>('Delivery', deliverySchema); 