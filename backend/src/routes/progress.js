'use strict';
/**
 * Mental Calculations — Progress Routes
 */
const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getProgress,
  updateLevelProgress,
  updateGlobalState,
  unlockLevel,
  unlockWorld,
} = require('../controllers/progressController');

const router = express.Router();

// Todas as rotas de progresso exigem autenticação
router.use(authMiddleware);

// GET  /api/progress         — Progresso completo
router.get('/', getProgress);

// POST /api/progress/level   — Registrar sessão de fase
router.post('/level', updateLevelProgress);

// PUT  /api/progress/state   — Atualizar estatísticas globais
router.put('/state', updateGlobalState);

// POST /api/progress/unlock-level
router.post('/unlock-level', unlockLevel);

// POST /api/progress/unlock-world
router.post('/unlock-world', unlockWorld);

module.exports = router;
