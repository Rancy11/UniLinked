const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    type: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    congrats: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    congratsBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', AchievementSchema);