'use strict';
/**
 * Mental Calculations — Ranking Controller
 */
const { sequelize } = require('../config/database');
const { User, UserGameState, LevelSession, Level } = require('../models/index');

/**
 * GET /api/ranking/global
 * Top 20 jogadores por pontuação total
 */
async function globalRanking(req, res, next) {
  try {
    const ranking = await UserGameState.findAll({
      attributes: ['total_score', 'total_correct', 'questions_answered'],
      include: [{
        model: User,
        attributes: ['id', 'name', 'avatar_url'],
        where: { is_active: 1 },
        required: true,
      }],
      order: [['total_score', 'DESC']],
      limit: 20,
    });

    const result = ranking.map((entry, idx) => ({
      position: idx + 1,
      userId: entry.User.id,
      name: entry.User.name,
      avatar: entry.User.avatar_url,
      totalScore: entry.total_score,
      totalCorrect: entry.total_correct,
      questionsAnswered: entry.questions_answered,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/ranking/level/:levelId
 * Top 20 por pontuação em uma fase específica
 */
async function levelRanking(req, res, next) {
  try {
    const { levelId } = req.params;

    const sessions = await LevelSession.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('MAX', sequelize.col('score_earned')), 'best_score'],
        [sequelize.fn('MAX', sequelize.col('stars_earned')), 'best_stars'],
        [sequelize.fn('MIN', sequelize.col('avg_time_ms')), 'best_time'],
      ],
      where: { level_id: levelId, passed: 1 },
      include: [{
        model: User,
        attributes: ['id', 'name', 'avatar_url'],
        where: { is_active: 1 },
        required: true,
      }],
      group: ['user_id', 'User.id', 'User.name', 'User.avatar_url'],
      order: [[sequelize.literal('best_score'), 'DESC']],
      limit: 20,
    });

    const level = await Level.findByPk(levelId, { attributes: ['id', 'name'] });

    const result = sessions.map((s, idx) => ({
      position: idx + 1,
      userId: s.User.id,
      name: s.User.name,
      avatar: s.User.avatar_url,
      bestScore: s.dataValues.best_score,
      bestStars: s.dataValues.best_stars,
      bestTime: s.dataValues.best_time,
    }));

    res.json({ level, ranking: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { globalRanking, levelRanking };
