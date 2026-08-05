/**
 * Endereço base da API.
 *
 * Em desenvolvimento, sem a variável VITE_API_URL, o Vite redireciona /api
 * para o backend local. Em produção, configure VITE_API_URL na Vercel com
 * a URL pública do Railway seguida de /api.
 */
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, '')
  : '/api';
