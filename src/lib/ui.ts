/**
 * Classes compartilhadas do sistema Geist (DESIGN.md).
 *
 * Constantes em vez de componentes wrapper: os elementos são <button>/<input> nativos,
 * então só a aparência precisa ser reaproveitada.
 *
 * A linguagem de raio é bimodal: 6px (rounded-sm) para chrome funcional,
 * pill para CTA de marketing.
 */

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50';

/** Botão preto principal — a ação primária de cada ferramenta. */
export const BTN = `${base} h-10 bg-ink px-4 text-on-ink hover:bg-ink/85`;

/** Botão branco com hairline — ações secundárias. */
export const BTN_GHOST = `${base} h-10 border border-hairline bg-elevated px-4 text-ink hover:bg-hairline-soft`;

export const INPUT =
  'h-10 w-full rounded-sm border border-hairline bg-elevated px-3 text-sm text-ink placeholder:text-faint';

export const SELECT = `${INPUT} appearance-none bg-[position:right_0.6rem_center] bg-no-repeat pr-9`;

export const LABEL = 'mb-1.5 block text-sm font-medium text-ink';

/** Card branco com hairline — o tile padrão do sistema. */
export const CARD = 'rounded-md border border-hairline bg-elevated';

export const HINT = 'mt-1.5 text-xs text-mute';
