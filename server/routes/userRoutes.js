const express = require('express');
const router = express.Router();
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Register a new user
router.post('/', registerUser);

// Get all users
router.get('/', protect, allUsers);

// Authenticate a user (login)
router.post('/login', authUser);

module.exports = router;
