const User = require('../models/User');
const Settings = require('../models/Settings');

const seedAdmin = async () => {
  try {
    // Create default settings if not exists
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        siteName: 'GameZone Reseller',
        siteTagline: 'Your Premium Gaming Reseller Panel'
      });
      console.log('✅ Default settings created');
    }

    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@gamingreseller.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
        coinBalance: 99999,
        walletBalance: 99999
      });
      console.log('✅ Admin user created');
      console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
      console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@gamingreseller.com'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedAdmin;
