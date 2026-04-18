export function buildCardClasses(isSelected: boolean): string {
  const base = [
    'rounded-2xl',
    'border',
    'border-slate-200',
    'bg-white',
    'p-6',
    'shadow-sm',
    'transition',
  ]

  if (isSelected) {
    base.push('outline-none')
  }

  // TODO: always include `flex`, `flex-col`, `gap-3`
  // TODO: when selected, add `ring-2`, `ring-emerald-500`, `-translate-y-1`
  return base.join(' ')
}
