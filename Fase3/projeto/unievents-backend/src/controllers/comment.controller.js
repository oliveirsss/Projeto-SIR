const Comment = require("../models/Comment");

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      eventId: req.params.id,
      userId: req.user._id,
    });

    const populated = await comment.populate("userId", "name");

    //SOCKET: emitir para a room do evento
    const io = req.app.get("io");
    io.to(req.params.id).emit("new-comment", populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
