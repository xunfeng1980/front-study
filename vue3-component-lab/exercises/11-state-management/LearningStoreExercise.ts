import { defineStore } from 'pinia'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    // TODO: add `completedIds: [] as string[]`
    // TODO: add `sessionMinutes: 0`
  }),

  getters: {
    // TODO: add `completionCount`
  },

  actions: {
    markDone(id: string) {
      // TODO: if the id is not already completed, push it
    },

    addMinutes(minutes = 15) {
      // TODO: add minutes to sessionMinutes
    },
  },
})
