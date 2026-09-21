import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { LINGUAGENS, NAV, RODAPE, SITE, caminhoCanonico, urlCanonica } from './site.ts';
import { SNIPPETS, bySlug } from './snippets.ts';
import { BTN, BTN_GHOST, CARD, HINT, INPUT, LABEL, SELECT } from './ui.ts';

test('caminhoCanonico tira .html e barra final', () => {
  // build.format: 'file' faz o pathname virar /foo.html no build e /foo no dev.
  assert.equal(caminhoCanonico('/o-que-e-cpf.html'), '/o-que-e-cpf');
  assert.equal(caminhoCanonico('/o-que-e-cpf'), '/o-que-e-cpf');
  assert.equal(caminhoCanonico('/o-que-e-cpf/'), '/o-que-e-cpf');
  assert.equal(caminhoCanonico('/codigo/python.html'), '/codigo/python');
  assert.equal(caminhoCanonico('/codigo/python///'), '/codigo/python');
});

test('caminhoCanonico normaliza a home para /', () => {
  assert.equal(caminhoCanonico('/'), '/');
  assert.equal(caminhoCanonico(''), '/');
  assert.equal(caminhoCanonico('/index.html'), '/');
  assert.equal(caminhoCanonico('///'), '/');
});

test('urlCanonica é absoluta e nunca tem barra final, exceto na home', () => {
  assert.equal(urlCanonica('/'), `${SITE.url}/`);
  assert.equal(urlCanonica('/index.html'), `${SITE.url}/`);
  assert.equal(urlCanonica('/o-que-e-cpf.html'), `${SITE.url}/o-que-e-cpf`);
  assert.equal(urlCanonica('/codigo/php/'), `${SITE.url}/codigo/php`);

  for (const p of ['/sobre', '/termos.html', '/codigo/java/']) {
    const u = urlCanonica(p);
    assert.ok(u.startsWith('https://'), `${u} deveria ser absoluta`);
    assert.ok(!u.endsWith('/'), `${u} não deveria terminar em barra`);
  }
});

test('os metadados do site estão preenchidos', () => {
  assert.equal(SITE.idioma, 'pt-BR');
  assert.equal(SITE.url, `https://${SITE.dominio}`);
  assert.ok(!SITE.url.endsWith('/'), 'SITE.url não pode ter barra final');
  // Meta description fora de 50–160 caracteres é truncada ou ignorada pelo Google.
  assert.ok(
    SITE.descricao.length >= 50 && SITE.descricao.length <= 160,
    `descrição com ${SITE.descricao.length} caracteres`,
  );
});

test('a meta description de cada página cabe em 155 caracteres', () => {
  // Google corta por volta de 155–160 caracteres; acima disso o trecho final (que
  // costuma carregar o diferencial da página) fica truncado no SERP.
  const paginasDir = fileURLToPath(new URL('../pages', import.meta.url));
  const arquivos = readdirSync(paginasDir).filter((f) => f.endsWith('.astro'));
  let checadas = 0;

  for (const arquivo of arquivos) {
    const conteudo = readFileSync(`${paginasDir}/${arquivo}`, 'utf8');
    const match = conteudo.match(/const descricao =\s*\n?\s*'([^']+)'/);
    if (!match) continue;
    checadas++;
    assert.ok(
      match[1].length <= 155,
      `${arquivo}: descrição com ${match[1].length} caracteres`,
    );
  }

  assert.ok(checadas >= 10, 'esperava encontrar as descrições das páginas');
});

test('todo link de navegação é interno, sem barra final', () => {
  const links = [...NAV, ...RODAPE.flatMap((g) => g.links)];
  assert.ok(links.length > 10);

  for (const { href, rotulo } of links) {
    assert.ok(href.startsWith('/'), `${href} deveria ser relativo à raiz`);
    assert.ok(href === '/' || !href.endsWith('/'), `${href} não deveria terminar em barra`);
    assert.ok(!href.endsWith('.html'), `${href} não deveria expor .html`);
    assert.ok(rotulo.trim().length > 0, `${href} sem rótulo`);
  }
});

