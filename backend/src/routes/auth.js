'use strict';
/**
 * Mental Calculations — Auth Routes
 */
const express = require('express');
const passport = require('../config/passport');
const {
  registerWithPassword,
  loginWithPassword,
  googleCallback,
  getMe,
  logout,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Cadastro/login com email e senha
router.post('/register', authLimiter, registerWithPassword);
router.post('/login', authLimiter, loginWithPassword);

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
