const router      = require('express').Router();
const ActivityLog = require('../models/ActivityLog');
const { auth, adminOnly } = require('../middleware/auth');

// GET all logs — admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;