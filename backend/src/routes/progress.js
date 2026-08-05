'use strict';

const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getProgress, startLevelAttempt, updateLevelProgress } = require('../controllers/progressController');

const router = express.Router();
router.use(authMiddleware);
router.get('/', getProgress);
router.post('/level/start', startLevelAttempt);
router.post('/level', updateLevelProgress);

module.exports = router;
