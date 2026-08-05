'use strict';
/**
 * Mental Calculations — Auth Service
 * Lógica de JWT e geração de token.
 */
require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Gera um JWT para o usuário autenticado.
 * @param {object} user - Model do Sequelize com id, name, email
 * @returns {string} token JWT
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Verifica e decodifica um JWT.
 * @param {string} token
 * @returns {object} payload decodificado
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
