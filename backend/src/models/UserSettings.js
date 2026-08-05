'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSettings = sequelize.define('UserSettings', {
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
  music_volume: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 80,
    validate: { min: 0, max: 100 },
  },
  sfx_volume: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 50,
    validate: { min: 0, max: 100 },
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'pt-br',
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_settings',
  timestamps: false,
});

module.exports = UserSettings;
