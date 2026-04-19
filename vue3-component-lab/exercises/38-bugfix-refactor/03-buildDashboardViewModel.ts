export function buildDashboardViewModel(input: {
  summary: { totalIssues: number; resolvedIssues: number }
  members: Array<{ id: number; name: string }>
}) {
  // TODO: return { issueSummary, memberOptions }
  // TODO: issueSummary should look like `resolved/total`
  // TODO: memberOptions should be [{ label, value }]
  return {
    issueSummary: '',
    memberOptions: [],
  }
}
