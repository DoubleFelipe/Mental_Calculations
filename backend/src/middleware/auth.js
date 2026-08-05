'use strict';
/**
 * Mental Calculations — Auth Middleware
 * Verifica o JWT em cada requisição protegida.
 */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o usuário ainda existe e está ativo
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'is_active'],
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Usuário inválido ou desativado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
