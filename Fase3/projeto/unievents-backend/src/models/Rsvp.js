const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      default: "saved",
    },
  },
  { timestamps: true }
);

// evitar duplicados
rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Rsvp", rsvpSchema);
