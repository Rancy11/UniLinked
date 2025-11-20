const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    status: { type: String, enum: ['Applied', 'Reviewed', 'Selected', 'Rejected'], default: 'Applied' },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
