'use strict';

const progressService = require('../services/progressService');

function toSafeInteger(value) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function toSafeDuration(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > Number.MAX_SAFE_INTEGER) {
    return null;
  }
  return Math.round(parsed);
}

async function getProgress(req, res, next) {
  try {
    res.json(await progressService.getFullProgress(req.user.id));
  } catch (err) {
    next(err);
  }
}

async function startLevelAttempt(req, res, next) {
  try {
    const levelId = toSafeInteger(req.body.levelId);
    if (!levelId || levelId < 1) {
      return res.status(400).json({ error: 'levelId deve ser um inteiro positivo.' });
    }
    const attempt = await progressService.startLevelAttempt(req.user.id, levelId);
    return res.status(201).json({ success: true, attemptId: attempt.id });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    return next(err);
  }
}

async function updateLevelProgress(req, res, next) {
  try {
    const levelId = toSafeInteger(req.body.levelId);
    const attemptId = toSafeInteger(req.body.attemptId);
    const correct = toSafeInteger(req.body.correct);
    const total = toSafeInteger(req.body.total);
    // A média de tempos pode ter casas decimais. Arredondar evita rejeitar uma
    // conclusão válida apenas por causa da divisão entre as questões.
    const avgTimeMs = toSafeDuration(req.body.avgTimeMs);
    const useDoubleCredits = req.body.useDoubleCredits === true;

    if (!levelId || !attemptId || correct === null || total === null || avgTimeMs === null) {
      return res.status(400).json({ error: 'Campos inválidos para a conclusão da fase.' });
    }
    if (correct < 0 || total <= 0 || correct > total || avgTimeMs < 0 || avgTimeMs > 300000) {
      return res.status(400).json({ error: 'Resultados fora dos limites permitidos.' });
    }

    const result = await progressService.completeLevelSession(req.user.id, levelId, attemptId, {
      correct,
      total,
      avgTimeMs,
      useDoubleCredits,
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    return next(err);
  }
}

module.exports = { getProgress, startLevelAttempt, updateLevelProgress };
