const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    productImage: String,
    quantity: { type: Number, default: 1 },
    price: Number,
    coinPrice: Number,
    deliveredKey: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  totalCoins: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['coins', 'wallet', 'manual', 'coupon'],
    default: 'coins'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  couponUsed: {
    type: String,
    default: ''
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },
  deliveredAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
