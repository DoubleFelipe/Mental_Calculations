'use strict';
/**
 * Mental Calculations — Global Error Handler Middleware
 */

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  console.error('❌ Erro não tratado:', err.stack || err.message);

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos.',
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Registro duplicado.' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor.',
  });
};
