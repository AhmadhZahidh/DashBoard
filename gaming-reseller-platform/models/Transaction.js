const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'refund', 'bonus'],
    required: true
  },
  currency: {
    type: String,
    enum: ['coins', 'wallet'],
    default: 'coins'
  },
  amount: {
    type: Number,
    required: true
  },
  balanceBefore: {
    type: Number,
    default: 0
  },
  balanceAfter: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    default: '' // Order ID or other reference
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
