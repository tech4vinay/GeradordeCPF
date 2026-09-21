// O import attribute é obrigatório: o runner de testes do Node carrega este módulo como
// ESM nativo, e sem ele o import de JSON falha (ERR_IMPORT_ATTRIBUTE_MISSING).
import ATUALIZADO from './atualizado.json' with { type: 'json' };

export const SITE = {
  nome: 'Gerador de CPF Aleatório',
  dominio: 'cpfaleatorio.com',
  url: 'https://cpfaleatorio.com',
  email: 'contato@cpfaleatorio.com',
  descricao:
    'Gerador de CPF aleatório e válido: gere, valide e formate CPFs para testes de software. Grátis, sem cadastro e sem enviar nada para servidor.',
  idioma: 'pt-BR',
} as const;

/**
 * `@id` estáveis do grafo JSON-LD sitewide, emitido uma única vez pelo Base.astro.
 * As páginas referenciam por id em vez de repetir o nó inteiro.
 */
export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

/**
 * Data da última mudança relevante de cada página, em ISO 8601.
 *
 * Fonte única: alimenta o `dateModified` do schema e o `lastmod` do sitemap
 * (lido direto do JSON pelo astro.config.mjs). Duas cópias divergiriam, e um
 * `lastmod` que muda a cada build sem o conteúdo mudar é sinal que o Google
 * aprende a ignorar — por isso a data é editada à mão, não gerada.
 */
export function atualizadoEm(caminho: string): string {
  return (ATUALIZADO as Record<string, string>)[caminho] ?? ATUALIZADO['/'];
}

/**
 * A mesma data em português, para o "Última atualização" visível nas páginas legais.
 *
 * Deriva de `atualizadoEm` de propósito: uma data escrita à mão no texto e outra no
 * schema divergem no primeiro dia em que alguém edita só uma das duas.
 */
export function dataLegivel(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export const NAV = [
  { href: '/', rotulo: 'Gerador' },
  { href: '/validador-de-cpf', rotulo: 'Validador' },
  { href: '/formatador-de-cpf', rotulo: 'Formatador' },
  { href: '/como-validar-cpf', rotulo: 'Algoritmo' },
  { href: '/codigo', rotulo: 'Código' },
] as const;

export const LINGUAGENS = [
  { slug: 'javascript', nome: 'JavaScript' },
  { slug: 'typescript', nome: 'TypeScript' },
  { slug: 'python', nome: 'Python' },
  { slug: 'php', nome: 'PHP' },
  { slug: 'java', nome: 'Java' },
  { slug: 'csharp', nome: 'C#' },
] as const;

export const RODAPE = [
  {
    titulo: 'Ferramentas',
    links: [
      { href: '/', rotulo: 'Gerador de CPF' },
      { href: '/validador-de-cpf', rotulo: 'Validador de CPF' },
      { href: '/formatador-de-cpf', rotulo: 'Formatador de CPF' },
    ],
  },
  {
    titulo: 'Aprenda',
    links: [
      { href: '/como-validar-cpf', rotulo: 'Como validar um CPF' },
      { href: '/o-que-e-cpf', rotulo: 'O que é CPF' },
      { href: '/perguntas-frequentes', rotulo: 'Perguntas frequentes' },
    ],
  },
  {
    titulo: 'Código',
    links: LINGUAGENS.map((l) => ({ href: `/codigo#${l.slug}`, rotulo: `Validar CPF em ${l.nome}` })),
  },
  {
    titulo: 'Site',
    links: [
      { href: '/sobre', rotulo: 'Sobre' },
      { href: '/privacidade', rotulo: 'Privacidade' },
      { href: '/termos', rotulo: 'Termos de uso' },
    ],
  },
] as const;

/**
 * Normaliza um pathname para a forma canônica do site: sem `.html` e sem barra final.
 *
 * Necessário porque `build.format: 'file'` faz `Astro.url.pathname` virar `/foo.html`
 * no build, enquanto no dev ele é `/foo`.
 */
export function caminhoCanonico(pathname: string): string {
  const limpo = pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  return limpo || '/';
}

export function urlCanonica(pathname: string): string {
  const caminho = caminhoCanonico(pathname);
  return caminho === '/' ? `${SITE.url}/` : `${SITE.url}${caminho}`;
}
