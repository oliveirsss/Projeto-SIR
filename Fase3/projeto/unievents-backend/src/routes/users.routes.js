const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware: verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, userController.getUsers);
router.put('/:id/ban', verifyToken, userController.banUser);
router.put('/:id/type', verifyToken, userController.updateUserType);

module.exports = router;
