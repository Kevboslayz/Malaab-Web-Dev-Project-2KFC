// Shared Tailwind class strings, copied from the design pack (components.html).
// One place to change a button or badge instead of six.

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const sizeNormal = 'px-5 py-2.5 text-sm'
export const sizeSmall = 'px-3.5 py-1.5 text-xs'

export const primaryButton =
  buttonBase + ' bg-brand-400 text-[#06120C] hover:bg-brand-300 focus-visible:outline-brand-400'
export const secondaryButton =
  buttonBase + ' border border-line bg-surface text-ink hover:border-brand-500'
export const ghostButton = buttonBase + ' text-muted hover:bg-surface hover:text-ink'
export const dangerButton = buttonBase + ' bg-red-500 text-[#140404] hover:bg-red-400'

const badgeBase =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset'

export const badgeOpen = badgeBase + ' bg-brand-500/15 text-brand-300 ring-brand-500/40'
export const badgeOneSpot = badgeBase + ' bg-accent-400/15 text-accent-300 ring-accent-400/40'
export const badgeYouAreIn = badgeBase + ' bg-brand-400 text-[#06120C] ring-brand-400'
export const badgeQueue = badgeBase + ' bg-accent-300/15 text-accent-200 ring-accent-300/40'
export const badgeOrganising = badgeBase + ' bg-brand-500/20 text-brand-200 ring-brand-500/50'
export const badgeMuted = badgeBase + ' bg-ink/10 text-muted ring-line'
export const badgeCancelled = badgeBase + ' bg-red-500/15 text-red-300 ring-red-500/40'

export const fieldLabel = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-muted'

const inputBase =
  'w-full rounded-lg border bg-[#0E1A14] px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:ring-4'
export const inputValid = inputBase + ' border-line focus:border-brand-400 focus:ring-brand-500/25'
export const inputInvalid = inputBase + ' border-red-500 focus:border-red-400 focus:ring-red-500/25'

export const hintText = 'text-xs text-muted'
export const errorText = 'text-xs font-semibold text-red-300'

export const pageTitle =
  'font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink'
