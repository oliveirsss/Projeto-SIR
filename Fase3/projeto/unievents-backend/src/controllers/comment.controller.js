const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const comment = new Comment({ eventId, userId: req.user._id, text: req.body.text });
    await comment.save();

    const populated = await Comment.findById(comment._id).populate('userId', 'name photo');

    req.app.get('io')?.to(`event_${eventId}`).emit('new-comment', populated);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const comments = await Comment.find({ eventId }).sort({ createdAt: 1 }).populate('userId', 'name photo');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
