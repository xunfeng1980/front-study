export type UpdateState = {
  installingState: 'installing' | 'installed' | 'activating'
  hasController: boolean
}

export function shouldPromptForRefresh(update: UpdateState): boolean {
  // TODO: return true only when
  // installingState === 'installed' && hasController === true
  return false
}
