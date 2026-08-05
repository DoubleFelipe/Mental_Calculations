'use strict';
/**
 * Mental Calculations — Shop Service
 * Lógica de compra, equipar skin e consumir power-up.
 */
const { sequelize } = require('../config/database');
const { ShopItem, UserPurchasedItem, UserGameState } = require('../models/index');

// Créditos adicionados por pack (hard-coded, em produção usaria tabela)
const CREDIT_PACK_AMOUNTS = {
  pack_small:  200,
  pack_medium: 500,
  pack_large:  1200,
};

/**
 * Lista todos os itens ativos da loja
 */
async function listItems() {
  return ShopItem.findAll({
    where: { is_active: 1 },
    order: [['type', 'ASC'], ['credit_price', 'ASC']],
  });
}

/**
 * Compra um item para o usuário
 */
async function purchaseItem(userId, itemKey) {
  const t = await sequelize.transaction();
  try {
    const item = await ShopItem.findOne({ where: { item_key: itemKey, is_active: 1 }, transaction: t });
    if (!item) throw Object.assign(new Error('Item não encontrado.'), { status: 404 });

    const gameState = await UserGameState.findOne({ where: { user_id: userId }, transaction: t });
    if (!gameState) throw Object.assign(new Error('Estado do jogo não encontrado.'), { status: 404 });

    // Pacotes de crédito: adicionar créditos diretamente
    if (item.type === 'credit_pack') {
      const amount = CREDIT_PACK_AMOUNTS[item.item_key] || 0;
      await gameState.update(
        { credits: sequelize.literal(`credits + ${amount}`), updated_at: new Date() },
        { transaction: t }
      );
      await t.commit();
      return { type: 'credit_pack', creditsAdded: amount };
    }

    // Verificar se já possui o item
    const existing = await UserPurchasedItem.findOne({
      where: { user_id: userId, shop_item_id: item.id },
      transaction: t,
    });
    if (existing && item.type !== 'powerup') {
      throw Object.assign(new Error('Item já adquirido.'), { status: 409 });
    }

    // Verificar créditos suficientes
    if (gameState.credits < item.credit_price) {
      throw Object.assign(new Error('Créditos insuficientes.'), { status: 400 });
    }

    // Descontar créditos e criar registro de compra
    await gameState.update(
      { credits: sequelize.literal(`credits - ${item.credit_price}`), updated_at: new Date() },
      { transaction: t }
    );

    if (existing) {
      await existing.update(
        { uses_remaining: existing.uses_remaining + (item.uses || 0) },
        { transaction: t }
      );
    } else {
      await UserPurchasedItem.create({
        user_id: userId,
        shop_item_id: item.id,
        uses_remaining: item.uses || 0,
      }, { transaction: t });
    }

    await t.commit();
    return { type: item.type, item };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Equipa uma skin para o usuário
 */
async function equipSkin(userId, itemKey) {
  const item = await ShopItem.findOne({ where: { item_key: itemKey, type: 'skin' } });
  if (!item) throw Object.assign(new Error('Skin não encontrada.'), { status: 404 });

  // Verificar se possui a skin
  const purchased = await UserPurchasedItem.findOne({
    where: { user_id: userId, shop_item_id: item.id },
  });
  if (!purchased && itemKey !== 'default') {
    throw Object.assign(new Error('Skin não adquirida.'), { status: 403 });
  }

  await UserGameState.update(
    { equipped_skin: itemKey, updated_at: new Date() },
    { where: { user_id: userId } }
  );

  return { equippedSkin: itemKey };
}

/**
 * Consome um uso de power-up
 */
async function consumePowerUp(userId, itemKey) {
  const item = await ShopItem.findOne({ where: { item_key: itemKey, type: 'powerup' } });
  if (!item) throw Object.assign(new Error('Power-up não encontrado.'), { status: 404 });

  const purchased = await UserPurchasedItem.findOne({
    where: { user_id: userId, shop_item_id: item.id },
  });
  if (!purchased || purchased.uses_remaining <= 0) {
    throw Object.assign(new Error('Power-up sem usos restantes.'), { status: 400 });
  }

  await purchased.update({ uses_remaining: purchased.uses_remaining - 1 });
  return { usesRemaining: purchased.uses_remaining - 1 };
}

module.exports = { listItems, purchaseItem, equipSkin, consumePowerUp };
