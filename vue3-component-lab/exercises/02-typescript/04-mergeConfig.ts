export type ViewConfig = {
  pageSize: number
  theme: 'light' | 'dark'
  dense: boolean
}

export function mergeConfig(
  defaults: ViewConfig,
  overrides: Partial<ViewConfig>,
): ViewConfig {
  // TODO: merge and return a ViewConfig
  return defaults
}
