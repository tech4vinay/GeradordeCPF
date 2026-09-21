// @ts-check
import { readFileSync } from 'node:fs';

import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Mesmo arquivo que src/lib/site.ts usa para o dateModified do schema: uma data por
// página, editada à mão. Lido com readFileSync porque o carregador de config do Astro
// não passa por import attributes de JSON.
const ATUALIZADO = JSON.parse(
  readFileSync(new URL('./src/lib/atualizado.json', import.meta.url), 'utf8'),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://cpfaleatorio.com',

  // Extensionless URLs: `/validar-cpf`, never `/validar-cpf/`.
  // `format: 'file'` emits validar-cpf.html; Cloudflare Pages serves it at /validar-cpf
  // and 308s both /validar-cpf/ and /validar-cpf.html to it.
  trailingSlash: 'never',
  build: { format: 'file' },

  integrations: [
    sitemap({
      // O sitemap emite a URL canônica (sem .html, sem barra final), então a chave
      // do mapa de datas é o pathname já normalizado.
      serialize(item) {
        const caminho = new URL(item.url).pathname.replace(/\/+$/, '') || '/';
        const lastmod = ATUALIZADO[caminho];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],

  // Astro gera os hashes dos scripts inline (o de tema, que precisa ser síncrono
  // para não piscar) e emite a meta CSP. Sem isso, script-src 'self' bloquearia.
  // frame-ancestors não vale em <meta>: fica no _headers, junto do X-Frame-Options.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // O gtag cai no transporte por pixel de imagem quando fetch/beacon falha; sem
        // o google-analytics aqui o hit é bloqueado sem erro visível.
        "img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com",
        "font-src 'self'",
        "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com",
        "form-action 'none'",
        "base-uri 'self'",
      ],
      // static.cloudflareinsights.com: o Cloudflare injeta esse beacon direto na resposta
      // quando Web Analytics está ligado no painel — sem isso aqui, a CSP bloqueia o
      // script silenciosamente (erro só aparece no console, não quebra a página).
      scriptDirective: {
        resources: [
          "'self'",
          'https://www.googletagmanager.com',
          'https://static.cloudflareinsights.com',
        ],
      },
    },
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: [400, 500, 600],
      fallbacks: ['Inter', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400, 500],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
