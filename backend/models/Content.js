const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  // 'audio' | 'video' | 'photo' | 'text' | 'package'
  type: {
    type: String,
    enum: ['audio', 'video', 'photo', 'text', 'package'],
    required: true
  },
  title: { type: String, required: true, trim: true },
  titleEnglish: { type: String, trim: true },
  description: { type: String, trim: true },
  // Which service/category this belongs to on the site
  category: {
    type: String,
    enum: [
      'music-distribution',
      'session-pack',
      'mainstage-setup',
      'song',
      'bhajan',
      'katha',
      'announcement',
      'other'
    ],
    default: 'other'
  },
  composer: { type: String, trim: true },
  publisher: { type: String, trim: true },
  // Cloudinary file URL (audio/video/photo). Empty for pure text posts.
  fileUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  // ---- Selling fields ----
  forSale: { type: Boolean, default: false },
  price: { type: Number, default: 0 }, // in INR
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
