const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    package: { type: String, required: true },
    location: { type: String, required: true },
    field: { type: String, required: true },
    jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Internship'], default: 'Full-Time' },
    tags: [{ type: String }],
    description: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
