const express = require("express");
const router = express.Router();
const rsvpCtrl = require("../controllers/rsvp.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/me", authMiddleware, rsvpCtrl.getMyRsvps);
router.post("/", authMiddleware, rsvpCtrl.createRsvp);
router.delete("/:eventId", authMiddleware, rsvpCtrl.deleteRsvp);

module.exports = router;
