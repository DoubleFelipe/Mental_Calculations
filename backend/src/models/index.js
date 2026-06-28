'use strict';
/**
 * Mental Calculations — Models Index
 * Centraliza todos os models e define as associações entre eles.
 */
const User = require('./User');
const UserSettings = require('./UserSettings');
const UserGameState = require('./UserGameState');
const World = require('./World');
const Level = require('./Level');
const UserWorldProgress = require('./UserWorldProgress');
const UserLevelProgress = require('./UserLevelProgress');
const ShopItem = require('./ShopItem');
const UserPurchasedItem = require('./UserPurchasedItem');
const LevelSession = require('./LevelSession');

// =====================
// Associações
// =====================

// User → UserSettings (1:1)
User.hasOne(UserSettings, { foreignKey: 'user_id', as: 'settings', onDelete: 'CASCADE' });
UserSettings.belongsTo(User, { foreignKey: 'user_id' });

// User → UserGameState (1:1)
User.hasOne(UserGameState, { foreignKey: 'user_id', as: 'gameState', onDelete: 'CASCADE' });
UserGameState.belongsTo(User, { foreignKey: 'user_id' });

// World → Level (1:N)
World.hasMany(Level, { foreignKey: 'world_id', as: 'levels', onDelete: 'CASCADE' });
Level.belongsTo(World, { foreignKey: 'world_id', as: 'world' });

// User → UserWorldProgress (1:N)
User.hasMany(UserWorldProgress, { foreignKey: 'user_id', as: 'worldProgress', onDelete: 'CASCADE' });
UserWorldProgress.belongsTo(User, { foreignKey: 'user_id' });

// World → UserWorldProgress (1:N)
World.hasMany(UserWorldProgress, { foreignKey: 'world_id', as: 'userProgress', onDelete: 'CASCADE' });
UserWorldProgress.belongsTo(World, { foreignKey: 'world_id', as: 'world' });

// User → UserLevelProgress (1:N)
User.hasMany(UserLevelProgress, { foreignKey: 'user_id', as: 'levelProgress', onDelete: 'CASCADE' });
UserLevelProgress.belongsTo(User, { foreignKey: 'user_id' });

// Level → UserLevelProgress (1:N)
Level.hasMany(UserLevelProgress, { foreignKey: 'level_id', as: 'userProgress', onDelete: 'CASCADE' });
UserLevelProgress.belongsTo(Level, { foreignKey: 'level_id', as: 'level' });

// User ↔ ShopItem (N:N via UserPurchasedItem)
User.belongsToMany(ShopItem, { through: UserPurchasedItem, foreignKey: 'user_id', as: 'purchasedItems' });
ShopItem.belongsToMany(User, { through: UserPurchasedItem, foreignKey: 'shop_item_id', as: 'buyers' });
UserPurchasedItem.belongsTo(User, { foreignKey: 'user_id' });
UserPurchasedItem.belongsTo(ShopItem, { foreignKey: 'shop_item_id', as: 'item' });
User.hasMany(UserPurchasedItem, { foreignKey: 'user_id', as: 'purchasedItemsList', onDelete: 'CASCADE' });

// User → LevelSession (1:N)
User.hasMany(LevelSession, { foreignKey: 'user_id', as: 'sessions', onDelete: 'CASCADE' });
LevelSession.belongsTo(User, { foreignKey: 'user_id' });

// Level → LevelSession (1:N)
Level.hasMany(LevelSession, { foreignKey: 'level_id', as: 'sessions', onDelete: 'CASCADE' });
LevelSession.belongsTo(Level, { foreignKey: 'level_id', as: 'level' });

module.exports = {
  User,
  UserSettings,
  UserGameState,
  World,
  Level,
  UserWorldProgress,
  UserLevelProgress,
  ShopItem,
  UserPurchasedItem,
  LevelSession,
};
