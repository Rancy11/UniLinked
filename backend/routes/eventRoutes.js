const express = require('express');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { auth, permit } = require('../middleware/auth');
const router = express.Router();

// Create Event (Admin/Teacher/Alumni only)
router.post('/', auth, permit('admin', 'teacher', 'alumni'), async (req, res) => {
  try {
    const { title, description, dateTime, venue, organizer, type, department, imageUrl, isOnline, onlineLink, maxRegistrants } = req.body;
    
    // Validation
    if (!title || !dateTime) {
      return res.status(400).json({ message: 'Title and date/time are required' });
    }

    // Auto-fill organizer if not provided
    const eventOrganizer = organizer || req.user.name || 'Admin';

    const doc = await Event.create({ 
      title, 
      description, 
      dateTime, 
      venue: isOnline ? 'Online' : venue,
      organizer: eventOrganizer, 
      type, 
      department, 
      imageUrl,
      isOnline,
      onlineLink: isOnline ? onlineLink : '',
      maxRegistrants,
      createdBy: req.user.id
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully!', 
      event: doc 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List with filters/search
router.get('/', async (req, res) => {
  try {
    const { type, department, q } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (department) filter.department = department;
    if (q) filter.title = { $regex: q, $options: 'i' };
    const items = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ dateTime: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment likes
router.post('/:id/like', async (req, res) => {
  try {
    const upd = await Event.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json(upd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Register for Event (Students/Alumni)
router.post('/:id/register', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const { name, email, phone, university, year, department, expectations } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered using EventRegistration model
    const existingRegistration = await EventRegistration.findOne({ eventId, studentId: userId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check max capacity
    if (event.maxRegistrants && event.registrants >= event.maxRegistrants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if event is still upcoming
    if (new Date() > event.dateTime) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }

    // Create registration record
    const registration = await EventRegistration.create({
      eventId,
      studentId: userId,
      registrationData: {
        name,
        email,
        phone,
        university,
        year,
        department,
        expectations
      }
    });

    // Get exact count from database after registration
    const exactCount = await EventRegistration.countDocuments({ eventId });
    
    // Update event with exact count
    const upd = await Event.findByIdAndUpdate(
      eventId, 
      { 
        registrants: exactCount,
        $push: { registeredUsers: userId }
      }, 
      { new: true }
    );

    res.json({ 
      success: true, 
      message: `Successfully registered for ${event.title}!`, 
      event: upd,
      registration: registration
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(400).json({ message: err.message });
  }
});

// Get Registered Students for Event (Admin/Teacher/Event Creator Alumni only)
router.get('/:id/registrations', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check permissions: Admin, Teacher, or Alumni who created the event
    if (
      userRole !== "admin" &&
      userRole !== "teacher" &&
      !(userRole === "alumni" && event.createdBy.toString() === userId)
    ) {
      return res.status(403).json({ message: "Unauthorized: You can only view registrations for events you created" });
    }

    const registrations = await EventRegistration.find({ eventId })
      .populate('studentId', 'name email role university')
      .sort({ registeredAt: -1 });

    const formattedRegistrations = registrations.map(reg => ({
      _id: reg._id,
      student: {
        name: reg.studentId?.name || reg.registrationData.name,
        email: reg.studentId?.email || reg.registrationData.email,
        role: reg.studentId?.role || 'student',
        university: reg.studentId?.university || reg.registrationData.university,
        year: reg.registrationData.year,
        department: reg.registrationData.department
      },
      registrationData: reg.registrationData,
      registeredAt: reg.registeredAt,
      status: reg.status
    }));

    res.json({
      success: true,
      event: {
        title: event.title,
        dateTime: event.dateTime,
        venue: event.venue,
        createdBy: event.createdBy
      },
      registrations: formattedRegistrations,
      totalRegistrations: formattedRegistrations.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get exact registration count from database
router.get('/:id/count', async (req, res) => {
  try {
    const eventId = req.params.id;
    const count = await EventRegistration.countDocuments({ eventId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Event Participants (Simplified format for frontend display)
router.get('/:id/participants', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check permissions: Admin, Teacher, or Alumni who created the event
    if (
      userRole !== "admin" &&
      userRole !== "teacher" &&
      !(userRole === "alumni" && event.createdBy.toString() === userId)
    ) {
      return res.status(403).json({ message: "Unauthorized: You can only view participants for events you created" });
    }

    const registrations = await EventRegistration.find({ eventId })
      .populate('studentId', 'name email university')
      .sort({ registeredAt: -1 });

    // Format participants according to your requirements
    const participants = registrations.map(reg => ({
      fullName: reg.registrationData.name,
      email: reg.registrationData.email,
      phone: reg.registrationData.phone,
      university: reg.registrationData.university,
      year: reg.registrationData.year,
      department: reg.registrationData.department,
      registeredAt: reg.registeredAt,
      status: reg.status
    }));

    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Event (Admin/Teacher/Alumni only)
router.put('/:id', auth, permit('admin', 'teacher', 'alumni'), async (req, res) => {
  try {
    const { title, description, dateTime, venue, organizer, type, department, imageUrl, isOnline, onlineLink, maxRegistrants } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the creator or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit events you created' });
    }

    const upd = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        dateTime, 
        venue: isOnline ? 'Online' : venue, 
        organizer, 
        type, 
        department, 
        imageUrl,
        isOnline,
        onlineLink: isOnline ? onlineLink : '',
        maxRegistrants
      },
      { new: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Event updated successfully!', 
      event: upd 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Event (Admin/Teacher/Alumni only)
router.delete('/:id', auth, permit('admin', 'teacher', 'alumni'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the creator or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete events you created' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: 'Event deleted successfully!' 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Past events
router.get('/past/all', async (_req, res) => {
  try {
    const now = new Date();
    const items = await Event.find({ dateTime: { $lt: now } }).sort({ dateTime: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear past events
router.delete('/past/clear', async (_req, res) => {
  try {
    const now = new Date();
    const result = await Event.deleteMany({ dateTime: { $lt: now } });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed sample
router.post('/seed', async (_req, res) => {
  try {
    const count = await Event.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded' });
    const docs = await Event.insertMany([
      {
        title: 'Alumni Reunion 2025',
        description: 'Gathering of alumni with networking and awards.',
        dateTime: new Date('2025-12-15T17:00:00'),
        venue: 'Chitkara University Auditorium',
        organizer: 'Alumni Cell',
        type: 'Reunion',
        department: 'CSE',
        imageUrl: ''
      },
      {
        title: 'Tech Webinar on AI',
        description: 'Online webinar covering latest advances in AI.',
        dateTime: new Date('2025-11-20T19:00:00'),
        venue: 'Online',
        organizer: 'Dept. of CSE',
        type: 'Webinar',
        department: 'CSE',
        imageUrl: ''
      },
      {
        title: 'Placement Drive by Infosys',
        description: 'Campus placement drive including written and interview rounds.',
        dateTime: new Date('2026-01-05T10:00:00'),
        venue: 'Main Campus',
        organizer: 'T&P Cell',
        type: 'Placement',
        department: 'ECE',
        imageUrl: ''
      }
    ]);
    res.json({ inserted: docs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
