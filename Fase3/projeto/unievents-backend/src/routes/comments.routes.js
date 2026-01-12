const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.delete('/:id', authMiddleware, commentCtrl.deleteComment);

module.exports = router;
