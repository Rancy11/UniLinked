const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema(
  {
    eventId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    registrationData: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      university: { type: String, required: true },
      year: { type: String, default: '' },
      department: { type: String, default: '' },
      expectations: { type: String, default: '' }
    },
    registeredAt: { 
      type: Date, 
      default: Date.now 
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations
EventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

// Index for better query performance
EventRegistrationSchema.index({ eventId: 1, registeredAt: -1 });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);
