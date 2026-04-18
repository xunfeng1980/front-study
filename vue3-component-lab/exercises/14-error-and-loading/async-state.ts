export type AsyncState = 'idle' | 'loading' | 'success' | 'error'

export type AsyncView = {
  tone: 'neutral' | 'accent' | 'danger'
  label: string
}

export function resolveAsyncView(
  state: AsyncState,
  errorMessage = '',
): AsyncView {
  // TODO: handle all 4 states
  // idle    -> { tone: 'neutral', label: '等待开始' }
  // loading -> { tone: 'accent',  label: '加载中...' }
  // success -> { tone: 'accent',  label: '请求成功' }
  // error   -> { tone: 'danger',  label: errorMessage || '请求失败' }
  return {
    tone: 'neutral',
    label: 'TODO',
  }
}
