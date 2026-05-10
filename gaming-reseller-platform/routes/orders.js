const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');
const { sendEmail } = require('../utils/sendEmail');

const ADMIN_EMAIL = 'ahmadhzahidh215@gmail.com';
const WA_NUMBER = '94742560815';

// @POST /api/orders/whatsapp-gmail - Create order via WhatsApp/Gmail
router.post('/whatsapp-gmail', protect, async (req, res) => {
  try {
    const {
      productName, productId, coinsAmount, priceLKR,
      description, country, whatsappNumber, notes,
      orderMethod // 'whatsapp' | 'gmail'
    } = req.body;

    const user = await User.findById(req.user._id);
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Save order to DB
    const order = await Order.create({
      user: user._id,
      items: [{
        product: productId || null,
        productName: productName || 'Custom Order',
        productImage: '',
        quantity: 1,
        price: priceLKR || 0,
        coinPrice: coinsAmount || 0
      }],
      totalAmount: priceLKR || 0,
      totalCoins: coinsAmount || 0,
      paymentMethod: 'manual',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes: `${description || ''}\nCountry: ${country || ''}\nWhatsApp: ${whatsappNumber || ''}\nMethod: ${orderMethod}\n${notes || ''}`,
      orderId
    });

    // Send email if Gmail method
    if (orderMethod === 'gmail') {
      try {
        const emailBody = `
          <div style="background:#0a0a0f;color:#fff;font-family:Arial,sans-serif;padding:32px;max-width:600px;margin:0 auto;border-radius:12px;border:1px solid #7c3aed;">
            <h1 style="color:#a855f7;font-size:24px;margin-bottom:4px;">🎮 New Dashboard Order</h1>
            <p style="color:#505070;font-size:13px;margin-bottom:24px;">Order received at ${new Date().toLocaleString()}</p>
            <table style="width:100%;border-collapse:collapse;">
              ${[
                ['Order ID', orderId],
                ['Product', productName],
                ['Coins', coinsAmount + ' coins'],
                ['Price', 'Rs. ' + priceLKR],
                ['Description', description || '-'],
                ['Customer Name', user.username],
                ['Email', user.email],
                ['WhatsApp', whatsappNumber || '-'],
                ['Country', country || '-'],
                ['Notes', notes || '-'],
                ['Order Method', orderMethod],
                ['Date/Time', new Date().toLocaleString()],
              ].map(([k, v]) => `
                <tr>
                  <td style="padding:10px 14px;background:#12121f;color:#9090b0;font-size:13px;border-bottom:1px solid #1a1a2e;width:40%;">${k}</td>
                  <td style="padding:10px 14px;background:#0e0e1f;color:#fff;font-size:13px;border-bottom:1px solid #1a1a2e;">${v}</td>
                </tr>
              `).join('')}
            </table>
            <div style="margin-top:24px;padding:16px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:8px;">
              <p style="color:#a855f7;font-size:13px;margin:0;">Reply to this email or WhatsApp the customer to confirm their order.</p>
            </div>
          </div>
        `;
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `🎮 New Dashboard Order - ${orderId}`,
          html: emailBody
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
        // Don't fail the order if email fails
      }
    }

    // Notify admin via socket
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('new_order', {
        orderId, username: user.username, product: productName, price: priceLKR, method: orderMethod
      });
    }

    res.status(201).json({
      success: true,
      order,
      orderId,
      waLink: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
        `Hello PRRX,\n\nI want to order:\nProduct: ${productName}\nCoins: ${coinsAmount}\nPrice: Rs. ${priceLKR}\nName: ${user.username}\nEmail: ${user.email}\nCountry: ${country || 'Sri Lanka'}\nOrder ID: ${orderId}\n\n${notes ? 'Notes: ' + notes : ''}`
      )}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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