test('o validador e o formatador apontam para páginas próprias', () => {
  // Cada ferramenta tem página dedicada, com URL própria e conteúdo de SEO — a home
  // mantém as três em abas (Ferramentas.astro) só como atalho, endereçado por hash.
  const links = [...NAV, ...RODAPE.flatMap((g) => g.links)];
  const paginas = ['/validador-de-cpf', '/formatador-de-cpf'];

  for (const pagina of paginas) {
    assert.ok(
      links.some((l) => l.href === pagina),
      `falta link para ${pagina} no menu ou rodapé`,
    );
  }
});

test('o rodapé cobre as abas de código e as páginas legais', () => {
  // /codigo/{slug} não existe mais como página própria: as linguagens vivem em abas
  // de uma única página, endereçadas por hash (mesmo padrão de gerar/validar/formatar).
  const hrefs = RODAPE.flatMap((g) => g.links.map((l) => l.href));
  for (const l of LINGUAGENS) assert.ok(hrefs.includes(`/codigo#${l.slug}`), `falta ${l.slug}`);
  for (const p of ['/sobre', '/privacidade', '/termos']) {
    assert.ok(hrefs.includes(p), `falta ${p}`);
  }
  assert.equal(new Set(hrefs).size, hrefs.length, 'links repetidos no rodapé');
});

test('LINGUAGENS e SNIPPETS descrevem exatamente o mesmo conjunto', () => {
  // As páginas vêm de SNIPPETS via getStaticPaths; o rodapé, de LINGUAGENS.
  // Se divergirem, o rodapé aponta para um 404.
  assert.deepEqual(
    LINGUAGENS.map((l) => l.slug).sort(),
    SNIPPETS.map((s) => s.slug).sort(),
  );
  for (const l of LINGUAGENS) assert.equal(bySlug(l.slug).nome, l.nome);
  assert.equal(bySlug('cobol'), undefined);
});

test('todo snippet traz validação, geração, uso e nome de arquivo', () => {
  for (const s of SNIPPETS) {
    assert.ok(s.validar.length > 100, `${s.slug}: validar curto demais`);
    assert.ok(s.gerar.length > 100, `${s.slug}: gerar curto demais`);
    assert.ok(s.uso.length > 10, `${s.slug}: uso curto demais`);
    assert.ok(s.arquivo.includes('.'), `${s.slug}: arquivo sem extensão`);
    assert.ok(/^[a-z]+$/.test(s.slug), `${s.slug}: slug fora do padrão da URL`);
  }
});

test('todo snippet trata as duas armadilhas do algoritmo', () => {
  for (const s of SNIPPETS) {
    const codigo = s.validar;
    // Rejeição de dígitos repetidos: sem isso, 111.111.111-11 passa.
    assert.ok(
      /\\1\{10\}|repeat|distinct|Distinct|cpf\[0\]/.test(codigo),
      `${s.slug} não rejeita sequências repetidas`,
    );
    // Caso resto < 2 ⇒ dígito 0, que sozinho responde por ~1/3 dos CPFs válidos.
    assert.ok(/< 2|resto < 2/.test(codigo), `${s.slug} não trata o resto menor que 2`);
    assert.ok(/11 - |11 − /.test(codigo), `${s.slug} não usa 11 menos o resto`);
  }
});

test('as classes de UI compartilhadas não estão vazias', () => {
  for (const [nome, valor] of Object.entries({
    BTN,
    BTN_GHOST,
    CARD,
    HINT,
    INPUT,
    LABEL,
    SELECT,
  })) {
    assert.equal(typeof valor, 'string', `${nome} deveria ser string`);
    assert.ok(valor.trim().length > 0, `${nome} está vazia`);
  }
  // Os botões herdam a mesma base, então mudanças de foco/disabled valem para todos.
  assert.ok(BTN_GHOST.includes('rounded-sm') && BTN.includes('rounded-sm'));
});
