require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const uploadRoutes = require('./routes/upload');
const contentRoutes = require('./routes/content');

const app = express();

// ---- CORS: sirf apni frontend site se requests allow karo ----
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:5500'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: is origin ki permission nahi hai'));
    }
  }
}));

app.use(express.json());

// ---- Rate limiting: upload spam se bachne ke liye ----
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50
});
app.use('/api/upload', uploadLimiter);

// ---- Routes ----
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Sundari Creation API chal raha hai ✅' });
});

// ---- MongoDB connect ----
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection error ❌', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chal raha hai port ${PORT} par`));
