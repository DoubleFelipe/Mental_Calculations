'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserGameState = sequelize.define('UserGameState', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  credits: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 100,
  },
  lives: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 3,
  },
  total_score: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  total_correct: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  total_wrong: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  total_time_ms: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  questions_answered: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  equipped_skin: {
    type: DataTypes.STRING(50),
    defaultValue: 'default',
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_game_state',
  timestamps: false,
});

module.exports = UserGameState;
