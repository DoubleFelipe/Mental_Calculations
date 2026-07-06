'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserPurchasedItem = sequelize.define('UserPurchasedItem', {
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
  shop_item_id: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: false,
    references: { model: 'shop_items', key: 'id' },
    onDelete: 'CASCADE',
  },
  uses_remaining: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  purchased_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_purchased_items',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'shop_item_id'], name: 'uq_user_item' },
  ],
});

module.exports = UserPurchasedItem;
