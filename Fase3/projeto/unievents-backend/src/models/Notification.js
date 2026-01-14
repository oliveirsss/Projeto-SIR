const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['new_event', 'system'], default: 'new_event' },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // pode ser nulo se for sistema
    read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
