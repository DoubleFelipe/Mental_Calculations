'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserLevelProgress = sequelize.define('UserLevelProgress', {
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
  is_unlocked: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
  },
  is_completed: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
  },
  best_stars: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  best_score: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  attempts: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  first_completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_level_progress',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'level_id'], name: 'uq_user_level' },
  ],
});

module.exports = UserLevelProgress;
