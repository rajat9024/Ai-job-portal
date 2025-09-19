const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require('../middleware/auth');

// register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, skills, mobile, interest } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email & password required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hash,
      role,
      skills,
      mobile,
      interest
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        mobile: user.mobile,
        interest: user.interest,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid creds" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid creds" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// routes/auth.js
router.get('/profile', auth, async (req,res)=>{
  try {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) return res.status(404).json({msg:'User not found'});
    res.json(user);
  } catch(err){
    console.error(err);
    res.status(500).json({msg:'Server error'});
  }
});

const multer = require('multer');
const path = require('path');

// storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function(req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload resume
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.resume = {
      filename: req.file.filename,
      url: `/uploads/resumes/${req.file.filename}`
    };
    await user.save();
    res.json({ msg: 'Resume uploaded', resume: user.resume });
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// profile update
router.put('/profile/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, skills },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
