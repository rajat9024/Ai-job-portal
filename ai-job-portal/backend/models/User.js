const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
name: String,
email: { type: String, unique: true, required: true, lowercase: true },
password: { type: String, required: true },
role: { type: String, enum: ['jobseeker','employer'], default: 'jobseeker' },
skills: [String],
  mobile: { type: String },
  interest: { type: String },
  resume: {
  filename: String,
  url: String
  },
applied: [
{
jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
status: { type: String, enum: ['applied','interview','offered','rejected'], default: 'applied' },
appliedAt: { type: Date, default: Date.now }
}
]
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);