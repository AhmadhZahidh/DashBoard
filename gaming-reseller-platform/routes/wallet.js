const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/wallet/balance
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('coinBalance walletBalance');
    res.json({ success: true, coinBalance: user.coinBalance, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/wallet/transactions
router.get('/transactions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .populate('user', 'username email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({ success: true, transactions, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/wallet/topup - Admin add coins to user
router.post('/topup', protect, adminOnly, async (req, res) => {
  try {
    const { userId, amount, currency = 'coins', description } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const balanceBefore = currency === 'coins' ? user.coinBalance : user.walletBalance;

    if (currency === 'coins') {
      user.coinBalance += amount;
    } else {
      user.walletBalance += amount;
    }
    await user.save();

    await Transaction.create({
      user: userId,
      type: 'credit',
      currency,
      amount,
      balanceBefore,
      balanceAfter: currency === 'coins' ? user.coinBalance : user.walletBalance,
      description: description || `Admin top-up: ${amount} ${currency}`,
      processedBy: req.user._id
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${userId}`).emit('balance_updated', {
        coinBalance: user.coinBalance,
        walletBalance: user.walletBalance,
        message: `${amount} ${currency} added to your account!`
      });
    }

    res.json({ success: true, message: `${amount} ${currency} added successfully`, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/wallet/deduct - Admin deduct coins from user
router.post('/deduct', protect, adminOnly, async (req, res) => {
  try {
    const { userId, amount, currency = 'coins', description } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (currency === 'coins' && user.coinBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient coin balance' });
    }

    const balanceBefore = currency === 'coins' ? user.coinBalance : user.walletBalance;

    if (currency === 'coins') {
      user.coinBalance -= amount;
    } else {
      user.walletBalance -= amount;
    }
    await user.save();

    await Transaction.create({
      user: userId,
      type: 'debit',
      currency,
      amount,
      balanceBefore,
      balanceAfter: currency === 'coins' ? user.coinBalance : user.walletBalance,
      description: description || `Admin deduction: ${amount} ${currency}`,
      processedBy: req.user._id
    });

    res.json({ success: true, message: `${amount} ${currency} deducted`, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
