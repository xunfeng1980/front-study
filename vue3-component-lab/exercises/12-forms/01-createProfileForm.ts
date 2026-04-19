export type ProfileForm = {
  name: string
  email: string
  role: 'engineer' | 'designer' | 'pm'
  agreeToTerms: boolean
  skills: string[]
}

export function createProfileForm(): ProfileForm {
  // TODO: return the default empty form
  return {
    name: 'TODO',
    email: 'TODO',
    role: 'designer',
    agreeToTerms: true,
    skills: ['TODO'],
  }
}
