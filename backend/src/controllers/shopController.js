'use strict';
/**
 * Mental Calculations — Shop Controller
 */
const shopService = require('../services/shopService');

/**
 * GET /api/shop
 * Lista todos os itens ativos da loja
 */
async function listItems(req, res, next) {
  try {
    const items = await shopService.listItems();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/shop/buy
 * Compra um item
 * Body: { itemKey }
 */
async function buyItem(req, res, next) {
  try {
    const { itemKey } = req.body;
    if (!itemKey) return res.status(400).json({ error: 'itemKey é obrigatório.' });

    const result = await shopService.purchaseItem(req.user.id, itemKey);
    res.json({ success: true, ...result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

/**
 * POST /api/shop/equip
 * Equipa uma skin
 * Body: { itemKey }
 */
async function equipSkin(req, res, next) {
  try {
    const { itemKey } = req.body;
    if (!itemKey) return res.status(400).json({ error: 'itemKey é obrigatório.' });

    const result = await shopService.equipSkin(req.user.id, itemKey);
    res.json({ success: true, ...result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

/**
 * POST /api/shop/consume
 * Consome um uso de power-up
 * Body: { itemKey }
 */
async function consumePowerUp(req, res, next) {
  try {
    const { itemKey } = req.body;
    if (!itemKey) return res.status(400).json({ error: 'itemKey é obrigatório.' });

    const result = await shopService.consumePowerUp(req.user.id, itemKey);
    res.json({ success: true, ...result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

module.exports = { listItems, buyItem, equipSkin, consumePowerUp };
