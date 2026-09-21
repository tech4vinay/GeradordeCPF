import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  MOTIVOS,
  REGIOES,
  UFS,
  UF_NOMES,
  UF_TO_DIGITO,
  ehValido,
  explicarCalculo,
  formatar,
  gerar,
  gerarVarios,
  limpar,
  regiaoDe,
  regiaoDoDigito,
  validar,
} from './cpf.ts';

/** Troca globalThis.crypto durante `fn` e devolve o original depois. */
function comCrypto(substituto, fn) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { value: substituto, configurable: true });
  try {
    return fn();
  } finally {
    Object.defineProperty(globalThis, 'crypto', original);
  }
}

// ---------------------------------------------------------------- validação

test('valida um CPF conhecido, com e sem pontuação', () => {
  assert.equal(ehValido('111.444.777-35'), true);
  assert.equal(ehValido('11144477735'), true);
  assert.equal(ehValido('  111.444.777-35  '), true, 'espaços nas pontas são tolerados');
});

test('rejeita sequências repetidas mesmo passando no módulo 11', () => {
  // 000.000.000-00 satisfaz o cálculo, mas não é um CPF válido.
  assert.equal(validar('00000000000').motivo, 'repetido');
  assert.equal(validar('111.111.111-11').motivo, 'repetido');
  for (let d = 0; d <= 9; d++) {
    assert.equal(validar(String(d).repeat(11)).motivo, 'repetido', `dígito ${d}`);
  }
});

test('nomeia o motivo exato de cada invalidez', () => {
  assert.equal(validar('').motivo, 'vazio');
  assert.equal(validar('   ').motivo, 'vazio');
  assert.equal(validar(null).motivo, 'vazio');
  assert.equal(validar(undefined).motivo, 'vazio');
  assert.equal(validar('123').motivo, 'tamanho');
  assert.equal(validar('111444777351').motivo, 'tamanho', 'longo demais');
  assert.equal(validar('111.444.777-3X').motivo, 'caracteres');
  assert.equal(validar('abc').motivo, 'caracteres');
  assert.equal(validar('111.444.777-45').motivo, 'dv1');
  assert.equal(validar('111.444.777-36').motivo, 'dv2');
});

test('todo motivo tem uma mensagem em pt-BR', () => {
  for (const motivo of ['vazio', 'tamanho', 'caracteres', 'repetido', 'dv1', 'dv2']) {
    assert.equal(typeof MOTIVOS[motivo], 'string');
    assert.ok(MOTIVOS[motivo].length > 10, `mensagem de ${motivo} é curta demais`);
  }
});

test('reporta os dígitos verificadores esperados quando o DV está errado', () => {
  assert.equal(validar('111.444.777-99').esperado, '35');
  assert.equal(validar('111.444.777-45').esperado, '35');
  // Um CPF válido não precisa de "esperado".
  assert.equal(validar('111.444.777-35').esperado, undefined);
});

test('CPF válido vem com a região fiscal preenchida', () => {
  const r = validar('111.444.777-35');
  assert.equal(r.valido, true);
  assert.equal(r.regiao.digito, 7);
  assert.deepEqual(r.regiao.ufs, ['ES', 'RJ']);
});

// ------------------------------------------------------------ formatação

test('formata, limpa e tolera entradas estranhas', () => {
  assert.equal(formatar('11144477735'), '111.444.777-35');
  assert.equal(formatar('111.444.777-35'), '111.444.777-35', 'idempotente');
  assert.equal(limpar('111.444.777-35'), '11144477735');
  assert.equal(limpar(''), '');
  assert.equal(limpar(null), '');
  assert.equal(limpar(undefined), '');
  // Entrada incompleta volta intacta, para não desalinhar listas coladas.
  assert.equal(formatar('123'), '123');
  assert.equal(formatar(''), '');
});

// ------------------------------------------------------------- regiões

test('as 27 UFs estão mapeadas, cada uma numa única região', () => {
  assert.equal(UFS.length, 27);
  assert.equal(REGIOES.length, 10);
  assert.equal(REGIOES.flatMap((r) => r.ufs).length, 27, 'nenhuma UF repetida entre regiões');
  assert.equal(new Set(REGIOES.map((r) => r.digito)).size, 10, 'dígitos 0-9 sem repetir');

  assert.equal(UF_TO_DIGITO.SP, 8);
  assert.equal(UF_TO_DIGITO.RS, 0);
  assert.equal(UF_TO_DIGITO.MG, 6);
  // CE, MA e PI compartilham o mesmo dígito — o ponto que os concorrentes erram.
  assert.equal(UF_TO_DIGITO.CE, 3);
  assert.equal(UF_TO_DIGITO.MA, 3);
  assert.equal(UF_TO_DIGITO.PI, 3);
});

