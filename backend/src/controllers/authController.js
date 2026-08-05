'use strict';
/**
 * Mental Calculations — Auth Controller
 */
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/authService');
const { User, UserSettings, UserGameState } = require('../models/index');
const { initializeUserProgress } = require('../services/progressService');

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
  };
}

async function bootstrapUser(userId) {
  await Promise.all([
    UserSettings.findOrCreate({ where: { user_id: userId }, defaults: { user_id: userId } }),
    UserGameState.findOrCreate({ where: { user_id: userId }, defaults: { user_id: userId } }),
  ]);
  await initializeUserProgress(userId);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getFrontendUrl() {
  // A primeira URL é a canônica para os redirecionamentos OAuth. As demais,
  // se existirem, são aceitas apenas pelo CORS (por exemplo, localhost).
  return (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();
}

/**
 * GET /api/auth/google
 * Iniciado pelo Passport (ver routes/auth.js)
 */

/**
 * POST /api/auth/register
 * Cria conta local com email e senha.
 */
async function registerWithPassword(req, res) {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Informe nome, email e senha.' });
    }

    if (name.length < 2 || name.length > 150) {
      return res.status(400).json({ error: 'O nome deve ter entre 2 e 150 caracteres.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Informe um email valido.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Este email ja esta cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password_hash: passwordHash,
      is_active: true,
    });

    await bootstrapUser(user.id);

    const token = generateToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('Erro no cadastro por email:', err);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
}

/**
 * POST /api/auth/login
 * Autentica conta local com email e senha.
 */
async function loginWithPassword(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe email e senha.' });
    }

    const user = await User.findOne({ where: { email } });
    const passwordOk = user?.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !user.is_active || !passwordOk) {
      return res.status(401).json({ error: 'Email ou senha invalidos.' });
    }

    await user.update({ last_login_at: new Date() });
    await bootstrapUser(user.id);

    const token = generateToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('Erro no login por email:', err);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}

/**
 * GET /api/auth/google/callback
 * Callback do Google OAuth → emite JWT e redireciona para o frontend
 */
async function googleCallback(req, res) {
  try {
    const user = req.user;
    const token = generateToken(user);

    // Redirecionar para o frontend com o token na query string
    const frontendUrl = getFrontendUrl();
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (err) {
    const frontendUrl = getFrontendUrl();
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

    res.json({ user: publicUser(user), settings, gameState });
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

module.exports = {
  registerWithPassword,
  loginWithPassword,
  googleCallback,
  getMe,
  logout,
};
