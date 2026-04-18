import { defineStore } from 'pinia'
import { studyModules, type ModuleId } from '../data/modules'

type ReviewItem = {
  id: string
  title: string
  note: string
}

function createInitialReviewQueue(): ReviewItem[] {
  return [
    {
      id: 'css-layout',
      title: 'CSS 布局',
      note: '优先练 grid、flex、gap，不要继续靠 margin 拼布局。',
    },
    {
      id: 'lifecycle-order',
      title: '生命周期顺序',
      note: '把 watch、mount、unmount 的触发关系练到有直觉。',
    },
    {
      id: 'component-boundary',
      title: '组件边界',
      note: '多问一句：这个逻辑应该留在父组件还是下沉到 composable？',
    },
  ]
}

export const useStudyLabStore = defineStore('study-lab', {
  state: () => ({
    completedModules: ['components'] as ModuleId[],
    sessionMinutes: 45,
    reviewQueue: createInitialReviewQueue(),
  }),

  getters: {
    completedCount: (state) => state.completedModules.length,
    completionRate: (state) =>
      Math.round((state.completedModules.length / studyModules.length) * 100),
    nextFocus: (state) => state.reviewQueue[0]?.title ?? '自由练习',
    remainingModules: (state) =>
      studyModules.filter((module) => !state.completedModules.includes(module.id)),
  },

  actions: {
    toggleCompleted(moduleId: ModuleId) {
      if (this.completedModules.includes(moduleId)) {
        this.completedModules = this.completedModules.filter((id) => id !== moduleId)
        return
      }

      this.completedModules = [...this.completedModules, moduleId]
    },

    addSession(minutes = 15) {
      this.sessionMinutes += minutes
    },

    cycleReviewItem() {
      if (this.reviewQueue.length < 2) {
        return
      }

      const [first, ...rest] = this.reviewQueue
      this.reviewQueue = [...rest, first]
    },

    resetProgress() {
      this.completedModules = []
      this.sessionMinutes = 0
      this.reviewQueue = createInitialReviewQueue()
    },
  },
})
