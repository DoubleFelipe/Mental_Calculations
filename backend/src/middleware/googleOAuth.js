'use strict';

function createGoogleCallback(passport, onSuccess, frontendUrl, logger = console) {
  return (req, res, next) => {
    passport.authenticate('google', { session: false }, (error, user) => {
      if (error || !user) {
        if (error) {
          // Never log OAuth codes, tokens, credentials or provider response bodies.
          const cause = error.oauthError || error.cause || error;
          const code = typeof cause.code === 'string' && /^[A-Z_]+$/.test(cause.code) ? cause.code : error.name;
          logger.warn(`Falha no login Google (${code}). Verifique a conectividade HTTPS e a configuração OAuth.`);
        }
        return res.redirect(`${frontendUrl}/auth/callback?error=google_auth_failed`);
      }
      // session:false is retained. The existing controller still issues the JWT.
      req.user = user;
      return onSuccess(req, res, next);
    })(req, res, next);
  };
}

module.exports = { createGoogleCallback };
