const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CommunitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [PostSchema],
    createdAt: { type: Date, default: Date.now },
    department: { type: String },
    batch: { type: String },
    interest: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Community', CommunitySchema);
