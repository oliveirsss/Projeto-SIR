const Event = require('../models/Event');
const Rsvp = require('../models/Rsvp');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createEvent = async (req, res) => {
  try {
    const data = {
      ...req.body,
      organizerId: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const event = new Event(data);
    await event.save();

    // Notificar todos os estudantes
    const students = await User.find({ type: 'student' });
    if (students.length > 0) {
      const notifications = students.map(student => ({
        recipient: student._id,
        type: 'new_event',
        message: `Novo evento publicado: ${event.title}`,
        relatedId: event._id
      }));
      const createdNotifications = await Notification.insertMany(notifications);

      // Enviar notificação em tempo real
      const io = req.app.get('io');
      if (io) {
        createdNotifications.forEach(notif => {
          io.to(notif.recipient.toString()).emit('new-notification', notif);
        });
      }
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { q, category, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    const now = new Date();

    if (status === 'past') {
      filter.date = { $lt: now };
    } else if (status === 'upcoming') {
      // Default behavior or explicit upcoming
      filter.date = { $gte: now };
    } else if (status === 'all') {
      // No date filter, return everything
    } else if (!status) {
      // If no status specified, maybe default to upcoming? 
      // User didn't specify, but for "Realizado" feature we need separation.
      // Let's default to upcoming to keep feed clean.
      filter.date = { $gte: now };
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { titleEn: { $regex: q, $options: 'i' } }
      ];
    }
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
    const event = await Event.findById(req.params.id)
      .populate("organizerId", "name email");

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    const goingCount = await Rsvp.countDocuments({
      eventId: event._id,
    });

    res.json({
      ...event.toObject(),
      goingCount,
    });
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

    const updates = { ...req.body };
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    Object.assign(ev, updates);
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
