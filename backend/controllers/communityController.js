const Community = require('../models/Community');

// Create a community
exports.create = async (req, res) => {
  try {
    const { name, description, department, batch, interest } = req.body;
    if (!name || !description) return res.status(400).json({ message: 'Name and description are required' });
    const community = new Community({ name, description, department, batch, interest, createdBy: req.user.id, members: [req.user.id] });
    await community.save();
    await community.populate('createdBy', 'name role');
    res.status(201).json(community);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all communities with optional filters
exports.getAll = async (req, res) => {
  try {
    const { search, department, batch, interest } = req.query;
    const filter = {};
    if (department) filter.department = new RegExp(department, 'i');
    if (batch) filter.batch = new RegExp(batch, 'i');
    if (interest) filter.interest = new RegExp(interest, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    const communities = await Community.find(filter).sort({ createdAt: -1 });
    res.json(communities.map(c => ({
      _id: c._id,
      name: c.name,
      description: c.description,
      memberCount: (c.members || []).length,
      department: c.department,
      batch: c.batch,
      interest: c.interest,
      createdAt: c.createdAt,
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get one community with posts
exports.getOne = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('posts.user', 'name');
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.json(community);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Join or leave community
exports.toggleMembership = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    const uid = req.user.id;
    const index = community.members.findIndex(m => String(m) === String(uid));
    if (index >= 0) {
      community.members.splice(index, 1);
    } else {
      community.members.push(uid);
    }
    await community.save();
    res.json({ joined: index < 0, memberCount: community.members.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a post
exports.addPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    const isMember = community.members.some(m => String(m) === String(req.user.id));
    if (!isMember) return res.status(403).json({ message: 'Join the community to post' });
    community.posts.push({ user: req.user.id, content, date: new Date() });
    await community.save();
    await community.populate('posts.user', 'name');
    res.status(201).json(community.posts[community.posts.length - 1]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
