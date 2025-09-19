require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profile'); // 👈 profile route import

const app = express();
app.use(cors());
app.use(express.json());

// static folder serve (resume access ke liye)
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes); // 👈 add profile routes
app.use("/api/applications", require("./routes/applications"));
app.use("/api/jobs", jobRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/profile', require('./routes/profile'));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{
    console.log('MongoDB connected');
    app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
  })
  .catch(err=>console.error('Mongo connect error:', err));
