const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/orders - Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, couponCode } = req.body;
    const user = await User.findById(req.user._id);

    let totalAmount = 0;
    let totalCoins = 0;
    let orderItems = [];
    let discountAmount = 0;

    // Process items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not available` });
      }

      const price = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
      totalAmount += price * (item.quantity || 1);
      totalCoins += product.coinPrice * (item.quantity || 1);

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity || 1,
        price,
        coinPrice: product.coinPrice
      });
    }

    // Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > Date.now())) {
        if (coupon.discountType === 'percentage') {
          discountAmount = totalAmount * (coupon.discountValue / 100);
          if (coupon.maxDiscount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        } else if (coupon.discountType === 'fixed') {
          discountAmount = coupon.discountValue;
        }
        totalAmount -= discountAmount;
        coupon.usedCount++;
        coupon.usedBy.push({ user: user._id });
        await coupon.save();
      }
    }

    // Check payment
    if (paymentMethod === 'coins') {
      if (user.coinBalance < totalCoins) {
        return res.status(400).json({ success: false, message: 'Insufficient coin balance' });
      }
    } else if (paymentMethod === 'wallet') {
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
    }

    // Deliver keys for key products
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product.deliveryType === 'key') {
        const availableKey = product.keys.find(k => !k.isUsed);
        if (availableKey) {
          availableKey.isUsed = true;
          availableKey.usedBy = user._id;
          availableKey.usedAt = Date.now();
          item.deliveredKey = availableKey.key;
          await product.save();
        }
      }
      product.totalSold += item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      totalCoins,
      paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'completed',
      couponUsed: couponCode || '',
      discountAmount,
      completedAt: Date.now()
    });

    // Deduct balance
    const balanceBefore = paymentMethod === 'coins' ? user.coinBalance : user.walletBalance;
    if (paymentMethod === 'coins') {
      user.coinBalance -= totalCoins;
    } else if (paymentMethod === 'wallet') {
      user.walletBalance -= totalAmount;
    }
    user.totalOrders++;
    user.totalSpent += totalAmount;
    user.keysPurchased += orderItems.filter(i => i.deliveredKey).length;
    await user.save();

    // Create transaction
    await Transaction.create({
      user: user._id,
      type: 'debit',
      currency: paymentMethod === 'coins' ? 'coins' : 'wallet',
      amount: paymentMethod === 'coins' ? totalCoins : totalAmount,
      balanceBefore,
      balanceAfter: paymentMethod === 'coins' ? user.coinBalance : user.walletBalance,
      description: `Purchase: ${orderItems.map(i => i.productName).join(', ')}`,
      reference: order.orderId
    });

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${user._id}`).emit('order_completed', { orderId: order.orderId, message: 'Order completed!' });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/orders - Get user orders
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'username email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({ success: true, orders, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/orders/:id/status - Admin update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, adminNotes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, adminNotes },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${order.user}`).emit('order_updated', { orderId: order.orderId, status: orderStatus });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
