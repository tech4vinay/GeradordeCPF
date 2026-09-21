/**
 * CPF (Cadastro de Pessoas Físicas) — geração, validação e formatação.
 *
 * Um CPF tem 11 dígitos: 8 dígitos de série + 1 dígito de região fiscal + 2 dígitos
 * verificadores calculados em módulo 11.
 *
 * Tudo aqui é função pura, sem DOM — o mesmo módulo roda no build, no browser e nos testes.
 */

export type UF =
  | 'AC' | 'AL' | 'AM' | 'AP' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO'
  | 'MA' | 'MG' | 'MS' | 'MT' | 'PA' | 'PB' | 'PE' | 'PI' | 'PR'
  | 'RJ' | 'RN' | 'RO' | 'RR' | 'RS' | 'SC' | 'SE' | 'SP' | 'TO';

export interface Regiao {
  /** Nono dígito do CPF. */
  digito: number;
  /** Nome oficial da região fiscal da Receita Federal. */
  nome: string;
  ufs: UF[];
}

/**
 * O nono dígito identifica a REGIÃO FISCAL, não o estado. Vários estados
 * compartilham o mesmo dígito — CE, MA e PI produzem 3; só SP produz 8.
 */
export const REGIOES: readonly Regiao[] = [
  { digito: 1, nome: '1ª Região Fiscal', ufs: ['DF', 'GO', 'MS', 'MT', 'TO'] },
  { digito: 2, nome: '2ª Região Fiscal', ufs: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR'] },
  { digito: 3, nome: '3ª Região Fiscal', ufs: ['CE', 'MA', 'PI'] },
  { digito: 4, nome: '4ª Região Fiscal', ufs: ['AL', 'PB', 'PE', 'RN'] },
  { digito: 5, nome: '5ª Região Fiscal', ufs: ['BA', 'SE'] },
  { digito: 6, nome: '6ª Região Fiscal', ufs: ['MG'] },
  { digito: 7, nome: '7ª Região Fiscal', ufs: ['ES', 'RJ'] },
  { digito: 8, nome: '8ª Região Fiscal', ufs: ['SP'] },
  { digito: 9, nome: '9ª Região Fiscal', ufs: ['PR', 'SC'] },
  { digito: 0, nome: '10ª Região Fiscal', ufs: ['RS'] },
];

export const UF_TO_DIGITO: Readonly<Record<UF, number>> = Object.fromEntries(
  REGIOES.flatMap((r) => r.ufs.map((uf) => [uf, r.digito])),
) as Record<UF, number>;

/** As 27 UFs em ordem alfabética. */
export const UFS: readonly UF[] = (Object.keys(UF_TO_DIGITO) as UF[]).sort();

export function regiaoDoDigito(digito: number): Regiao | undefined {
  return REGIOES.find((r) => r.digito === digito);
}

/** Região fiscal de um CPF, a partir do nono dígito. */
export function regiaoDe(cpf: string): Regiao | undefined {
  const d = limpar(cpf);
  return d.length === 11 ? regiaoDoDigito(Number(d[8])) : undefined;
}

/**
 * Dígito verificador em módulo 11.
 *
 * O peso é posicional, então a mesma função serve para os dois DVs: com 9 dígitos
 * os pesos vão de 10 a 2, com 10 dígitos vão de 11 a 2.
 */
function dv(digitos: number[]): number {
  const soma = digitos.reduce((acc, n, i) => acc + n * (digitos.length + 1 - i), 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/** Remove tudo que não for dígito. */
export function limpar(cpf: string): string {
  return (cpf ?? '').replace(/\D/g, '');
}

/** 12345678909 vira 123.456.789-09. Entradas incompletas voltam sem alteração. */
export function formatar(cpf: string): string {
  const d = limpar(cpf);
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export type MotivoInvalido =
  | 'vazio'
  | 'tamanho'
  | 'caracteres'
  | 'repetido'
  | 'dv1'
  | 'dv2';

export interface Resultado {
  valido: boolean;
  motivo?: MotivoInvalido;
  /** Dígitos verificadores corretos para a base informada — usado para explicar o erro. */
  esperado?: string;
  regiao?: Regiao;
}

/** Mensagens em pt-BR para cada motivo de invalidez. */
export const MOTIVOS: Readonly<Record<MotivoInvalido, string>> = {
  vazio: 'Nenhum número informado.',
  tamanho: 'O CPF precisa ter exatamente 11 dígitos.',
  caracteres: 'O CPF contém caracteres que não são números, pontos ou hífen.',
  repetido:
    'Sequências com todos os dígitos iguais (como 111.111.111-11) são rejeitadas, mesmo passando no cálculo do módulo 11.',
  dv1: 'O primeiro dígito verificador não confere.',
  dv2: 'O segundo dígito verificador não confere.',
};

/**
 * Valida um CPF e explica o motivo quando ele é inválido.
 *
 * Aceita a entrada com ou sem pontuação. Sequências repetidas são rejeitadas
 * explicitamente: 000.000.000-00 passa no módulo 11, mas não é um CPF válido.
 */
export function validar(entrada: string): Resultado {
  const bruto = (entrada ?? '').trim();
  if (!bruto) return { valido: false, motivo: 'vazio' };

  // Só toleramos os separadores usuais do CPF.
  if (/[^\d.\-\s]/.test(bruto)) return { valido: false, motivo: 'caracteres' };

  const d = limpar(bruto);
  if (d.length !== 11) return { valido: false, motivo: 'tamanho' };
  if (/^(\d)\1{10}$/.test(d)) return { valido: false, motivo: 'repetido' };

  const nums = [...d].map(Number);
  const dv1 = dv(nums.slice(0, 9));
  const dv2 = dv([...nums.slice(0, 9), dv1]);
  const esperado = `${dv1}${dv2}`;

  if (nums[9] !== dv1) return { valido: false, motivo: 'dv1', esperado };
  if (nums[10] !== dv2) return { valido: false, motivo: 'dv2', esperado };

  return { valido: true, regiao: regiaoDoDigito(nums[8]) };
}

/** Atalho booleano para quando o motivo não importa. */
export function ehValido(cpf: string): boolean {
  return validar(cpf).valido;
}

function randomInt(max: number): number {
  // crypto existe no browser e no Node 22+; Math.random cobre o resto.
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === 'function') {
    const buf = new Uint32Array(1);
    // Descarta a cauda do range para não enviesar os dígitos.
    const limite = Math.floor(4294967296 / max) * max;
    let v: number;
    do {
      c.getRandomValues(buf);
      v = buf[0];
    } while (v >= limite);
    return v % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * Gera um CPF válido, opcionalmente da região fiscal de uma UF.
 *
 * Retorna os 11 dígitos sem pontuação — use formatar() para pontuar.
 */
export function gerar(uf?: UF | null): string {
  const digitoRegiao = uf ? UF_TO_DIGITO[uf] : randomInt(10);

  for (;;) {
    const base = Array.from({ length: 8 }, () => randomInt(10));
    base.push(digitoRegiao);

    const dv1 = dv(base);
    const dv2 = dv([...base, dv1]);
    const cpf = [...base, dv1, dv2].join('');

    // Um CPF todo repetido é inválido; a chance é ~1 em 10^8, mas o descarte é barato.
    if (!/^(\d)\1{10}$/.test(cpf)) return cpf;
  }
}

/** Gera `quantidade` CPFs distintos (limite de 1000 por vez). */
export function gerarVarios(quantidade: number, uf?: UF | null): string[] {
  const n = Math.max(1, Math.min(1000, Math.floor(quantidade) || 1));
  const vistos = new Set<string>();
  while (vistos.size < n) vistos.add(gerar(uf));
  return [...vistos];
}

export interface PassoCalculo {
  /** Rótulo do dígito verificador: "1º" ou "2º". */
  rotulo: string;
  digitos: number[];
  pesos: number[];
  produtos: number[];
  soma: number;
  resto: number;
  resultado: number;
}

/**
 * Detalha a aritmética do módulo 11 para os dois dígitos verificadores.
 * Alimenta o painel "como foi calculado".
 */
export function explicarCalculo(cpf: string): PassoCalculo[] {
  const nums = [...limpar(cpf)].map(Number).slice(0, 9);
  if (nums.length !== 9) return [];

  const passo = (digitos: number[], rotulo: string): PassoCalculo => {
    const pesos = digitos.map((_, i) => digitos.length + 1 - i);
    const produtos = digitos.map((n, i) => n * pesos[i]);
    const soma = produtos.reduce((a, b) => a + b, 0);
    const resto = soma % 11;
    return { rotulo, digitos, pesos, produtos, soma, resto, resultado: resto < 2 ? 0 : 11 - resto };
  };

  const p1 = passo(nums, '1º');
  const p2 = passo([...nums, p1.resultado], '2º');
  return [p1, p2];
}

/** Nome por extenso de cada UF, para os rótulos do seletor. */
export const UF_NOMES: Readonly<Record<UF, string>> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso',
  PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', PR: 'Paraná',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima',
  RS: 'Rio Grande do Sul', SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo',
  TO: 'Tocantins',
};
