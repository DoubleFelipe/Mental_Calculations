'use strict';

async function isExistingGameApi(port) {
  try {
    const response = await fetch(`http://localhost:${port}/api/health`, { signal: AbortSignal.timeout(2000) });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok' && data.service === 'Mental Calculations API';
  } catch {
    return false;
  }
}

async function startHttpServer({ app, port, connect, disconnect, environment, logger = console, setExitCode = (code) => { process.exitCode = code; } }) {
  try {
    await connect();
    return await new Promise((resolve, reject) => {
      const server = app.listen(port);
      server.once('error', reject);
      server.once('listening', () => {
        server.removeListener('error', reject);
        resolve(server);
      });
    });
  } catch (error) {
    const existing = error.code === 'EADDRINUSE' && environment === 'development' && await isExistingGameApi(port);
    if (existing) {
      logger.log(`ℹ️ O backend já está rodando em http://localhost:${port}. Use a instância existente; esta segunda inicialização foi encerrada.`);
    } else if (error.code === 'EADDRINUSE') {
      logger.error(`❌ A porta ${port} já está em uso. Encerre a outra instância antes de iniciar o backend novamente.`);
    } else {
      logger.error(`❌ Não foi possível iniciar o backend (${error.code || error.name}): ${error.message}`);
    }
    try { await disconnect(); } catch { /* Preserve the original startup error. */ }
    setExitCode(existing ? 0 : 1);
    return null;
  }
}

module.exports = { startHttpServer };
