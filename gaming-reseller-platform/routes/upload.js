const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const subDirs = ['products', 'avatars', 'banners', 'backgrounds', 'videos'];
subDirs.forEach(dir => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type || 'products';
    const validTypes = ['products', 'avatars', 'banners', 'backgrounds'];
    const uploadType = validTypes.includes(type) ? type : 'products';
    cb(null, path.join(uploadsDir, uploadType));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  const allowedVideos = /mp4|webm|ogg|mov/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isImage = allowedImages.test(ext) && allowedImages.test(file.mimetype);
  const isVideo = allowedVideos.test(ext) || file.mimetype.startsWith('video/');
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
  fileFilter
});

// @POST /api/upload/:type - Upload image
router.post('/:type', protect, adminOnly, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.params.type}/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/upload/avatar - Upload user avatar
router.post('/avatar/me', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/upload/multiple - Upload multiple images
router.post('/multiple/:type', protect, adminOnly, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const urls = req.files.map(file => `/uploads/${req.params.type}/${file.filename}`);
    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
