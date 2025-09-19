const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // 👈 jwt auth

// Resume storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get logged-in user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log("req.user:", req.user); // debug
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Profile /me error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload resume
router.post('/upload-resume', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.resume = `/uploads/resumes/${req.file.filename}`;
    await user.save();
    res.json({ msg: 'Resume uploaded', resume: user.resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
