'use strict';
/**
 * Mental Calculations — Backend App
 * Node.js + Express + MySQL 8 + Google OAuth + JWT
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/passport');
const { testConnection } = require('./config/database');

// Models (registra todos no Sequelize antes de qualquer uso)
require('./models/index');

// Rotas
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const shopRoutes = require('./routes/shop');
const rankingRoutes = require('./routes/ranking');

// Middleware
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = FRONTEND_URL.split(',').map((url) => url.trim()).filter(Boolean);

// Railway fica atrás de um proxy. Isso permite cookies seguros quando necessários.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// =============================================
// Segurança e CORS
// =============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pelo CORS.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// =============================================
// Parsing e Rate Limiting
// =============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// =============================================
// Sessão (apenas para o OAuth flow)
// =============================================
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutos (somente para o flow OAuth)
  },
}));

// =============================================
// Passport
// =============================================
app.use(passport.initialize());
app.use(passport.session());

// =============================================
// Health Check
// =============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Mental Calculations API',
    version: '1.0.0',
  });
});

// =============================================
// Rotas da API
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/ranking', rankingRoutes);

// =============================================
// 404 e Error Handler
// =============================================
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

// =============================================
// Inicialização
// =============================================
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Mental Calculations API rodando em http://localhost:${PORT}`);
    console.log(`🌍 Frontend esperado em: ${FRONTEND_URL}`);
    console.log(`📋 Docs das rotas disponíveis em: http://localhost:${PORT}/api/health`);
    console.log(`\nRotas disponíveis:`);
    console.log(`  GET  /api/health`);
    console.log(`  GET  /api/auth/google`);
    console.log(`  GET  /api/auth/me`);
    console.log(`  POST /api/auth/logout`);
    console.log(`  GET  /api/progress`);
    console.log(`  POST /api/progress/level/start`);
    console.log(`  POST /api/progress/level`);
    console.log(`  GET  /api/shop`);
    console.log(`  POST /api/shop/buy`);
    console.log(`  POST /api/shop/equip`);
    console.log(`  GET  /api/ranking/global`);
    console.log(`  GET  /api/ranking/level/:levelId`);
  });
}

startServer();

module.exports = app;
