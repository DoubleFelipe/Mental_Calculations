'use strict';
/**
 * Mental Calculations — Ranking Routes
 */
const express = require('express');
const { globalRanking, levelRanking } = require('../controllers/rankingController');

const router = express.Router();

// GET /api/ranking/global
router.get('/global', globalRanking);

// GET /api/ranking/level/:levelId
router.get('/level/:levelId', levelRanking);

module.exports = router;
