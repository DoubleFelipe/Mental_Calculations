'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Level = sequelize.define('Level', {
  id: {
    type: DataTypes.SMALLINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  world_id: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    references: { model: 'worlds', key: 'id' },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  questions_count: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 5,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'easy',
  },
  sort_order: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
}, {
  tableName: 'levels',
  timestamps: false,
  indexes: [
    { fields: ['world_id'] },
  ],
});

module.exports = Level;
