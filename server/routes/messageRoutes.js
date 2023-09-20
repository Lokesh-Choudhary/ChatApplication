const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

const { sendMessage, allMessage } = require('../controllers/messageControllers');

router.route('/').post(protect, sendMessage);
// router.route('/:chatId').get(protect, allMessage);

module.exports = router;
