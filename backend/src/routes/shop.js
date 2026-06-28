'use strict';
/**
 * Mental Calculations — Shop Routes
 */
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { listItems, buyItem, equipSkin, consumePowerUp } = require('../controllers/shopController');

const router = express.Router();

// GET /api/shop          — listar itens (público)
router.get('/', listItems);

// Rotas abaixo exigem autenticação
router.use(authMiddleware);

// POST /api/shop/buy
router.post('/buy', buyItem);

// POST /api/shop/equip
router.post('/equip', equipSkin);

// POST /api/shop/consume
router.post('/consume', consumePowerUp);

module.exports = router;
