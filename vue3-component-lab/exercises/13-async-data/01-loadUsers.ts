export type User = {
  id: number
  name: string
}

export type LoadUsersResult = {
  state: 'success' | 'error'
  data: User[]
  error: string
}

export async function loadUsers(
  fetcher: () => Promise<User[]>,
): Promise<LoadUsersResult> {
  // TODO: call fetcher in try/catch
  // TODO: on success return { state: 'success', data, error: '' }
  // TODO: on failure return { state: 'error', data: [], error: '加载用户失败' }
  return {
    state: 'error',
    data: [],
    error: 'TODO',
  }
}