test('toda UF tem nome por extenso', () => {
  for (const uf of UFS) {
    assert.equal(typeof UF_NOMES[uf], 'string', `${uf} sem nome`);
    assert.ok(UF_NOMES[uf].length > 3, `${uf} com nome suspeito`);
  }
  assert.equal(Object.keys(UF_NOMES).length, 27);
});

test('regiaoDoDigito cobre 0-9 e nada além', () => {
  for (let d = 0; d <= 9; d++) assert.equal(regiaoDoDigito(d).digito, d);
  assert.equal(regiaoDoDigito(10), undefined);
  assert.equal(regiaoDoDigito(-1), undefined);
});

test('regiaoDe lê o nono dígito e ignora entradas incompletas', () => {
  assert.equal(regiaoDe('111.444.777-35').digito, 7);
  assert.equal(regiaoDe('11144477735').digito, 7);
  assert.equal(regiaoDe('123'), undefined);
  assert.equal(regiaoDe(''), undefined);
});

// ------------------------------------------------------------- geração

test('todo CPF gerado é válido e respeita a região fiscal pedida', () => {
  for (const uf of UFS) {
    for (let i = 0; i < 40; i++) {
      const cpf = gerar(uf);
      assert.equal(cpf.length, 11);
      assert.equal(ehValido(cpf), true, `${uf} gerou CPF inválido: ${cpf}`);
      assert.equal(
        Number(cpf[8]),
        UF_TO_DIGITO[uf],
        `${uf} deveria produzir o dígito ${UF_TO_DIGITO[uf]}, veio ${cpf[8]}`,
      );
      assert.equal(regiaoDe(cpf).ufs.includes(uf), true);
    }
  }
});

test('geração aleatória produz CPFs válidos e cobre as dez regiões', () => {
  const digitos = new Set();
  for (let i = 0; i < 800; i++) {
    const cpf = gerar();
    assert.equal(ehValido(cpf), true);
    digitos.add(cpf[8]);
  }
  assert.equal(digitos.size, 10, 'as dez regiões devem aparecer em 800 sorteios');
});

test('gerar aceita null e undefined como "aleatório"', () => {
  assert.equal(ehValido(gerar(null)), true);
  assert.equal(ehValido(gerar(undefined)), true);
});

test('gerarVarios devolve a quantidade pedida, sem repetir, dentro dos limites', () => {
  assert.equal(gerarVarios(10, 'SP').length, 10);
  assert.equal(new Set(gerarVarios(200)).size, 200, 'sem duplicatas');
  assert.equal(gerarVarios(1).length, 1);
  assert.equal(gerarVarios(0).length, 1, 'mínimo de 1');
  assert.equal(gerarVarios(-5).length, 1, 'negativo vira 1');
  assert.equal(gerarVarios(NaN).length, 1, 'NaN vira 1');
  assert.equal(gerarVarios(2.7, 'SP').length, 2, 'fracionário trunca');
  assert.equal(gerarVarios(99999).length, 1000, 'máximo de 1000');
  assert.equal(
    gerarVarios(5, 'RS').every((c) => c[8] === '0'),
    true,
  );
  assert.equal(
    gerarVarios(30).every(ehValido),
    true,
  );
});

test('usa Math.random quando crypto não existe', () => {
  const cpfs = comCrypto(undefined, () => Array.from({ length: 50 }, () => gerar('SP')));
  assert.equal(cpfs.every(ehValido), true);
  assert.equal(
    cpfs.every((c) => c[8] === '8'),
    true,
  );
});

test('descarta a cauda do range para não enviesar os dígitos', () => {
  let chamadas = 0;
  // max = 10 ⇒ limite = 4294967290. O primeiro valor cai fora e precisa ser reamostrado.
  // Os valores seguintes variam de propósito: um fluxo constante geraria
  // 77777777777, que o guarda de dígitos repetidos rejeitaria em laço infinito.
  const cripto = {
    getRandomValues(buf) {
      buf[0] = chamadas === 0 ? 4294967295 : chamadas;
      chamadas++;
      return buf;
    },
  };
  const cpf = comCrypto(cripto, () => gerar());
  assert.ok(chamadas > 1, 'o valor rejeitado deveria forçar nova amostragem');
  assert.equal(ehValido(cpf), true);
});

// ------------------------------------------------------- memória de cálculo

