const Comment = require("../models/Comment");

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.id })
      .populate("userId", "name photo")
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

    const populated = await comment.populate("userId", "name photo");

    //SOCKET: emitir para a room do evento
    const io = req.app.get("io");
    io.to(req.params.id).emit("new-comment", populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Allow deletion if user is the author OR if user is admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.type !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    await comment.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.to(comment.eventId.toString()).emit("delete-comment", req.params.id);
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
