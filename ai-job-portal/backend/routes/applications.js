const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Job = require("../models/Job");

// ✅ Withdraw Application
router.delete("/:jobId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ msg: "Job not found" });

    // user ke applied array se remove
    user.applied = user.applied.filter(
      (a) => a.jobId.toString() !== job._id.toString()
    );

    // job ke applicants array se remove
    job.applicants = job.applicants.filter(
      (applicantId) => applicantId.toString() !== user._id.toString()
    );

    await user.save();
    await job.save();

    res.json({ msg: "Application withdrawn successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
