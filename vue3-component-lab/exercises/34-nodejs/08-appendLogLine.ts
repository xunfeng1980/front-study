import { appendFile } from 'node:fs/promises'

export async function appendLogLine(filePath: string, line: string) {
  // TODO: append the line plus a trailing newline
  await appendFile(filePath, '')
}
