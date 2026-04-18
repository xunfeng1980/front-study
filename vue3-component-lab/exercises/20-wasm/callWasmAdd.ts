export type WasmAddInstance = {
  exports: {
    add?: (left: number, right: number) => number
  }
}

export function callWasmAdd(
  instance: WasmAddInstance,
  left: number,
  right: number,
) {
  // TODO: throw `new Error('missing add export')` when add does not exist
  // TODO: otherwise call instance.exports.add(left, right)
  return 0
}
