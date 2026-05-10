const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/settings - Get public settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    // Return only public fields for non-admin
    const publicSettings = {
      siteName: settings.siteName,
      siteTagline: settings.siteTagline,
      siteLogo: settings.siteLogo,
      loginBackground: settings.loginBackground,
      dashboardBanner: settings.dashboardBanner,
      landingHeroBanner: settings.landingHeroBanner,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      registrationEnabled: settings.registrationEnabled,
      socialLinks: settings.socialLinks,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      features: settings.features,
      coinRate: settings.coinRate
    };

    res.json({ success: true, settings: publicSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/settings/admin - Get all settings (admin)
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/settings - Admin update settings
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('settings_updated', {
        maintenanceMode: settings.maintenanceMode,
        siteName: settings.siteName
      });
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
