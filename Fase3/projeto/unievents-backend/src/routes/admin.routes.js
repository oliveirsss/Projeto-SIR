const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.get('/users/pending', authMiddleware, requireRole(['admin']), async (req, res) => {
  const pending = await User.find({ validated: false, type: 'organizer' }).select('name email');
  res.json(pending);
});

router.patch('/users/:id/approve', authMiddleware, requireRole(['admin']), async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'Not found' });
  u.validated = true;
  await u.save();
  res.json(u);
});

module.exports = router;
