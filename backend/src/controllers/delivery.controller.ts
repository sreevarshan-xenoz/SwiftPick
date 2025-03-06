import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Delivery from '../models/delivery.model';
import { AuthRequest } from '../types/auth';

// @desc    Create a new delivery request
// @route   POST /api/deliveries
// @access  Private (Senders only)
export const createDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      itemName,
      itemDescription,
      itemWeight,
      pickupAddress,
      dropAddress,
      urgency,
      price,
    } = req.body;

    // Calculate distance (in a real app, this would use a mapping API)
    const distance = Math.floor(Math.random() * 50) + 5; // Mock distance between 5-55 km

    // Create new delivery request
    const delivery = await Delivery.create({
      itemName,
      itemDescription,
      itemWeight,
      pickupAddress,
      dropAddress,
      urgency,
      price,
      distance,
      sender: req.user?._id,
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
  } catch (error: any) {
    console.error('Create delivery error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available deliveries for travelers
// @route   GET /api/deliveries/available
// @access  Private (Travelers only)
export const getAvailableDeliveries = async (req: Request, res: Response) => {
  try {
    const { startLocation, endLocation } = req.query;
    
    let query: any = { status: 'pending' };
    
    // If start and end locations are provided, filter by them
    if (startLocation && endLocation) {
      query = {
        ...query,
        pickupAddress: { $regex: startLocation, $options: 'i' },
        dropAddress: { $regex: endLocation, $options: 'i' }
      };
    }

    const deliveries = await Delivery.find(query)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available deliveries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Accept a delivery
// @route   PUT /api/deliveries/:id/accept
// @access  Private (Travelers only)
export const acceptDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const deliveryId = req.params.id;

    // Find delivery
    const delivery = await Delivery.findById(deliveryId);
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
    delivery.traveler = req.user?._id;
    delivery.status = 'accepted';
    delivery.trackingHistory.push({
      status: 'accepted',
      location: delivery.pickupAddress,
      timestamp: new Date(),
      description: `Delivery accepted by ${req.user?.name}`,
    });

    await delivery.save();

    res.json(delivery);
  } catch (error: any) {
    console.error('Accept delivery error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private (Travelers only)
export const updateDeliveryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const deliveryId = req.params.id;
    const { status, location, description } = req.body;

    // Find delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Check if user is the assigned traveler
    if (delivery.traveler?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this delivery' });
    }

    // Validate status transition
    const validTransitions: { [key: string]: string[] } = {
      accepted: ['picked_up', 'cancelled'],
      picked_up: ['in_transit', 'cancelled'],
      in_transit: ['delivered', 'cancelled'],
    };

    if (!validTransitions[delivery.status]?.includes(status)) {
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
  } catch (error: any) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's deliveries (sent or accepted)
// @route   GET /api/deliveries/my-deliveries
// @access  Private
export const getMyDeliveries = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user || {};
    let query = {};

    if (role === 'sender') {
      query = { sender: req.user?._id };
    } else if (role === 'traveler') {
      query = { traveler: req.user?._id };
    }

    const deliveries = await Delivery.find(query)
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('traveler', 'name phone')
      .select('-__v');

    res.json(deliveries);
  } catch (error: any) {
    console.error('Get my deliveries error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get delivery by ID
// @route   GET /api/deliveries/:id
// @access  Private
export const getDeliveryById = async (req: AuthRequest, res: Response) => {
  try {
    const deliveryId = req.params.id;

    const delivery = await Delivery.findById(deliveryId)
      .populate('sender', 'name phone')
      .populate('traveler', 'name phone');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Check if user is authorized to view this delivery
    const isAuthorized =
      req.user?.role === 'admin' ||
      delivery.sender._id.toString() === req.user?._id.toString() ||
      (delivery.traveler && delivery.traveler._id.toString() === req.user?._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this delivery' });
    }

    res.json(delivery);
  } catch (error: any) {
    console.error('Get delivery by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 