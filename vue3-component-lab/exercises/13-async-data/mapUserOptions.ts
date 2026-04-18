export type ApiUser = {
  id: number
  profile: {
    displayName: string
  }
}

export type UserOption = {
  label: string
  value: string
}

export function mapUserOptions(users: ApiUser[]): UserOption[] {
  // TODO: map every user into
  // { label: user.profile.displayName, value: String(user.id) }
  return []
}
