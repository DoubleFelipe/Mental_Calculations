'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShopItem = sequelize.define('ShopItem', {
  id: {
    type: DataTypes.SMALLINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  item_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('skin', 'powerup', 'credit_pack'),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  credit_price: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  real_price: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  uses: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1,
  },
}, {
  tableName: 'shop_items',
  timestamps: false,
  indexes: [
    { fields: ['type'] },
  ],
});

module.exports = ShopItem;
