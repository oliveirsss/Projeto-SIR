const Rsvp = require("../models/Rsvp");

// GET /api/rsvps/me
exports.getMyRsvps = async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ userId: req.user._id }).select("eventId");
    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rsvps
exports.createRsvp = async (req, res) => {
  try {
    const { eventId } = req.body;

    const rsvp = await Rsvp.create({
      userId: req.user._id,
      eventId,
    });

    res.status(201).json(rsvp);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Evento já guardado" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/rsvps/:eventId
exports.deleteRsvp = async (req, res) => {
  try {
    await Rsvp.findOneAndDelete({
      userId: req.user._id,
      eventId: req.params.eventId,
    });

    res.json({ message: "RSVP removido" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
