const Job = require('../models/Job');
const Application = require('../models/Application');

// List jobs with filters
exports.getJobs = async (req, res) => {
  try {
    const { search, location, jobType, field, minPackage } = req.query;
    const filter = {};
    if (location) filter.location = new RegExp(location, 'i');
    if (jobType) filter.jobType = jobType;
    if (field) filter.field = new RegExp(field, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let jobs = await Job.find(filter).populate('postedBy', 'name role').sort({ createdAt: -1 });

    // Helper to parse a package string into a comparable number (in thousands base)
    const toNumber = (pkg) => {
      if (!pkg || typeof pkg !== 'string') return 0;
      const s = pkg.trim();
      // ranges like '6-10 LPA' -> take the upper bound
      const rangeMatch = s.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/i);
      let num = 0;
      if (rangeMatch) {
        num = parseFloat(rangeMatch[2]);
      } else {
        const one = s.match(/(\d+(?:\.\d+)?)/);
        if (one) num = parseFloat(one[1]);
      }
      // Normalize by unit keywords
      if (/lpa/i.test(s)) {
        // treat LPA as numeric in LPA units -> convert to thousands (approx): 1 LPA ~ 1000 (thousand/month?)
        // We'll keep it as LPA scale and compare against minPackage assuming same scale.
        return num; 
      }
      if (/k/i.test(s)) {
        return num; // treat '80k' as 80 (thousand)
      }
      if (/\$?\s*\d+\s*(?:per\s*year|yr|year)/i.test(s)) {
        return num / 1000;
      }
      return num;
    };

    if (minPackage) {
      const min = parseFloat(minPackage);
      if (!isNaN(min)) {
        jobs = jobs.filter((j) => toNumber(j.package) >= min);
      }
    }

    res.json(jobs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create job (alumni only checked in route)
exports.createJob = async (req, res) => {
  try {
    const { title, company, package: pkg, location, field, jobType = 'Full-Time', tags = [], description } = req.body;
    if (!title || !company || !pkg || !location || !field || !jobType || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const job = new Job({ title, company, package: pkg, location, field, jobType, tags, description, postedBy: req.user.id });
    await job.save();
    await job.populate('postedBy', 'name role');
    res.status(201).json(job);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update job (owner only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.postedBy) !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { title, company, package: pkg, location, field, jobType, tags, description } = req.body;
    if (title !== undefined) job.title = title;
    if (company !== undefined) job.company = company;
    if (pkg !== undefined) job.package = pkg;
    if (location !== undefined) job.location = location;
    if (field !== undefined) job.field = field;
    if (jobType !== undefined) job.jobType = jobType;
    if (tags !== undefined) job.tags = tags;
    if (description !== undefined) job.description = description;

    await job.save();
    await job.populate('postedBy', 'name role');
    res.json(job);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete job (owner only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.postedBy) !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply to job
exports.applyToJob = async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    if (!resumeUrl) return res.status(400).json({ message: 'resumeUrl is required' });
    const jobId = req.params.id;

    const existing = await Application.findOne({ jobId, userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const app = new Application({ jobId, userId: req.user.id, resumeUrl, status: 'Applied' });
    await app.save();
    res.status(201).json(app);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// My applications
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).sort({ appliedAt: -1 }).lean();
    res.json(apps);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
