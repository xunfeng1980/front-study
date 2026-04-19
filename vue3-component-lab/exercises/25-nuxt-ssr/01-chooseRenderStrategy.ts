export type RenderInput = {
  seoCritical: boolean
  personalized: boolean
  liveData: boolean
}

export function chooseRenderStrategy(input: RenderInput) {
  // TODO: seoCritical and not personalized -> 'ssr'
  // TODO: liveData and not seoCritical -> 'csr'
  // TODO: otherwise -> 'ssg'
  return 'csr'
}