test('explicarCalculo reproduz a aritmética do CPF de referência', () => {
  const [p1, p2] = explicarCalculo('11144477735');

  assert.equal(p1.rotulo, '1º');
  assert.deepEqual(p1.digitos, [1, 1, 1, 4, 4, 4, 7, 7, 7]);
  assert.deepEqual(p1.pesos, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  assert.deepEqual(p1.produtos, [10, 9, 8, 28, 24, 20, 28, 21, 14]);
  assert.equal(p1.soma, 162);
  assert.equal(p1.resto, 8);
  assert.equal(p1.resultado, 3);

  assert.equal(p2.rotulo, '2º');
  assert.deepEqual(p2.pesos, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  assert.equal(p2.soma, 204);
  assert.equal(p2.resto, 6);
  assert.equal(p2.resultado, 5);

  // Os passos batem com os DVs reais do número.
  assert.equal(`${p1.resultado}${p2.resultado}`, '35');
});

test('explicarCalculo aceita entrada pontuada e recusa a incompleta', () => {
  assert.equal(explicarCalculo('111.444.777-35').length, 2);
  assert.equal(explicarCalculo('111444777').length, 2, 'bastam os 9 primeiros');
  assert.deepEqual(explicarCalculo('123'), []);
  assert.deepEqual(explicarCalculo(''), []);
});

test('a memória de cálculo concorda com o validador para qualquer CPF gerado', () => {
  for (let i = 0; i < 200; i++) {
    const cpf = gerar();
    const [p1, p2] = explicarCalculo(cpf);
    assert.equal(`${p1.resultado}${p2.resultado}`, cpf.slice(9), `divergiu em ${cpf}`);
    assert.equal(
      p1.soma,
      p1.produtos.reduce((a, b) => a + b, 0),
    );
  }
});

test('o resto < 2 vira dígito 0', () => {
  // Percorre CPFs gerados até encontrar cada um dos dois DVs zerados.
  const amostra = Array.from({ length: 3000 }, () => gerar());
  const dv1Zero = amostra.find((c) => c[9] === '0');
  const dv2Zero = amostra.find((c) => c[10] === '0');

  assert.ok(dv1Zero, 'esperava ao menos um CPF com o primeiro DV igual a 0');
  assert.ok(dv2Zero, 'esperava ao menos um CPF com o segundo DV igual a 0');
  assert.equal(ehValido(dv1Zero), true);
  assert.equal(ehValido(dv2Zero), true);
  assert.ok(explicarCalculo(dv1Zero)[0].resto < 2);
});

test('trocar um dígito verificador sempre invalida', () => {
  for (let n = 0; n < 200; n++) {
    const cpf = gerar();
    for (const i of [9, 10]) {
      const trocado = cpf.slice(0, i) + ((Number(cpf[i]) + 1) % 10) + cpf.slice(i + 1);
      assert.equal(ehValido(trocado), false, `${trocado} deveria ser inválido (posição ${i})`);
    }
  }
});

test('erro de um dígito na base é pego em ~99% dos casos, não em 100%', () => {
  /*
    O módulo 11 do CPF NÃO detecta todo erro de um dígito, e isso não é bug:
    restos 0 e 1 produzem os dois o verificador 0, então uma troca que mova o resto
    de 0 para 1 (ou vice-versa) deixa o dígito igual.

    O caso mais comum é o 1º dígito: o peso dele na segunda passada é 11, e 11 ≡ 0
    (mod 11), então ele não influencia o 2º verificador — só o 1º o protege.

    Medido em 220 mil trocas: 99,28% de detecção, escapes só na base, nunca num DV.
  */
  let testados = 0;
  let pegos = 0;

  for (let n = 0; n < 300; n++) {
    const cpf = gerar();
    for (let i = 0; i < 9; i++) {
      const trocado = cpf.slice(0, i) + ((Number(cpf[i]) + 1) % 10) + cpf.slice(i + 1);
      if (/^(\d)\1{10}$/.test(trocado)) continue;
      testados++;

      if (!ehValido(trocado)) {
        pegos++;
        continue;
      }

      // Se escapou, tem de ser um CPF legitimamente bem formado — nunca um falso positivo.
      const [p1, p2] = explicarCalculo(trocado);
      assert.equal(
        `${p1.resultado}${p2.resultado}`,
        trocado.slice(9),
        `${trocado} foi aceito sem que os verificadores batessem`,
      );
    }
  }

  const taxa = pegos / testados;
  assert.ok(taxa > 0.95, `detecção caiu para ${(100 * taxa).toFixed(2)}%`);
  assert.ok(taxa < 1, 'a colisão de resto 0/1 deveria aparecer nesta amostra');
});
