const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Content = require('../models/Content');

// Cloudinary storage - auto-detects resource type (image/video/audio treated as video by cloudinary)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sundari-creation',
    resource_type: 'auto'
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB max per file
});

// Simple admin-key check middleware - protects the upload route
function checkAdminKey(req, res, next) {
  const key = req.header('x-admin-key');
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Galat ya missing admin password. Upload allowed nahi hai.' });
  }
  next();
}

// POST /api/upload  -> upload audio/video/photo (file) OR text-only post
router.post('/', checkAdminKey, upload.single('file'), async (req, res) => {
  try {
    const { type, title, titleEnglish, description, category, composer, publisher } = req.body;

    if (!type || !title) {
      return res.status(400).json({ error: 'Type aur title zaroori hai.' });
    }

    if (type !== 'text' && !req.file) {
      return res.status(400).json({ error: 'Is type ke liye file upload zaroori hai.' });
    }

    const content = new Content({
      type,
      title,
      titleEnglish,
      description,
      category: category || 'other',
      composer,
      publisher,
      fileUrl: req.file ? req.file.path : '',
      thumbnailUrl: req.file && req.file.path ? req.file.path : ''
    });

    await content.save();
    res.status(201).json({ message: 'Upload safal! Successfully uploaded.', content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
