export type ServiceWorkerContainerLike = {
  register: (swPath: string) => Promise<{ scope: string }>
}

export type NavigatorLike = {
  serviceWorker?: ServiceWorkerContainerLike
}

export async function registerServiceWorker(
  navigatorLike: NavigatorLike,
  swPath = '/sw.js',
) {
  // TODO: if navigatorLike.serviceWorker does not exist, return null
  // TODO: otherwise call navigatorLike.serviceWorker.register(swPath)
  return null
}
