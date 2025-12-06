const Rsvp = require('../models/Rsvp');

exports.toggleRsvp = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user._id;
    const { status = 'going' } = req.body;

    const existing = await Rsvp.findOne({ eventId, userId });
    if (existing) {
      existing.status = status;
      await existing.save();
      req.app.get('io')?.to(`event_${eventId}`).emit('rsvp-updated', { eventId, userId, status });
      return res.json(existing);
    }

    const rsvp = new Rsvp({ eventId, userId, status });
    await rsvp.save();
    req.app.get('io')?.to(`event_${eventId}`).emit('rsvp-updated', { eventId, userId, status });
    res.status(201).json(rsvp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRsvps = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const list = await Rsvp.find({ eventId }).populate('userId', 'name photo');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
