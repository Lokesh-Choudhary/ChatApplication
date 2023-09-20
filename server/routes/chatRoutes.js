const express = require('express');
const { protect} = require('../middlewares/authMiddleware');
const router = express.Router();

// Import your controller functions
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');

// Define your routes
router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupremove').post(protect, removeFromGroup);
router.route('/').put(protect, addToGroup);

module.exports = router;

