'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  google_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_active: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1,
  },
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    { fields: ['google_id'] },
    { fields: ['email'] },
  ],
});

module.exports = User;
