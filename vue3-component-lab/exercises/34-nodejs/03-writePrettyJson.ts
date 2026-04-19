import { writeFile } from 'node:fs/promises'

export async function writePrettyJson(filePath: string, value: unknown) {
  // TODO: write pretty JSON with two-space indentation and a trailing newline
  await writeFile(filePath, '')
}
