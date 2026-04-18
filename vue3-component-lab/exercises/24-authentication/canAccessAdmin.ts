export type SessionUser = {
  role: 'admin' | 'editor' | 'viewer'
  suspended: boolean
}

export function canAccessAdmin(user: SessionUser) {
  // TODO: only admin can access
  // TODO: suspended users can never access
  return false
}
