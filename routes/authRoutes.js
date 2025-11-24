const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', auth.register);
router.post('/login', auth.login);

// Protected routes
router.get('/me', authMiddleware, auth.me);
router.post('/logout', authMiddleware, auth.logout);

module.exports = router;
