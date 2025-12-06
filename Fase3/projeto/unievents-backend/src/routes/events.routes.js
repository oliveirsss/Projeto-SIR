const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/event.controller');
const rsvpCtrl = require('../controllers/rsvp.controller');
const commentCtrl = require('../controllers/comment.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.get('/', eventCtrl.getEvents);
router.get('/:id', eventCtrl.getEvent);

router.post('/', authMiddleware, requireRole(['organizer','admin']), eventCtrl.createEvent);
router.put('/:id', authMiddleware, eventCtrl.updateEvent);
router.delete('/:id', authMiddleware, eventCtrl.deleteEvent);

router.post('/:id/rsvp', authMiddleware, rsvpCtrl.toggleRsvp);
router.get('/:id/rsvp', authMiddleware, rsvpCtrl.getRsvps);

router.get('/:id/comments', commentCtrl.getComments);
router.post('/:id/comments', authMiddleware, commentCtrl.createComment);

module.exports = router;
