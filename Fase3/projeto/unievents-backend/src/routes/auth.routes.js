const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.put('/update', authMiddleware, upload.single('image'), authCtrl.updateProfile);

module.exports = router;
