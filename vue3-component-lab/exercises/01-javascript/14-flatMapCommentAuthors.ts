export type TaskWithComments = {
  id: number
  comments: Array<{ author: string }>
}

export function flatMapCommentAuthors(tasks: TaskWithComments[]) {
  // TODO: use flatMap to return all comment authors in one flat array
  return []
}
