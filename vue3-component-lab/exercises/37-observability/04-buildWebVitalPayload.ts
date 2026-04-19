export type WebVitalMetric = {
  name: 'LCP' | 'CLS' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export function buildWebVitalPayload(metric: WebVitalMetric, route: string) {
  // TODO: return { metric: metric.name, value: metric.value, rating: metric.rating, route }
  return {}
}
