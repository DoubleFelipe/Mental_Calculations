'use strict';
/**
 * Mental Calculations — Progress Controller
 */
const progressService = require('../services/progressService');
const { UserWorldProgress, UserLevelProgress } = require('../models/index');

/**
 * GET /api/progress
 * Retorna progresso completo do jogador autenticado
 */
async function getProgress(req, res, next) {
  try {
    const data = await progressService.getFullProgress(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/progress/level
 * Registra sessão de fase e atualiza progresso
 * Body: { levelId, correct, total, avgTimeMs }
 */
async function updateLevelProgress(req, res, next) {
  try {
    const { levelId, correct, total, avgTimeMs } = req.body;
    if (!levelId || correct == null || !total || avgTimeMs == null) {
      return res.status(400).json({ error: 'Campos obrigatórios: levelId, correct, total, avgTimeMs' });
    }

    const result = await progressService.completeLevelSession(req.user.id, levelId, {
      correct: parseInt(correct),
      total: parseInt(total),
      avgTimeMs: parseInt(avgTimeMs),
    });

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/progress/state
 * Atualiza estatísticas globais (créditos, vidas etc.)
 * Body: { credits?, lives?, equippedSkin? }
 */
async function updateGlobalState(req, res, next) {
  try {
    const allowed = ['credits', 'lives', 'equipped_skin'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] != null) updates[key] = req.body[key];
    }

    await progressService.updateGlobalStats(req.user.id, updates);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/progress/unlock-level
 * Desbloqueia uma fase específica
 * Body: { levelId }
 */
async function unlockLevel(req, res, next) {
  try {
    const { levelId } = req.body;
    if (!levelId) return res.status(400).json({ error: 'levelId é obrigatório.' });

    await UserLevelProgress.update(
      { is_unlocked: 1 },
      { where: { user_id: req.user.id, level_id: levelId } }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/progress/unlock-world
 * Desbloqueia um mundo
 * Body: { worldId }
 */
async function unlockWorld(req, res, next) {
  try {
    const { worldId } = req.body;
    if (!worldId) return res.status(400).json({ error: 'worldId é obrigatório.' });

    await UserWorldProgress.update(
      { is_unlocked: 1, unlocked_at: new Date() },
      { where: { user_id: req.user.id, world_id: worldId } }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProgress, updateLevelProgress, updateGlobalState, unlockLevel, unlockWorld };
