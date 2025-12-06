const Event = require('../models/Event');
const Rsvp = require('../models/Rsvp');

exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body, organizerId: req.user._id };
    const event = new Event(data);
    await event.save();

    // opcional: notificar via socket (emit global) — o socket file tratará
    req.app.get('io')?.emit('new-event', { event });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('organizerId', 'name email');

    // incluir contagens RSVPs (exemplo simples)
    const eventsWithCounts = await Promise.all(events.map(async (ev) => {
      const count = await Rsvp.countDocuments({ eventId: ev._id, status: 'going' });
      return { ...ev.toObject(), goingCount: count };
    }));

    res.json(eventsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const goingCount = await Rsvp.countDocuments({ eventId: event._id, status: 'going' });
    res.json({ ...event.toObject(), goingCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    // apenas organizador ou admin pode atualizar
    if (ev.organizerId.toString() !== req.user._id.toString() && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    Object.assign(ev, req.body);
    await ev.save();
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.organizerId.toString() !== req.user._id.toString() && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await ev.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
