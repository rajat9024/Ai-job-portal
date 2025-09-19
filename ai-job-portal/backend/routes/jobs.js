const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const matcher = require('../ml/matcher');

// Create job (employer)
router.post('/', auth, async (req,res)=>{
  try {
    if(req.user.role !== 'employer') return res.status(403).json({msg:'Only employers'});
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.json(job);
  } catch(err) {
    console.error(err);
    res.status(500).json({msg:'Server error'});
  }
});

// List + search jobs
router.get('/', async (req,res)=>{
  try {
    const { q, skill } = req.query;
    const filter = {};
    if(q) filter.title = { $regex: q, $options: 'i' };
    if(skill) filter.skills = { $in: [skill] };

    const jobs = await Job.find(filter)
      .sort({ postedAt: -1 })
      .populate("postedBy", "name email")
      .populate("applicants", "name email");  

    res.json(jobs);
  } catch(err){
    console.error(err);
    res.status(500).json({msg:'Server error'});
  }
});

// Recommend jobs (AI)
router.get('/recommend', auth, async (req,res)=>{
  try {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({msg:'User not found'});
    const jobs = await Job.find({});
    const scored = matcher.rankJobsForUser(user, jobs);
    res.json(scored);
  } catch(err){
    console.error(err);
    res.status(500).json({msg:'Server error'});
  }
});

// Get applied jobs for logged-in user
router.get('/applied', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'applied.jobId',
        select: 'title company location description postedBy',
        populate: { path: 'postedBy', select: 'name email' },
      });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.applied);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Apply to job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const alreadyApplied = user.applied.some(
      (a) => a.jobId.toString() === job._id.toString()
    );
    if (alreadyApplied) return res.status(400).json({ msg: 'Already applied' });

    user.applied.push({ jobId: job._id, status: 'applied', appliedAt: new Date() });
    if (!job.applicants.includes(user._id)) job.applicants.push(user._id);

    await user.save();
    await job.save();

    const populatedJob = await Job.findById(job._id).populate("postedBy", "name email");

    res.json({ msg: 'Applied successfully', job: populatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Withdraw application
router.delete('/:id', auth, async (req,res)=>{
  try{
    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({msg:'Job not found'});

    user.applied = user.applied.filter(a => a.jobId.toString() !== job._id.toString());
    job.applicants = job.applicants.filter(a => a.toString() !== user._id.toString());

    await user.save();
    await job.save();
    res.json({msg:'Application withdrawn'});
  } catch(err){
    console.error(err);
    res.status(500).json({msg:'Server error'});
  }
});

// Delete job (employer only)
router.delete('/:id/job', auth, async (req,res)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({msg: 'Job not found'});
    if(job.postedBy.toString() !== req.user.id) return res.status(403).json({msg:'Only poster can delete this job'});
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job deleted' });
  } catch(err){
    console.error(err);
    res.status(500).json({msg:'Server error'});
  }
});

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
