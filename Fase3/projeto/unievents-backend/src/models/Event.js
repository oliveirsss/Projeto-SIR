const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, default: 'Other' },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: '' },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
