export function createAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24) {
  // TODO: return an object with
  // httpOnly: true
  // secure: true
  // sameSite: 'lax'
  // path: '/'
  // maxAge: maxAgeSeconds
  return {
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
    path: '',
    maxAge: 0,
  }
}
