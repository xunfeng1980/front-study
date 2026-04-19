export function destructureProfile(profile: {
  name: string
  role: string
  stats: { tasks: number }
}) {
  // TODO: use object destructuring
  // TODO: return `${name}:${role}:${tasks}`
  const { name, role, stats: { tasks } } = profile
  return `${name}:${role}:${tasks}`
}
