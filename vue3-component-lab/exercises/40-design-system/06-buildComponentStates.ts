export function buildComponentStates(input: {
  disabled: boolean
  loading: boolean
  invalid: boolean
}) {
  // TODO: return { ariaDisabled, dataState, dataInvalid }
  // TODO: loading has higher priority than default
  return {
    ariaDisabled: 'false',
    dataState: 'idle',
    dataInvalid: 'false',
  }
}
