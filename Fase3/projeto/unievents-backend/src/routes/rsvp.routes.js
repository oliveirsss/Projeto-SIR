const Rsvp = require("../models/Rsvp");

router.get("/me", auth, async (req, res) => {
  const rsvps = await Rsvp.find({ 
    userId: req.user._id,
    status: { $in: ["going", "interested"] }
  });

  res.json(rsvps);
});
