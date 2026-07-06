'use strict';
/**
 * Mental Calculations — Progress Service
 * Business logic de progresso, desbloqueio e estatísticas.
 */
const { sequelize } = require('../config/database');
const {
  UserGameState,
  UserWorldProgress,
  UserLevelProgress,
  LevelSession,
  World,
  Level,
} = require('../models/index');

// =========================================================
// Dificuldade por mundo e fase (mirrors do frontend)
// =========================================================
const DIFFICULTY_MAP = [
  ['easy', 'easy', 'medium', 'medium', 'hard'],
  ['easy', 'medium', 'medium', 'hard', 'hard'],
  ['medium', 'medium', 'hard', 'hard', 'hard'],
  ['medium', 'hard', 'hard', 'hard', 'hard'],
];

function getLevelDifficulty(worldIndex, levelIndex) {
  return DIFFICULTY_MAP[worldIndex]?.[levelIndex] || 'easy';
}

function calculateStars(correct, total) {
  if (total === 0) return 0;
  const pct = (correct / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 75) return 2;
  if (pct >= 60) return 1;
  return 0;
}

function didPassLevel(correct, total) {
  if (total === 0) return false;
  return (correct / total) * 100 >= 60;
}

function calculateCredits(stars, difficulty) {
  const base = { easy: 10, medium: 20, hard: 30 };
  return stars * (base[difficulty] || 10);
}

function calculateScore(correct, total, avgTimeMs, difficulty) {
  const baseScore = correct * 100;
  const diffMult = { easy: 1, medium: 1.5, hard: 2 };
  const timeMult = difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25;
  const timeBonus = Math.max(0, (timeMult * 1000 - avgTimeMs) / 100);
  return Math.round((baseScore + timeBonus) * (diffMult[difficulty] || 1));
}

// =========================================================
// Inicialização do progresso de um novo usuário
// =========================================================
async function initializeUserProgress(userId) {
  const worlds = await World.findAll({ order: [['sort_order', 'ASC']] });
  const levels = await Level.findAll({ order: [['world_id', 'ASC'], ['sort_order', 'ASC']] });

  // Criar world progress (apenas o primeiro mundo desbloqueado)
  const worldProgressData = worlds.map((w, index) => ({
    user_id: userId,
    world_id: w.id,
    is_unlocked: index === 0 ? 1 : 0,
    unlocked_at: index === 0 ? new Date() : null,
  }));
  await UserWorldProgress.bulkCreate(worldProgressData, { ignoreDuplicates: true });

  // Criar level progress (apenas o primeiro nível de cada mundo desbloqueado)
  const firstLevelPerWorld = {};
  const levelProgressData = levels.map((l) => {
    const isFirst = !firstLevelPerWorld[l.world_id];
    if (isFirst) firstLevelPerWorld[l.world_id] = true;
    return {
      user_id: userId,
      level_id: l.id,
      is_unlocked: isFirst ? 1 : 0,
      is_completed: 0,
      best_stars: 0,
      best_score: 0,
      attempts: 0,
    };
  });
  await UserLevelProgress.bulkCreate(levelProgressData, { ignoreDuplicates: true });
}

// =========================================================
// Buscar progresso completo do jogador
// =========================================================
async function getFullProgress(userId) {
  const [gameState, worldProgress, levelProgress, purchasedItems] = await Promise.all([
    UserGameState.findOne({ where: { user_id: userId } }),
    UserWorldProgress.findAll({
      where: { user_id: userId },
      include: [{ model: World, as: 'world' }],
      order: [['world_id', 'ASC']],
    }),
    UserLevelProgress.findAll({
      where: { user_id: userId },
      include: [{ model: Level, as: 'level', include: [{ model: World, as: 'world' }] }],
      order: [['level_id', 'ASC']],
    }),
    require('../models/UserPurchasedItem').findAll({
      where: { user_id: userId },
      include: [{ model: require('../models/ShopItem'), as: 'item' }],
    }),
  ]);

  return { gameState, worldProgress, levelProgress, purchasedItems };
}

