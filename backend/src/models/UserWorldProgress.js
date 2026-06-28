'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserWorldProgress = sequelize.define('UserWorldProgress', {
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
  world_id: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    references: { model: 'worlds', key: 'id' },
    onDelete: 'CASCADE',
  },
  is_unlocked: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
  },
  unlocked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'user_world_progress',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'world_id'], name: 'uq_user_world' },
  ],
});

module.exports = UserWorldProgress;
