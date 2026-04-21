const express = require('express');
const Achievement = require('../models/Achievement');
const router = express.Router();

// Create achievement
router.post('/', async (req, res) => {
  try {
    const { name, department, year, title, description, imageUrl, type } = req.body;
    const doc = await Achievement.create({ name, department, year, title, description, imageUrl, type });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List achievements with filters and search
router.get('/', async (req, res) => {
  try {
    const { department, year, type, q } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (type) filter.type = type;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const items = await Achievement.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Top liked (Hall of Fame)
router.get('/top', async (_req, res) => {
  try {
    const items = await Achievement.find({}).sort({ likes: -1, createdAt: -1 }).limit(3);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like (toggle)
router.post('/:id/like', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; // optional client hint
    const ach = await Achievement.findById(req.params.id);
    if (!ach) return res.status(404).json({ message: 'Not found' });

    const likedBy = ach.likedBy || [];
    if (userId) {
      const idx = likedBy.findIndex(id => id.toString() === userId.toString());
      if (idx > -1) {
        likedBy.splice(idx, 1);
      } else {
        likedBy.push(userId);
      }
      ach.likedBy = likedBy;
      ach.likes = likedBy.length;
    } else {
      ach.likes = (ach.likes || 0) + 1;
    }
    await ach.save();
    res.json(ach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Congratulate (toggle)
router.post('/:id/congrats', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const ach = await Achievement.findById(req.params.id);
    if (!ach) return res.status(404).json({ message: 'Not found' });

    const congratsBy = ach.congratsBy || [];
    if (userId) {
      const idx = congratsBy.findIndex(id => id.toString() === userId.toString());
      if (idx > -1) {
        congratsBy.splice(idx, 1);
      } else {
        congratsBy.push(userId);
      }
      ach.congratsBy = congratsBy;
      ach.congrats = congratsBy.length;
    } else {
      ach.congrats = (ach.congrats || 0) + 1;
    }
    await ach.save();
    res.json(ach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update achievement
router.put('/:id', async (req, res) => {
  try {
    const { name, department, year, title, description, imageUrl, type } = req.body;
    const updated = await Achievement.findByIdAndUpdate(
      req.params.id,
      { name, department, year, title, description, imageUrl, type },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete achievement
router.delete('/:id', async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Seed sample data
router.post('/seed', async (_req, res) => {
  try {
    const count = await Achievement.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Already seeded' });
    }
    const docs = await Achievement.insertMany([
      {
        name: 'Riya Sharma',
        department: 'CSE',
        year: 2023,
        title: 'Placed at Amazon',
        description: 'Offer from Amazon SDE-1',
        imageUrl: '',
        type: 'Placement'
      },
      {
        name: 'Arjun Mehta',
        department: 'ECE',
        year: 2021,
        title: 'Started AI Startup',
        description: 'Launched an AI product in healthcare',
        imageUrl: '',
        type: 'Startup'
      },
      {
        name: 'Priya Verma',
        department: 'IT',
        year: 2022,
        title: 'Won Hackathon at IIT Delhi',
        description: 'Team won first prize at national hackathon',
        imageUrl: '',
        type: 'Hackathon'
      }
    ]);
    res.json({ inserted: docs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;