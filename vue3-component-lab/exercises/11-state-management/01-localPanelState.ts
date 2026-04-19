export type PanelTab = 'overview' | 'details'

export type PanelState = {
  activeTab: PanelTab
  collapsed: boolean
}

export function createPanelState(): PanelState {
  // TODO: return the default state
  // activeTab -> 'overview'
  // collapsed -> false
  return {
    activeTab: 'details',
    collapsed: true,
  }
}

export function setActiveTab(state: PanelState, tab: PanelTab) {
  // TODO: update state.activeTab
}

export function toggleCollapsed(state: PanelState) {
  // TODO: flip state.collapsed
}
