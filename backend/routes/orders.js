const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.userId
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's orders with search and sorting
router.get('/', auth, async (req, res) => {
  try {
    const { search, sortBy, sortOrder } = req.query;
    const query = { user: req.userId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { 'items.name': { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }
    
    const orders = await Order.find(query)
      .sort(sort)
      .populate('user', 'name email');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 