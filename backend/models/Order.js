const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    dough: String
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ totalPrice: 1 });

module.exports = mongoose.model('Order', orderSchema); 