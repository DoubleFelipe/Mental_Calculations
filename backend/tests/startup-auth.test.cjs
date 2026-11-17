'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const { startHttpServer } = require('../src/services/serverStartup');
const { createGoogleCallback } = require('../src/middleware/googleOAuth');

function options(app, port, environment = 'development') {
  const result = { messages: [], closed: false, exit: null };
  return { result, args: {
    app, port, environment,
    connect: async () => {},
    disconnect: async () => { result.closed = true; },
    logger: { log: message => result.messages.push(message), error: message => result.messages.push(message) },
    setExitCode: code => { result.exit = code; },
  } };
}

test('startup listens normally on an available port', async t => {
  const app = { listen: port => http.createServer((req, res) => res.end('ok')).listen(port) };
  const { args, result } = options(app, 0);
  const server = await startHttpServer(args);
  t.after(() => new Promise(resolve => server.close(resolve)));
  assert.ok(server.listening);
  assert.equal(result.closed, false);
  assert.equal(result.exit, null);
});

for (const scenario of [
  { name: 'duplicate development API exits cleanly and preserves the running server', own: true, env: 'development', exit: 0 },
  { name: 'unrelated service on the port reports a startup failure', own: false, env: 'development', exit: 1 },
  { name: 'production treats a port conflict as a failure', own: true, env: 'production', exit: 1 },
]) {
  test(scenario.name, async t => {
    const existing = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'ok', service: scenario.own ? 'Mental Calculations API' : 'Other API' }));
    }).listen(0);
    await once(existing, 'listening');
    t.after(() => new Promise(resolve => existing.close(resolve)));
    const app = { listen: port => http.createServer().listen(port) };
    const { args, result } = options(app, existing.address().port, scenario.env);
    assert.equal(await startHttpServer(args), null);
    assert.equal(result.exit, scenario.exit);
    assert.equal(result.closed, true);
    assert.ok(existing.listening);
    assert.equal(result.messages.length, 1);
  });
}

test('connection failure is handled before attempting to listen', async () => {
  const { args, result } = options({ listen() { assert.fail('must not listen'); } }, 3001);
  args.connect = async () => { throw Object.assign(new Error('connection failed'), { code: 'ECONNREFUSED' }); };
  assert.equal(await startHttpServer(args), null);
  assert.equal(result.closed, true);
  assert.equal(result.exit, 1);
});

function oauthFixture(error, user) {
  const state = { warning: null, redirect: null, success: false, forwardedUser: null };
  const passport = { authenticate(strategy, options, callback) {
    assert.equal(strategy, 'google');
    assert.equal(options.session, false);
    return () => callback(error, user);
  } };
  const handler = createGoogleCallback(passport, req => { state.success = true; state.forwardedUser = req.user; }, 'http://localhost:5173', { warn: message => { state.warning = message; } });
  handler({}, { redirect: url => { state.redirect = url; } }, () => assert.fail('unexpected error forwarding'));
  return state;
}

test('OAuth network errors return to login without leaking tokens or reaching the success controller', () => {
  const state = oauthFixture({ name: 'InternalOAuthError', oauthError: { code: 'EACCES', message: 'secret-token', data: 'client-secret' } });
  assert.equal(state.success, false);
  assert.equal(state.redirect, 'http://localhost:5173/auth/callback?error=google_auth_failed');
  assert.match(state.warning, /EACCES/);
  assert.doesNotMatch(state.warning, /secret-token|client-secret/);
});

test('OAuth provider denial returns safely to login', () => {
  const state = oauthFixture(null, false);
  assert.equal(state.success, false);
  assert.equal(state.warning, null);
  assert.match(state.redirect, /google_auth_failed/);
});

test('OAuth success preserves the existing authenticated user and JWT controller', () => {
  const user = { id: 42, name: 'Jogador' };
  const state = oauthFixture(null, user);
  assert.equal(state.success, true);
  assert.equal(state.forwardedUser, user);
  assert.equal(state.redirect, null);
});
