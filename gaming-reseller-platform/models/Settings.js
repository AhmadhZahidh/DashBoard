const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'GameZone Reseller'
  },
  siteTagline: {
    type: String,
    default: 'Your Premium Gaming Reseller Panel'
  },
  siteLogo: {
    type: String,
    default: ''
  },
  loginBackground: {
    type: String,
    default: ''
  },
  dashboardBanner: {
    type: String,
    default: ''
  },
  landingHeroBanner: {
    type: String,
    default: ''
  },
  heroVideo: {
    type: String,
    default: ''
  },
  heroVideoAutoplay: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently under maintenance. Please check back later.'
  },
  registrationEnabled: {
    type: Boolean,
    default: true
  },
  emailVerificationRequired: {
    type: Boolean,
    default: false
  },
  coinRate: {
    type: Number,
    default: 1 // 1 coin = $1
  },
  minTopUp: {
    type: Number,
    default: 10
  },
  maxTopUp: {
    type: Number,
    default: 10000
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    discord: { type: String, default: '' },
    youtube: { type: String, default: '' },
    telegram: { type: String, default: '' }
  },
  contactEmail: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: '#7c3aed'
  },
  accentColor: {
    type: String,
    default: '#10b981'
  },
  paymentMethods: {
    manual: { type: Boolean, default: true },
    paypal: { type: Boolean, default: false },
    stripe: { type: Boolean, default: false }
  },
  paymentInstructions: {
    type: String,
    default: 'Send payment to our account and submit proof.'
  },
  features: {
    chat: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    coupons: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
