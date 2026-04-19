export function buildInputAria(options: {
  invalid: boolean
  descriptionId: string
  errorId: string
}) {
  // TODO: always set aria-describedby to descriptionId
  // TODO: when invalid, set aria-invalid true and append errorId to aria-describedby
  return {
    'aria-describedby': '',
  }
}
