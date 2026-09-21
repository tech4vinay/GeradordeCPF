import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PRIMEIROS_NOMES, SOBRENOMES, gerarNome, gerarNomes } from './nomes.ts';

test('as listas de nomes e sobrenomes não estão vazias', () => {
  assert.ok(PRIMEIROS_NOMES.length > 0);
  assert.ok(SOBRENOMES.length > 0);
});

test('gerarNome devolve "Primeiro Sobrenome" a partir das listas', () => {
  const nome = gerarNome();
  const [primeiro, ...resto] = nome.split(' ');
  assert.ok(PRIMEIROS_NOMES.includes(primeiro));
  assert.ok(SOBRENOMES.includes(resto.join(' ')));
});

test('gerarNomes devolve a quantidade pedida', () => {
  assert.equal(gerarNomes(5).length, 5);
  assert.equal(gerarNomes(0).length, 0);
});
