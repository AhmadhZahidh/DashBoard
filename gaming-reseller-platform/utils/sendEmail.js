const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Gaming Reseller <noreply@gamingreseller.com>',
    to,
    subject,
    html: html || `<p>${text}</p>`,
    text
  };

  await transporter.sendMail(mailOptions);
};

const emailTemplates = {
  verification: (username, token, baseUrl) => ({
    subject: '🎮 Verify Your Email - Gaming Reseller',
    html: `
      <div style="background:#0a0a0f;color:#fff;font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;border-radius:12px;border:1px solid #7c3aed;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#7c3aed;font-size:28px;">🎮 Gaming Reseller</h1>
          <p style="color:#10b981;font-size:14px;">RESELLER PANEL</p>
        </div>
        <h2 style="color:#fff;">Welcome, ${username}!</h2>
        <p style="color:#aaa;">Please verify your email address to activate your account.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${baseUrl}/verify-email/${token}" style="background:linear-gradient(135deg,#7c3aed,#10b981);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
            ✅ Verify Email
          </a>
        </div>
        <p style="color:#666;font-size:12px;">This link expires in 24 hours. If you didn't register, ignore this email.</p>
      </div>
    `
  }),

  resetPassword: (username, token, baseUrl) => ({
    subject: '🔐 Reset Your Password - Gaming Reseller',
    html: `
      <div style="background:#0a0a0f;color:#fff;font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;border-radius:12px;border:1px solid #7c3aed;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#7c3aed;font-size:28px;">🎮 Gaming Reseller</h1>
        </div>
        <h2 style="color:#fff;">Password Reset Request</h2>
        <p style="color:#aaa;">Hi ${username}, click below to reset your password.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${baseUrl}/reset-password/${token}" style="background:linear-gradient(135deg,#7c3aed,#10b981);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
            🔐 Reset Password
          </a>
        </div>
        <p style="color:#666;font-size:12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };
