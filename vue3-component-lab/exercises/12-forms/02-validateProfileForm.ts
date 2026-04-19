export type ProfileForm = {
  name: string
  email: string
  role: 'engineer' | 'designer' | 'pm'
  agreeToTerms: boolean
  skills: string[]
}

export type ProfileFormErrors = Partial<
  Record<'name' | 'email' | 'agreeToTerms', string>
>

export function validateProfileForm(form: ProfileForm): ProfileFormErrors {
  // TODO: return `name` error when the trimmed name is empty
  // TODO: return `email` error when email does not include `@`
  // TODO: return `agreeToTerms` error when agreeToTerms is false
  return {}
}
