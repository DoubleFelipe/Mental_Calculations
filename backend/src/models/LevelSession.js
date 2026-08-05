'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LevelSession = sequelize.define('LevelSession', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  level_id: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: false,
    references: { model: 'levels', key: 'id' },
    onDelete: 'CASCADE',
  },
  correct_answers: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  total_questions: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  avg_time_ms: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  stars_earned: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  score_earned: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  credits_earned: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  passed: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
  },
  played_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'level_sessions',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['level_id'] },
    { fields: ['played_at'] },
  ],
});

module.exports = LevelSession;
