export type UploadFile = {
  name: string
  size: number
  type: string
}

export function validateUploadFile(file: UploadFile) {
  // TODO: accept only image/png and image/jpeg
  // TODO: reject files above 2MB
  // TODO: return { ok: true } or { ok: false, error: string }
  return { ok: false, error: 'TODO' } as
    | { ok: true }
    | { ok: false; error: string }
}
