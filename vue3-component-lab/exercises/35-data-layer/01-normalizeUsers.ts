export type User = {
  id: number
  name: string
}

export function normalizeUsers(users: User[]) {
  // TODO: return { byId, allIds }
  // TODO: byId should be keyed by user.id
  return {
    byId: {},
    allIds: [],
  }
}
