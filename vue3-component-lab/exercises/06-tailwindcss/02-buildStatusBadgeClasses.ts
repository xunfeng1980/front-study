export type Presence = 'online' | 'offline'

export function buildStatusBadgeClasses(presence: Presence): string {
  const base = [
    'inline-flex',
    'items-center',
    'rounded-full',
    'px-3',
    'py-1',
    'text-xs',
    'font-semibold',
  ]

  if (presence === 'online') {
    base.push('uppercase')
  }

  // TODO: for `online`, add `bg-emerald-100` and `text-emerald-700`
  // TODO: for `offline`, add `bg-slate-200` and `text-slate-600`
  return base.join(' ')
}
