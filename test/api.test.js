const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const Devotional = require('../src/models/Devotional');

let server;
let baseUrl;
let originalCreate;
let originalFind;
let originalRandom;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;

  originalCreate = Devotional.create;
  originalFind = Devotional.find;
  originalRandom = Math.random;
});

test.after(async () => {
  Devotional.create = originalCreate;
  Devotional.find = originalFind;
  Math.random = originalRandom;
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

test.beforeEach(() => {
  Devotional.create = originalCreate;
  Devotional.find = originalFind;
  Math.random = originalRandom;
});

test('GET / deve retornar mensagem de boas-vindas', async () => {
  const response = await fetch(`${baseUrl}/`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.message, 'Bem vindo a API de Devocionais');
});

test('POST /api deve criar conteúdo com mapa de temas e moods', async () => {
  let payloadRecebido;
  Devotional.create = async (payload) => {
    payloadRecebido = payload;
    return { _id: 'abc123' };
  };

  const response = await fetch(`${baseUrl}/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      themes: {
        fe: {
          moods: {
            ansioso: [{ txt: 'Confie no Senhor.' }],
          },
        },
      },
    }),
  });

  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.message._id, 'abc123');
  assert.ok(payloadRecebido.themes instanceof Map);
  assert.deepEqual(payloadRecebido.themes.get('fe').moods.get('ansioso'), [{ txt: 'Confie no Senhor.' }]);
});

test('GET /api deve retornar um documento (conteúdo com devocionais) aleatório', async () => {
  Devotional.find = async () => [{ id: 1 }, { id: 2 }];
  Math.random = () => 0;

  const response = await fetch(`${baseUrl}/api`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.message, { id: 1 });
  assert.ok(typeof body.ip === 'string');
});

test('GET /api/src deve validar parâmetros obrigatórios', async () => {
  const response = await fetch(`${baseUrl}/api/src`);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.match(body.erro, /theme e mood/);
});

test('GET /api/src deve retornar 404 quando conteúdo não existir', async () => {
  const themes = new Map([
    ['esperanca', [{ moods: new Map([['triste', []]]) }]],
  ]);

  Devotional.find = async () => [{ themes }];
  Math.random = () => 0;

  const response = await fetch(`${baseUrl}/api/src?theme=esperanca&mood=triste`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.message, 'Conteúdo especificado não encontrado');
});

test('GET /api/src deve retornar texto quando encontrar conteúdo', async () => {
  const themes = new Map([
    ['esperanca', [{ moods: new Map([['triste', [{ txt: 'Deus está contigo.' }]]]) }]],
  ]);

  Devotional.find = async () => [{ themes }];
  Math.random = () => 0;

  const response = await fetch(`${baseUrl}/api/src?theme=esperanca&mood=triste`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.message, 'Deus está contigo.');
  assert.ok(typeof body.ip === 'string');
});
