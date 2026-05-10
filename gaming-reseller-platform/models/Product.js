const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  shortDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  coinPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['free-fire', 'gaming-panel', 'apk', 'vip-subscription', 'digital-key', 'other'],
    default: 'other'
  },
  subCategory: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  images: [String],
  stock: {
    type: Number,
    default: -1 // -1 = unlimited
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isHot: {
    type: Boolean,
    default: false
  },
  platform: {
    type: String,
    enum: ['android', 'ios', 'pc', 'all'],
    default: 'all'
  },
  duration: {
    type: String,
    default: '' // e.g., "1 Day", "7 Days", "31 Days"
  },
  deliveryType: {
    type: String,
    enum: ['instant', 'manual', 'key'],
    default: 'instant'
  },
  keys: [{
    key: String,
    isUsed: { type: Boolean, default: false },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedAt: Date
  }],
  totalSold: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  badge: {
    type: String,
    default: '' // e.g., "HOT", "NEW", "SALE"
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  originalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for discounted price
productSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
