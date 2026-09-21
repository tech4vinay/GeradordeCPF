/**
 * Implementações de referência por linguagem.
 *
 * Todas seguem a mesma estrutura da nossa `cpf.ts`: uma função de dígito verificador
 * com peso posicional, usada duas vezes. É o que mantém o código curto e sem repetir
 * a tabela de pesos.
 */

export interface Snippet {
  slug: string;
  nome: string;
  /** Nome do arquivo sugerido, mostrado no topo do bloco. */
  arquivo: string;
  /** Nota sobre uma armadilha específica da linguagem, quando existe. */
  nota?: string;
  validar: string;
  gerar: string;
  uso: string;
}

export const SNIPPETS: Snippet[] = [
  {
    slug: 'javascript',
    nome: 'JavaScript',
    arquivo: 'cpf.js',
    nota: 'Funciona igual no Node e no navegador. Não depende de nenhum pacote.',
    validar: `export function validarCPF(valor) {
  const cpf = String(valor ?? '').replace(/\\D/g, '');

  // Precisa ter 11 dígitos e não pode ser uma sequência repetida.
  // Atenção: 111.111.111-11 passa no módulo 11, por isso o teste explícito.
  if (cpf.length !== 11) return false;
  if (/^(\\d)\\1{10}$/.test(cpf)) return false;

  // Peso posicional: com n = 9 os pesos vão de 10 a 2; com n = 10, de 11 a 2.
  const dv = (n) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(cpf[i]) * (n + 1 - i);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return dv(9) === Number(cpf[9]) && dv(10) === Number(cpf[10]);
}`,
    gerar: `export function gerarCPF() {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const dv = (digitos) => {
    const soma = digitos.reduce((acc, d, i) => acc + d * (digitos.length + 1 - i), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = dv(base);
  const d2 = dv([...base, d1]);
  return [...base, d1, d2].join('');
}`,
    uso: `validarCPF('111.444.777-35'); // true
validarCPF('111.111.111-11'); // false
gerarCPF();                   // '52998224725'`,
  },

  {
    slug: 'typescript',
    nome: 'TypeScript',
    arquivo: 'cpf.ts',
    nota: 'Mesma lógica do JavaScript, com os tipos declarados.',
    validar: `export function validarCPF(valor: string | null | undefined): boolean {
  const cpf = String(valor ?? '').replace(/\\D/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\\d)\\1{10}$/.test(cpf)) return false;

  const dv = (n: number): number => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(cpf[i]) * (n + 1 - i);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return dv(9) === Number(cpf[9]) && dv(10) === Number(cpf[10]);
}`,
    gerar: `export function gerarCPF(): string {
  const base: number[] = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10),
  );

  const dv = (digitos: number[]): number => {
    const soma = digitos.reduce((acc, d, i) => acc + d * (digitos.length + 1 - i), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = dv(base);
  const d2 = dv([...base, d1]);
  return [...base, d1, d2].join('');
}`,
    uso: `validarCPF('111.444.777-35'); // true
validarCPF(null);             // false
gerarCPF();                   // '52998224725'`,
  },

  {
    slug: 'python',
    nome: 'Python',
    arquivo: 'cpf.py',
    nota: 'Só biblioteca padrão. Testado em Python 3.9+.',
    validar: `import re


def validar_cpf(valor: str) -> bool:
    cpf = re.sub(r"\\D", "", str(valor or ""))

    # 11 dígitos e nada de sequências repetidas — elas passam no módulo 11.
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False

    # Peso posicional: n=9 usa pesos de 10 a 2; n=10, de 11 a 2.
    def dv(n: int) -> int:
        soma = sum(int(cpf[i]) * (n + 1 - i) for i in range(n))
        resto = soma % 11
        return 0 if resto < 2 else 11 - resto

    return dv(9) == int(cpf[9]) and dv(10) == int(cpf[10])`,
    gerar: `import random


def gerar_cpf() -> str:
    base = [random.randint(0, 9) for _ in range(9)]

    def dv(digitos: list[int]) -> int:
        soma = sum(d * (len(digitos) + 1 - i) for i, d in enumerate(digitos))
        resto = soma % 11
        return 0 if resto < 2 else 11 - resto

    d1 = dv(base)
    d2 = dv(base + [d1])
    return "".join(map(str, base + [d1, d2]))`,
    uso: `validar_cpf("111.444.777-35")  # True
validar_cpf("111.111.111-11")  # False
gerar_cpf()                    # '52998224725'`,
  },

  {
    slug: 'php',
    nome: 'PHP',
    arquivo: 'Cpf.php',
    nota: 'PHP 7.4+. Sem dependência de extensão além da PCRE, que já vem habilitada.',
    validar: `<?php

function validarCpf(?string $valor): bool
{
    $cpf = preg_replace('/\\D/', '', (string) $valor);

    // 11 dígitos e nada de sequências repetidas.
    if (strlen($cpf) !== 11 || preg_match('/^(\\d)\\1{10}$/', $cpf)) {
        return false;
    }

    // Peso posicional: n=9 usa pesos de 10 a 2; n=10, de 11 a 2.
    $dv = static function (int $n) use ($cpf): int {
        $soma = 0;
        for ($i = 0; $i < $n; $i++) {
            $soma += (int) $cpf[$i] * ($n + 1 - $i);
        }
        $resto = $soma % 11;

        return $resto < 2 ? 0 : 11 - $resto;
    };

    return $dv(9) === (int) $cpf[9] && $dv(10) === (int) $cpf[10];
}`,
    gerar: `<?php

function gerarCpf(): string
{
    $base = [];
    for ($i = 0; $i < 9; $i++) {
        $base[] = random_int(0, 9);
    }

    $dv = static function (array $digitos): int {
        $soma = 0;
        $total = count($digitos);
        foreach ($digitos as $i => $d) {
            $soma += $d * ($total + 1 - $i);
        }
        $resto = $soma % 11;

        return $resto < 2 ? 0 : 11 - $resto;
    };

    $d1 = $dv($base);
    $d2 = $dv(array_merge($base, [$d1]));

    return implode('', array_merge($base, [$d1, $d2]));
}`,
    uso: `validarCpf('111.444.777-35'); // true
validarCpf('111.111.111-11'); // false
gerarCpf();                   // '52998224725'`,
  },

  {
    slug: 'java',
    nome: 'Java',
    arquivo: 'Cpf.java',
    nota: 'Java 8+. Repare no `\\\\D` com duas barras: em Java a regex vive dentro de uma String.',
    validar: `public final class Cpf {

    private Cpf() {
    }

    public static boolean valido(String valor) {
        if (valor == null) {
            return false;
        }
        String cpf = valor.replaceAll("\\\\D", "");

        // 11 dígitos e nada de sequências repetidas.
        if (cpf.length() != 11 || cpf.chars().distinct().count() == 1) {
            return false;
        }

        return dv(cpf, 9) == cpf.charAt(9) - '0'
            && dv(cpf, 10) == cpf.charAt(10) - '0';
    }

    // Peso posicional: n=9 usa pesos de 10 a 2; n=10, de 11 a 2.
    private static int dv(String cpf, int n) {
        int soma = 0;
        for (int i = 0; i < n; i++) {
            soma += (cpf.charAt(i) - '0') * (n + 1 - i);
        }
        int resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }
}`,
    gerar: `import java.security.SecureRandom;

public final class GeradorCpf {

    private static final SecureRandom RANDOM = new SecureRandom();

    private GeradorCpf() {
    }

    public static String gerar() {
        int[] digitos = new int[11];
        for (int i = 0; i < 9; i++) {
            digitos[i] = RANDOM.nextInt(10);
        }

        digitos[9] = dv(digitos, 9);
        digitos[10] = dv(digitos, 10);

        StringBuilder sb = new StringBuilder(11);
        for (int d : digitos) {
            sb.append(d);
        }
        return sb.toString();
    }

    private static int dv(int[] digitos, int n) {
        int soma = 0;
        for (int i = 0; i < n; i++) {
            soma += digitos[i] * (n + 1 - i);
        }
        int resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }
}`,
    uso: `Cpf.valido("111.444.777-35"); // true
Cpf.valido("111.111.111-11"); // false
GeradorCpf.gerar();           // "52998224725"`,
  },

  {
    slug: 'csharp',
    nome: 'C#',
    arquivo: 'Cpf.cs',
    nota: 'C# 8+ / .NET Core 3.1+. Use `RandomNumberGenerator` se precisar de aleatoriedade criptográfica.',
    validar: `using System;
using System.Linq;
using System.Text.RegularExpressions;

public static class Cpf
{
    public static bool Valido(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            return false;

        var cpf = Regex.Replace(valor, @"\\D", "");

        // 11 dígitos e nada de sequências repetidas.
        if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
            return false;

        return Dv(cpf, 9) == cpf[9] - '0'
            && Dv(cpf, 10) == cpf[10] - '0';
    }

    // Peso posicional: n=9 usa pesos de 10 a 2; n=10, de 11 a 2.
    private static int Dv(string cpf, int n)
    {
        var soma = 0;
        for (var i = 0; i < n; i++)
            soma += (cpf[i] - '0') * (n + 1 - i);

        var resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }
}`,
    gerar: `using System;
using System.Linq;

public static class GeradorCpf
{
    private static readonly Random Random = new Random();

    public static string Gerar()
    {
        var digitos = new int[11];
        for (var i = 0; i < 9; i++)
            digitos[i] = Random.Next(10);

        digitos[9] = Dv(digitos, 9);
        digitos[10] = Dv(digitos, 10);

        return string.Concat(digitos);
    }

    private static int Dv(int[] digitos, int n)
    {
        var soma = 0;
        for (var i = 0; i < n; i++)
            soma += digitos[i] * (n + 1 - i);

        var resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }
}`,
    uso: `Cpf.Valido("111.444.777-35"); // true
Cpf.Valido("111.111.111-11"); // false
GeradorCpf.Gerar();           // "52998224725"`,
  },
];

export const bySlug = (slug: string) => SNIPPETS.find((s) => s.slug === slug);
