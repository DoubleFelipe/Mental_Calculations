/**
 * Mental Calculations - Login Page
 * Tela de login com email/senha, Google OAuth e modo convidado.
 */
import { useEffect, useState } from 'react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  processOAuthCallback,
} from '../../../services/authService';

export default function Login({ onAuthenticated }) {
  const hasAuthCallback = window.location.pathname === '/auth/callback' ||
    window.location.search.includes('token=') ||
    window.location.search.includes('error=');
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(hasAuthCallback);
  const [error, setError] = useState('');
  const [isCallback, setIsCallback] = useState(hasAuthCallback);

  useEffect(() => {
    if (hasAuthCallback) {
      const result = processOAuthCallback();
      if (result.success) {
        setTimeout(() => {
          onAuthenticated(result.user);
        }, 500);
      } else {
        setTimeout(() => {
          setLoading(false);
          setIsCallback(false);
          setError('Falha no login. Tente novamente.');
          window.history.replaceState({}, document.title, '/');
        }, 0);
      }
    }
  }, [hasAuthCallback, onAuthenticated]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    loginWithGoogle();
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Informe email e senha.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Informe seu nome.');
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas nao conferem.');
        return;
      }
    }

    try {
      setLoading(true);
      const user = mode === 'login'
        ? await loginWithEmail(email, password)
        : await registerWithEmail(name, email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message || 'Nao foi possivel autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card chalkboard">
        <div className="login-logo">
          <span className="login-logo-icon">MC</span>
          <h1 className="chalk-text-strong login-title">Mental Calculations</h1>
          <p className="chalk-text login-subtitle">Sincronize seu progresso entre dispositivos</p>
        </div>

        {isCallback && loading ? (
          <div className="login-loading">
            <div className="login-spinner" />
            <p className="chalk-text">Autenticando com Google...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="login-tabs" role="tablist" aria-label="Modo de login">
              <button
                type="button"
                className={mode === 'login' ? 'login-tab active' : 'login-tab'}
                onClick={() => handleModeChange('login')}
              >
                Entrar
              </button>
              <button
                type="button"
                className={mode === 'register' ? 'login-tab active' : 'login-tab'}
                onClick={() => handleModeChange('register')}
              >
                Criar conta
              </button>
            </div>

            <form className="login-form" onSubmit={handlePasswordSubmit}>
              {mode === 'register' && (
                <label className="login-field">
                  <span>Nome</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    disabled={loading}
                  />
                </label>
              )}

              <label className="login-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </label>

              <label className="login-field">
                <span>Senha</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  disabled={loading}
                />
              </label>

              {mode === 'register' && (
                <label className="login-field">
                  <span>Confirmar senha</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                </label>
              )}

              <button className="login-submit-btn chalk-btn chalk-btn-green" type="submit" disabled={loading}>
                {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>

            <div className="login-divider">
              <span className="chalk-text">ou</span>
            </div>

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
              Entrar com Google
            </button>

            <button
              className="login-guest-btn chalk-btn"
              onClick={() => onAuthenticated(null)}
              disabled={loading}
            >
              Jogar sem login
            </button>

            <p className="login-disclaimer chalk-text">
              Sem login, seu progresso fica salvo apenas neste dispositivo.
            </p>
          </>
        )}
      </div>

      <style>{`
        .login-page {
          width: 100%;
          min-width: 0;
          min-height: 100svh;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 18% 12%, rgba(76, 175, 80, 0.18), transparent 28%),
            radial-gradient(circle at 82% 78%, rgba(66, 165, 245, 0.16), transparent 30%),
            #101810;
          box-sizing: border-box;
          padding: clamp(12px, 4vw, 32px);
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
        }
        .login-card {
          max-width: 440px;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          margin: auto;
          padding: clamp(20px, 5vw, 32px);
          border-radius: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.5vh, 18px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .login-logo-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border: 2px solid rgba(255,255,255,0.35);
          border-radius: 50%;
          color: rgba(255,255,255,0.9);
          font-weight: 800;
          letter-spacing: 0;
          filter: drop-shadow(0 0 16px rgba(255,255,255,0.16));
        }
        .login-title {
          font-size: 1.8rem;
          margin: 0;
          overflow-wrap: anywhere;
        }
        .login-subtitle {
          font-size: 0.95rem;
          opacity: 0.75;
          margin: 0;
        }
        .login-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-width: 0;
          gap: 4px;
          padding: 4px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          background: rgba(0,0,0,0.22);
        }
        .login-tab {
          min-height: 40px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: rgba(255,255,255,0.74);
          font-weight: 700;
        }
        .login-tab.active {
          background: rgba(255,255,255,0.14);
          color: white;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
          color: rgba(255,255,255,0.78);
          font-size: 0.88rem;
          font-weight: 700;
        }
        .login-field input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          min-height: 44px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          background: rgba(0,0,0,0.24);
          color: white;
          padding: 10px 12px;
          font: inherit;
        }
        .login-field input:disabled {
          opacity: 0.65;
        }
        .login-submit-btn,
        .login-guest-btn {
          width: 100%;
          min-height: 44px;
          border-radius: 8px;
          font-size: 0.98rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .login-submit-btn:disabled,
        .login-guest-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          min-height: 44px;
          padding: 10px 18px;
          background: #fff;
          color: #333;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
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
          opacity: 0.6;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }
        .login-disclaimer {
          font-size: 0.8rem;
          opacity: 0.58;
          margin: 0;
        }
        .login-error {
          background: rgba(239, 83, 80, 0.15);
          border: 1px solid rgba(239, 83, 80, 0.4);
          border-radius: 8px;
          padding: 12px;
          color: #ffb3ad;
          font-size: 0.9rem;
          text-align: left;
          overflow-wrap: anywhere;
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
        @media (max-width: 480px) {
          .login-page {
            align-items: flex-start;
          }
          .login-card {
            padding: 22px 16px;
          }
          .login-title {
            font-size: 1.45rem;
          }
          .login-subtitle {
            font-size: 0.88rem;
          }
        }
        @media (max-width: 360px) {
          .login-card {
            padding: 18px 14px;
          }
          .login-logo-icon {
            width: 48px;
            height: 48px;
          }
          .login-tab,
          .login-submit-btn,
          .login-google-btn,
          .login-guest-btn {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
