export function buildUploadState(progress: number) {
  // TODO: progress <= 0 -> idle
  // TODO: progress between 1 and 99 -> uploading
  // TODO: progress >= 100 -> success
  return 'idle'
}
