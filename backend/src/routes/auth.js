'use strict';
/**
 * Mental Calculations — Auth Routes
 */
const express = require('express');
const passport = require('../config/passport');
const { googleCallback, getMe, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Iniciar fluxo Google OAuth
router.get('/google', authLimiter, passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// Callback do Google
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/callback?error=auth_failed' }),
  googleCallback
);

// Buscar dados do usuário autenticado
router.get('/me', authMiddleware, getMe);

// Logout
router.post('/logout', authMiddleware, logout);

module.exports = router;
