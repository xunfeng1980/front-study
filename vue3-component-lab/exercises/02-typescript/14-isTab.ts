export const tabs = ['overview', 'members', 'activity']

export type Tab = string

export function isTab(value: string): value is Tab {
  // TODO: use as const on tabs
  // TODO: derive Tab from tabs
  // TODO: return true when value is one of tabs
  return false
}
