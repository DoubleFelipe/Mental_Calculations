'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const World = sequelize.define('World', {
  id: {
    type: DataTypes.TINYINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  color_hex: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  sort_order: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
}, {
  tableName: 'worlds',
  timestamps: false,
});

module.exports = World;
