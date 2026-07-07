const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// GET /api/content -> sab content list (public - website par sabko dikhega)
// Optional query: ?category=song  ya  ?type=audio
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;

    const items = await Content.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// DELETE /api/content/:id -> ek item hatao (admin key required)
router.delete('/:id', async (req, res) => {
  try {
    const key = req.header('x-admin-key');
    if (!key || key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Galat admin password.' });
    }
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Delete ho gaya.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
