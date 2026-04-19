export function sanitizeHtmlPolicy(input: string) {
  // TODO: remove <script>...</script> blocks
  // TODO: remove inline on* event handlers such as onclick=""
  return input
}
