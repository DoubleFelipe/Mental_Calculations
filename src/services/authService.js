/**
 * Mental Calculations — Auth Service (Frontend)
 * Gerencia login Google OAuth, armazenamento do JWT e dados do usuário.
 */

const TOKEN_KEY = 'mc_jwt_token';
const USER_KEY = 'mc_user';

async function requestAuth(endpoint, payload) {
  const response = await fetch(`/api/auth/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Nao foi possivel autenticar.');
  }

  saveAuthData(data.token, data.user);
  return data.user;
}

/**
 * Retorna o JWT armazenado (ou null se não autenticado)
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retorna os dados do usuário armazenados (ou null)
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Salva o JWT e dados do usuário após callback do OAuth
 */
export function saveAuthData(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Limpa todos os dados de autenticação (logout)
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Verifica se o usuário está autenticado (tem token)
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Inicia o fluxo de login Google OAuth
 * Redireciona o browser para o backend que cuida do OAuth
 */
export function loginWithGoogle() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}:3001/api/auth/google`;
}

/**
 * Faz login com email e senha.
 */
export function loginWithEmail(email, password) {
  return requestAuth('login', { email, password });
}

/**
 * Cria uma conta com nome, email e senha.
 */
export function registerWithEmail(name, email, password) {
  return requestAuth('register', { name, email, password });
}

/**
 * Processa o callback do OAuth (chamado na tela /auth/callback)
 * Extrai token da URL e salva. Retorna true se sucesso.
 */
export function processOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const error = params.get('error');

  if (error || !token) {
    return { success: false, error: error || 'auth_failed' };
  }

  // Decodificar payload do JWT para obter dados básicos do usuário
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user = {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
    };
    saveAuthData(token, user);
    return { success: true, user };
  } catch {
    return { success: false, error: 'invalid_token' };
  }
}
