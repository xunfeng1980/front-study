export type ApiUser = {
  id: number
  name: string
  role: 'admin' | 'member'
  createdAt: string
  updatedAt: string
}

export type EditableUser = ApiUser

export function toEditableUser(user: ApiUser): EditableUser {
  // TODO: make EditableUser use Omit to remove createdAt and updatedAt
  // TODO: return an object without createdAt and updatedAt
  return user
}
