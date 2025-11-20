const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/communityController');

// create community
router.post('/create', auth, ctrl.create);
// get all communities
router.get('/', auth, ctrl.getAll);
// get one community with posts
router.get('/:id', auth, ctrl.getOne);
// join/leave
router.put('/join/:id', auth, ctrl.toggleMembership);
// add post
router.post('/:id/post', auth, ctrl.addPost);

module.exports = router;
