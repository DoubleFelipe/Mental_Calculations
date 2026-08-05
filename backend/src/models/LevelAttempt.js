'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LevelAttempt = sequelize.define('LevelAttempt', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  level_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
  started_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  completed_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'level_attempts',
  timestamps: false,
  indexes: [{ fields: ['user_id', 'level_id'] }, { fields: ['started_at'] }],
});

module.exports = LevelAttempt;
