export function validateRedirectUrl(input: string, origin: string) {
  // TODO: allow same-origin absolute urls
  // TODO: allow relative urls and resolve them against origin
  // TODO: fallback to `${origin}/`
  return `${origin}/`
}
