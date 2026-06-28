'use strict';
/**
 * Mental Calculations — Passport Config
 * Configuração do Google OAuth 2.0 com Passport.js
 */
require('dotenv').config();
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');
const UserSettings = require('../models/UserSettings');
const UserGameState = require('../models/UserGameState');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || '';
        const name = profile.displayName || 'Jogador';
        const avatarUrl = profile.photos?.[0]?.value || null;

        // Buscar ou criar usuário
        let user = await User.findOne({ where: { google_id: googleId } });

        if (!user) {
          // Criar novo usuário com dados padrão
          user = await User.create({
            google_id: googleId,
            email,
            name,
            avatar_url: avatarUrl,
            is_active: true,
          });

          // Criar registros padrão associados
          await Promise.all([
            UserSettings.create({ user_id: user.id }),
            UserGameState.create({ user_id: user.id }),
          ]);

          // Importar aqui para evitar circular dependency
          const { initializeUserProgress } = require('../services/progressService');
          await initializeUserProgress(user.id);
        } else {
          // Atualizar último login
          await user.update({ last_login_at: new Date(), avatar_url: avatarUrl });
        }

        return done(null, user);
      } catch (error) {
        console.error('Erro no Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

// Serialização mínima (somente ID) para sessões temporárias do OAuth flow
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
