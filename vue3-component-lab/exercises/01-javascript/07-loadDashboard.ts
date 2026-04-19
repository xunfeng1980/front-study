export async function loadDashboard(
  fetchSummary: () => Promise<{ projects: number }>,
  fetchTasks: () => Promise<Array<{ id: number }>>,
) {
  // TODO: use Promise.all
  // TODO: return { summary, tasks }
  return { summary: null, tasks: [] }
}
