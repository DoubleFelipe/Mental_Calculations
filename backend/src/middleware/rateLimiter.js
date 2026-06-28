'use strict';
/**
 * Mental Calculations — Rate Limiter Middleware
 */
const rateLimit = require('express-rate-limit');

// Limite geral: 100 req por 15 minutos
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

// Limite mais restrito para auth: 20 req por 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de autenticação. Aguarde 15 minutos.' },
});

module.exports = { generalLimiter, authLimiter };
