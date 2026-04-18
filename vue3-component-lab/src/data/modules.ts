export type ModuleId =
  | 'components'
  | 'lifecycle'
  | 'css'
  | 'async'
  | 'router'
  | 'store'
  | 'realtime'
  | 'collaboration'

export type StudyModule = {
  id: ModuleId
  path: string
  title: string
  description: string
}

export type StudyStep = {
  step: 1 | 2 | 3 | 4
  title: string
  path: string
  goal: string
  tasks: string[]
}

export const studyModules: StudyModule[] = [
  {
    id: 'components',
    path: '/components',
    title: '组件拆分',
    description: '从责任边界而不是从页面块切组件。',
  },
  {
    id: 'lifecycle',
    path: '/lifecycle',
    title: '生命周期',
    description: '反复感受 mount、update、unmount 的真实顺序。',
  },
  {
    id: 'css',
    path: '/css',
    title: 'CSS 练习',
    description: '练布局、状态样式和层级，而不是只会调颜色。',
  },
  {
    id: 'async',
    path: '/async',
    title: '异步状态',
    description: '把 loading、error、success 当成一等公民。',
  },
  {
    id: 'router',
    path: '/router',
    title: 'Vue Router',
    description: '理解路径参数、查询参数和页面切换。',
  },
  {
    id: 'store',
    path: '/store',
    title: 'Pinia',
    description: '练 state、getter、action 和跨页面共享状态。',
  },
  {
    id: 'realtime',
    path: '/realtime',
    title: 'SSE / WebSocket',
    description: '把 AI 常见的流式响应和双向消息都摸一遍。',
  },
  {
    id: 'collaboration',
    path: '/collab-todos',
    title: 'Yjs 协同 Todo',
    description: '把 WebSocket、presence、共享文档串成一个完整小应用。',
  },
]

export const studySteps: StudyStep[] = [
  {
    step: 1,
    title: '先练组件拆分',
    path: '/components',
    goal: '先建立父子组件、props、emit 的边界感。',
    tasks: [
      '看父组件为什么持有数据源。',
      '看子组件为什么只负责展示和抛事件。',
      '手动改一个字段，感受组件边界怎么变化。',
    ],
  },
  {
    step: 2,
    title: '再看生命周期',
    path: '/lifecycle',
    goal: '让状态变化顺序从概念变成直觉。',
    tasks: [
      '先点修改 props，观察 watch 和更新顺序。',
      '再卸载子组件，观察 unmount 前后钩子。',
      '重新挂载，比较首次执行和更新执行。',
    ],
  },
  {
    step: 3,
    title: '集中补 CSS',
    path: '/css',
    goal: '专门补布局、状态样式和留白层级。',
    tasks: [
      '先切换 grid 和 stack 布局。',
      '再调卡片 active、hover 的状态差异。',
      '最后自己加一个断点，练响应式。',
    ],
  },
  {
    step: 4,
    title: '最后做应用化',
    path: '/router',
    goal: '把单组件思维扩展到异步、路由和全局状态。',
    tasks: [
      '先看 async 页面，理解 loading 和 error。',
      '再看 router，理解 params、query 和地址栏状态。',
      '最后看 pinia，理解共享状态和 action。',
    ],
  },
]
