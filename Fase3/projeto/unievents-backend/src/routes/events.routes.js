const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/event.controller');
const rsvpCtrl = require('../controllers/rsvp.controller');
const commentCtrl = require('../controllers/comment.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require("../middleware/upload.middleware");


router.put('/:id', authMiddleware, eventCtrl.updateEvent);
router.delete('/:id', authMiddleware, eventCtrl.deleteEvent);

router.get('/:id/comments', commentCtrl.getComments);
router.post('/:id/comments', authMiddleware, commentCtrl.createComment);


router.post(
  "/",
  authMiddleware,
  requireRole(["organizer", "admin"]),
  upload.single("image"), // 🔥 ESTA LINHA É O QUE FALTAVA
  eventCtrl.createEvent
);

router.get("/", eventCtrl.getEvents);
router.get("/:id", eventCtrl.getEvent);

module.exports = router;