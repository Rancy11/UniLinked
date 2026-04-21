const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dateTime: { type: Date, required: true },
    venue: { type: String, default: '' },
    organizer: { type: String, default: '' },
    type: { 
      type: String, 
      enum: ['Workshop', 'Webinar', 'Competition', 'Fest', 'Reunion', 'Placement', 'Seminar', 'Other'], 
      default: 'Other' 
    },
    department: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    registrants: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    registeredUsers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    isOnline: { type: Boolean, default: false },
    onlineLink: { type: String, default: '' },
    maxRegistrants: { type: Number, default: null },
    status: { 
      type: String, 
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
      default: 'upcoming' 
    }
  },
  { timestamps: true }
);

// Index for better query performance
EventSchema.index({ dateTime: 1, type: 1, createdBy: 1 });

module.exports = mongoose.model('Event', EventSchema);