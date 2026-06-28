/**
 * Mental Calculations — Login Page
 * Tela de login com Google OAuth 2.0
 */
import React, { useEffect, useState } from 'react';
import { loginWithGoogle, processOAuthCallback, isAuthenticated } from '../../../services/authService';

export default function Login({ onAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCallback, setIsCallback] = useState(false);

  // Detectar callback do OAuth
  useEffect(() => {
    if (window.location.pathname === '/auth/callback' ||
        window.location.search.includes('token=') ||
        window.location.search.includes('error=')) {
      setIsCallback(true);
      setLoading(true);

      const result = processOAuthCallback();
      if (result.success) {
        setTimeout(() => {
          onAuthenticated(result.user);
        }, 500);
      } else {
        setLoading(false);
        setIsCallback(false);
        setError('Falha no login. Tente novamente.');
        // Limpar URL
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, [onAuthenticated]);

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    loginWithGoogle();
  };

  return (
    <div className="login-page">
      <div className="login-card chalkboard">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-icon">🧮</span>
          <h1 className="chalk-text-strong login-title">Mental Calculations</h1>
          <p className="chalk-text login-subtitle">Sincronize seu progresso entre dispositivos</p>
        </div>

        {/* Conteúdo */}
        {isCallback && loading ? (
          <div className="login-loading">
            <div className="login-spinner" />
            <p className="chalk-text">Autenticando com Google...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="login-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            <button
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Aguarde...' : 'Entrar com Google'}
            </button>

            <div className="login-divider">
              <span className="chalk-text">ou</span>
            </div>

            <button
              className="login-guest-btn chalk-btn"
              onClick={() => onAuthenticated(null)}
            >
              🎮 Jogar sem login (dados locais)
            </button>

            <p className="login-disclaimer chalk-text">
              Sem login, seu progresso fica salvo apenas neste dispositivo.
            </p>
          </>
        )}
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at center, #1a2a1a 0%, #0d150d 100%);
          padding: 20px;
        }
        .login-card {
          max-width: 420px;
          width: 100%;
          padding: 48px 40px;
          border-radius: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .login-logo-icon {
          font-size: 4rem;
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.2));
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .login-title {
          font-size: 1.8rem;
          margin: 0;
        }
        .login-subtitle {
          font-size: 0.95rem;
          opacity: 0.75;
          margin: 0;
        }
        .login-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 14px 24px;
          background: #fff;
          color: #333;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .login-google-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .login-google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.5;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }
        .login-guest-btn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .login-disclaimer {
          font-size: 0.8rem;
          opacity: 0.5;
          margin: 0;
        }
        .login-error {
          background: rgba(239, 83, 80, 0.15);
          border: 1px solid rgba(239, 83, 80, 0.4);
          border-radius: 10px;
          padding: 12px;
          color: #ff8a80;
          font-size: 0.9rem;
        }
        .login-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
        }
        .login-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #4CAF50;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
