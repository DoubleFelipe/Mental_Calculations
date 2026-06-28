'use strict';
/**
 * Mental Calculations — Auth Controller
 */
const { generateToken } = require('../services/authService');
const { UserSettings, UserGameState } = require('../models/index');

/**
 * GET /api/auth/google
 * Iniciado pelo Passport (ver routes/auth.js)
 */

/**
 * GET /api/auth/google/callback
 * Callback do Google OAuth → emite JWT e redireciona para o frontend
 */
async function googleCallback(req, res) {
  try {
    const user = req.user;
    const token = generateToken(user);

    // Redirecionar para o frontend com o token na query string
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (err) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?error=auth_failed`);
  }
}

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado
 */
async function getMe(req, res) {
  try {
    const user = req.user;
    const [settings, gameState] = await Promise.all([
      UserSettings.findOne({ where: { user_id: user.id } }),
      UserGameState.findOne({ where: { user_id: user.id } }),
    ]);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
      settings,
      gameState,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
}

/**
 * POST /api/auth/logout
 * Instruir o frontend a descartar o token
 */
function logout(req, res) {
  // Com JWT stateless, o "logout" é apenas orientar o cliente a descartar o token.
  // Para invalidação real, seria necessário uma blacklist no Redis.
  res.json({ message: 'Logout realizado. Descarte o token no cliente.' });
}

module.exports = { googleCallback, getMe, logout };