// =========================================================
// Registrar sessão de fase e atualizar progresso
// =========================================================
async function completeLevelSession(userId, levelId, { correct, total, avgTimeMs }) {
  const t = await sequelize.transaction();
  try {
    // Buscar o level para obter worldIndex e levelIndex
    const level = await Level.findByPk(levelId);
    if (!level) throw new Error(`Level ${levelId} não encontrado.`);

    const worldIndex = level.world_id - 1;
    const levelIndex = level.sort_order;

    const difficulty = getLevelDifficulty(worldIndex, levelIndex);
    const stars = calculateStars(correct, total);
    const passed = didPassLevel(correct, total);
    const credits = calculateCredits(stars, difficulty);
    const score = calculateScore(correct, total, avgTimeMs, difficulty);

    // Registrar sessão
    await LevelSession.create({
      user_id: userId,
      level_id: levelId,
      correct_answers: correct,
      total_questions: total,
      avg_time_ms: avgTimeMs,
      stars_earned: stars,
      score_earned: score,
      credits_earned: credits,
      passed: passed ? 1 : 0,
    }, { transaction: t });

    // Atualizar level progress
    const [lp] = await UserLevelProgress.findOrCreate({
      where: { user_id: userId, level_id: levelId },
      defaults: { is_unlocked: 1 },
      transaction: t,
    });

    const updateData = {
      is_completed: lp.is_completed || (passed ? 1 : 0),
      attempts: lp.attempts + 1,
      updated_at: new Date(),
    };
    if (stars > lp.best_stars) updateData.best_stars = stars;
    if (score > lp.best_score) updateData.best_score = score;
    if (passed && !lp.first_completed_at) updateData.first_completed_at = new Date();

    await lp.update(updateData, { transaction: t });

    // Desbloquear próxima fase / mundo se passou
    if (passed) {
      const allLevelsInWorld = await Level.findAll({
        where: { world_id: level.world_id },
        order: [['sort_order', 'ASC']],
        transaction: t,
      });
      const nextLevel = allLevelsInWorld.find((l) => l.sort_order === levelIndex + 1);

      if (nextLevel) {
        await UserLevelProgress.update(
          { is_unlocked: 1 },
          { where: { user_id: userId, level_id: nextLevel.id }, transaction: t }
        );
      } else {
        // Último nível do mundo — desbloquear próximo mundo
        const nextWorldId = level.world_id + 1;
        const nextWorldExists = await World.findByPk(nextWorldId, { transaction: t });
        if (nextWorldExists) {
          await UserWorldProgress.update(
            { is_unlocked: 1, unlocked_at: new Date() },
            { where: { user_id: userId, world_id: nextWorldId }, transaction: t }
          );
          // Desbloquear primeira fase do próximo mundo
          const firstLevelNextWorld = await Level.findOne({
            where: { world_id: nextWorldId },
            order: [['sort_order', 'ASC']],
            transaction: t,
          });
          if (firstLevelNextWorld) {
            await UserLevelProgress.update(
              { is_unlocked: 1 },
              { where: { user_id: userId, level_id: firstLevelNextWorld.id }, transaction: t }
            );
          }
        }
      }
    }

    // Atualizar estatísticas globais
    await UserGameState.update(
      {
        credits: sequelize.literal(`credits + ${credits}`),
        total_score: sequelize.literal(`total_score + ${score}`),
        total_correct: sequelize.literal(`total_correct + ${correct}`),
        total_wrong: sequelize.literal(`total_wrong + ${total - correct}`),
        total_time_ms: sequelize.literal(`total_time_ms + ${avgTimeMs * total}`),
        questions_answered: sequelize.literal(`questions_answered + ${total}`),
        updated_at: new Date(),
      },
      { where: { user_id: userId }, transaction: t }
    );

    await t.commit();
    return { stars, passed, credits, score };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

// =========================================================
// Atualizar estatísticas globais manualmente
// =========================================================
async function updateGlobalStats(userId, stats) {
  await UserGameState.update(
    { ...stats, updated_at: new Date() },
    { where: { user_id: userId } }
  );
}

module.exports = {
  initializeUserProgress,
  getFullProgress,
  completeLevelSession,
  updateGlobalStats,
  calculateStars,
  didPassLevel,
  calculateCredits,
  calculateScore,
};
