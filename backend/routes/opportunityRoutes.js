const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/opportunityController');

// Role guard (support 'alumni' or 'Alumni')
const isAlumni = (req, res, next) => {
  const role = req.user?.role;
  if (!role || !['alumni', 'Alumni'].includes(role)) {
    return res.status(403).json({ message: 'Only alumni can post or modify jobs' });
  }
  next();
};

// Public (authenticated) list and apply
router.get('/', auth, ctrl.getJobs);
router.post('/:id/apply', auth, ctrl.applyToJob);
router.get('/my-applications', auth, ctrl.getMyApplications);

// Alumni CRUD
router.post('/', auth, isAlumni, ctrl.createJob);
router.put('/:id', auth, isAlumni, ctrl.updateJob);
router.delete('/:id', auth, isAlumni, ctrl.deleteJob);

module.exports = router;
