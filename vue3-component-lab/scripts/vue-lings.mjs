import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const rootDir = process.cwd()
const stateDir = path.join(os.homedir(), '.vue')
const progressFile = path.join(stateDir, 'vue-lings-progress.json')
const aiConfigFile = path.join(stateDir, 'vue-lings-ai.json')
const legacyProgressFile = path.join(rootDir, '.vue-lings-progress.json')
let progressProjectKey = rootDir

const exerciseCatalog = [
  regexExercise({
    slug: 'components-01-user-badge',
    track: '组件拆分',
    title: '组件拆分 1/2：展示组件接收 props',
    file: 'exercises/07-component-boundary/01-UserBadgeExercise.vue',
    concept: '先补最小的展示组件，掌握 props 和 emits 的基础形状。',
    instructions: [
      '给组件补上 `member` prop。',
      '给组件补上 `toggle` 事件。',
      '点击按钮时发出 `toggle`，参数是 `props.member.id`。',
      '模板里渲染出 `props.member.name` 和 `props.member.role`。',
    ],
    checks: [
      [/member:\s*Member/, '还没有定义 `member: Member` prop。'],
      [/toggle:\s*\[\s*id:\s*number\s*\]/, '还没有定义 `toggle: [id: number]` 事件。'],
      [/emit\(\s*['"]toggle['"]\s*,\s*props\.member\.id\s*\)/, '按钮点击时还没有 emit `toggle`。'],
      [/\{\{\s*props\.member\.name\s*\}\}/, '模板里还没有渲染 `props.member.name`。'],
      [/\{\{\s*props\.member\.role\s*\}\}/, '模板里还没有渲染 `props.member.role`。'],
    ],
  }),
  regexExercise({
    slug: 'components-02-section-shell',
    track: '组件拆分',
    title: '组件拆分 2/2：用 props 和 slots 做壳组件',
    file: 'exercises/07-component-boundary/02-SectionShellExercise.vue',
    concept: '再进一层，用壳组件把结构复用和内容插槽分开。',
    instructions: [
      '补上 `title` 和 `subtitle` props。',
      '在 header 里渲染 `props.title` 和 `props.subtitle`。',
      '渲染名为 `headerActions` 的具名 slot。',
      '渲染默认 slot。',
    ],
    checks: [
      [/title:\s*string/, '还没有定义 `title: string`。'],
      [/subtitle:\s*string/, '还没有定义 `subtitle: string`。'],
      [/\{\{\s*props\.title\s*\}\}/, '还没有渲染 `props.title`。'],
      [/\{\{\s*props\.subtitle\s*\}\}/, '还没有渲染 `props.subtitle`。'],
      [/<slot\s+name=["']headerActions["']\s*\/?>/, '还没有渲染 `headerActions` 具名 slot。'],
      [/<slot\s*\/>|<slot>\s*<\/slot>/, '还没有渲染默认 slot。'],
    ],
  }),
  regexExercise({
    slug: 'dataflow-01-filter-panel',
    track: '单向数据流',
    title: '单向数据流 1/2：子组件只发出更新请求',
    file: 'exercises/08-one-way-data-flow/01-FilterPanelExercise.vue',
    concept: '子组件只消费 props，通过 emit 表达“我想更新”，而不是自己改状态。',
    instructions: [
      '补上 `query`、`selectedTag`、`options` 这三个 props。',
      '补上 `update:query` 和 `update:tag` 两个事件。',
      '在两个 handler 里分别 emit 对应事件。',
    ],
    checks: [
      [/query:\s*string/, '还没有定义 `query: string`。'],
      [/selectedTag:\s*string/, '还没有定义 `selectedTag: string`。'],
      [/options:\s*Option\[\]/, '还没有定义 `options: Option[]`。'],
      [/['"]update:query['"]:\s*\[\s*value:\s*string\s*\]/, '还没有定义 `update:query` 事件。'],
      [/['"]update:tag['"]:\s*\[\s*value:\s*string\s*\]/, '还没有定义 `update:tag` 事件。'],
      [/emit\(\s*['"]update:query['"]\s*,\s*value\s*\)/, '还没有 emit `update:query`。'],
      [/emit\(\s*['"]update:tag['"]\s*,\s*value\s*\)/, '还没有 emit `update:tag`。'],
    ],
  }),
  moduleExercise({
    slug: 'dataflow-02-toggle-task',
    track: '单向数据流',
    title: '单向数据流 2/2：返回新数组而不是直接修改',
    file: 'exercises/08-one-way-data-flow/02-toggleTask.ts',
    concept: '把“变更请求”转换成新数据，这是单向数据流的另一半。',
    instructions: [
      '实现 `toggleTask(tasks, taskId)`。',
      '只切换匹配 id 的任务。',
      '返回新数组，不要直接改原数组。',
    ],
    async validate(_, exercise) {
      const { toggleTask } = await importExerciseModule(exercise.file)
      const source = [
        { id: 1, title: 'A', done: false },
        { id: 2, title: 'B', done: true },
      ]
      const next = toggleTask(source, 1)
      const failures = []

      if (next === source) {
        failures.push('需要返回一个新数组，不能直接返回原数组。')
      }
      if (source[0].done !== false || source[1].done !== true) {
        failures.push('原始数组被修改了，这一题要求保持输入不可变。')
      }
      if (next[0]?.done !== true || next[1]?.done !== true) {
        failures.push('只应该切换 id=1 的任务状态。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'state-01-local-panel',
    track: '状态管理',
    title: '状态管理 1/2：先练最小本地状态',
    file: 'exercises/11-state-management/01-localPanelState.ts',
    concept: '先把最小状态模型想清楚，再谈 store。',
    instructions: [
      '实现 `createPanelState` 默认状态。',
      '实现 `setActiveTab`。',
      '实现 `toggleCollapsed`。',
    ],
    async validate(_, exercise) {
      const module = await importExerciseModule(exercise.file)
      const state = module.createPanelState()
      const failures = []

      if (state.activeTab !== 'overview' || state.collapsed !== false) {
        failures.push('默认状态应该是 `{ activeTab: "overview", collapsed: false }`。')
      }

      module.setActiveTab(state, 'details')
      if (state.activeTab !== 'details') {
        failures.push('`setActiveTab` 还没有正确更新 `activeTab`。')
      }

      module.toggleCollapsed(state)
      if (state.collapsed !== true) {
        failures.push('`toggleCollapsed` 还没有切换 `collapsed`。')
      }

      return failures
    },
  }),
  regexExercise({
    slug: 'state-02-pinia-store',
    track: '状态管理',
    title: '状态管理 2/2：把共享状态收进 Pinia',
    file: 'exercises/11-state-management/02-LearningStoreExercise.ts',
    concept: '全局状态不是“到处都能访问”，而是“集中定义状态、getter 和动作”。',
    instructions: [
      '补上 `completedIds` 和 `sessionMinutes` state。',
      '补上 `completionCount` getter。',
      '实现 `markDone` 和 `addMinutes` action。',
    ],
    checks: [
      [/defineStore\(\s*['"]learning['"]/, '还没有定义 `learning` store。'],
      [/completedIds:\s*\[\]\s+as\s+string\[\]/, '还没有补上 `completedIds`。'],
      [/sessionMinutes:\s*0/, '还没有补上 `sessionMinutes: 0`。'],
      [/completionCount:\s*\(state\)\s*=>\s*state\.completedIds\.length/, '还没有补上 `completionCount` getter。'],
      [/markDone\(id:\s*string\)\s*\{[\s\S]*includes\(id\)[\s\S]*push\(id\)/s, '`markDone` 还没有防重后再 push。'],
      [/addMinutes\(minutes\s*=\s*15\)\s*\{[\s\S]*sessionMinutes\s*\+=\s*minutes/s, '`addMinutes` 还没有累加分钟数。'],
    ],
  }),
  regexExercise({
    slug: 'lifecycle-01-basic-hooks',
    track: '生命周期',
    title: '生命周期 1/2：挂载、卸载和 watch',
    file: 'exercises/09-lifecycle-basic/01-LifecycleHooksExercise.vue',
    concept: '先把 mounted、unmount 和 watch 这几个最常见的点练熟。',
    instructions: [
      '导入并注册 `onMounted`、`onBeforeUnmount`、`onUnmounted`。',
      '给 `props.message` 加一个带 `immediate: true` 的 watch。',
      '按注释里的要求发出对应日志。',
    ],
    checks: [
      [/onMounted\s*\(\s*\(\)\s*=>\s*emit\(\s*['"]log['"]\s*,\s*['"]child -> onMounted['"]\s*\)\s*\)/s, '还没有注册正确的 `onMounted` 日志。'],
      [/onBeforeUnmount\s*\(\s*\(\)\s*=>\s*emit\(\s*['"]log['"]\s*,\s*['"]child -> onBeforeUnmount['"]\s*\)\s*\)/s, '还没有注册正确的 `onBeforeUnmount` 日志。'],
      [/onUnmounted\s*\(\s*\(\)\s*=>\s*emit\(\s*['"]log['"]\s*,\s*['"]child -> onUnmounted['"]\s*\)\s*\)/s, '还没有注册正确的 `onUnmounted` 日志。'],
      [/watch\(\s*\(\)\s*=>\s*props\.message\s*,[\s\S]*emit\(\s*['"]log['"]\s*,\s*['"]child -> watch\(message\)['"]\s*\)[\s\S]*immediate:\s*true[\s\S]*\)/s, '还没有补上带 `immediate: true` 的 watch。'],
    ],
  }),
  regexExercise({
    slug: 'lifecycle-02-polling-cleanup',
    track: '生命周期',
    title: '生命周期 2/2：组件卸载时清理副作用',
    file: 'exercises/10-lifecycle-effects/01-PollingCleanupExercise.vue',
    concept: '真正的生命周期价值，常常体现在副作用的开启和清理上。',
    instructions: [
      '在 `onMounted` 里启动轮询。',
      '每秒让 `ticks.value += 1`。',
      '在 `onUnmounted` 里清理定时器。',
    ],
    checks: [
      [/onMounted\(\s*\(\)\s*=>[\s\S]*setInterval/s, '还没有在 `onMounted` 里启动定时器。'],
      [/ticks\.value\s*\+=\s*1/, '定时器里还没有递增 `ticks.value`。'],
      [/onUnmounted\(\s*\(\)\s*=>[\s\S]*clearInterval\(timer\)/s, '还没有在 `onUnmounted` 里清理定时器。'],
    ],
  }),
  regexExercise({
    slug: 'routing-01-routes',
    track: '路由',
    title: '路由 1/2：先把 routes 配出来',
    file: 'exercises/15-routing/01-routes.ts',
    concept: '路由第一步不是写页面，而是先把 URL 结构设计清楚。',
    instructions: [
      '把 `/` 重定向到 `/start`。',
      '补上 `/components` 路由。',
      '补上 `/store` 路由。',
    ],
    checks: [
      [/path:\s*['"]\/['"][\s\S]*redirect:\s*['"]\/start['"]/s, '还没有把 `/` 重定向到 `/start`。'],
      [/path:\s*['"]\/components['"][\s\S]*name:\s*['"]components['"]/s, '还没有补上 `/components` 路由。'],
      [/path:\s*['"]\/store['"][\s\S]*name:\s*['"]store['"]/s, '还没有补上 `/store` 路由。'],
    ],
  }),
  moduleExercise({
    slug: 'routing-02-build-location',
    track: '路由',
    title: '路由 2/2：拼出 params 和 query',
    file: 'exercises/15-routing/02-buildStudyLocation.ts',
    concept: 'params 更像资源身份，query 更像页面视图状态。',
    instructions: [
      '实现 `buildStudyLocation(topic, panel)`。',
      '返回 `name`、`params`、`query` 三层结构。',
    ],
    async validate(_, exercise) {
      const { buildStudyLocation } = await importExerciseModule(exercise.file)
      const result = buildStudyLocation('guards', 'notes')
      const failures = []

      if (result?.name !== 'router-lab') {
        failures.push('`name` 应该是 `router-lab`。')
      }
      if (result?.params?.topic !== 'guards') {
        failures.push('`params.topic` 没有正确透传。')
      }
      if (result?.query?.panel !== 'notes') {
        failures.push('`query.panel` 没有正确透传。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'forms-01-create-profile-form',
    track: '表单',
    title: '表单 1/2：先把表单模型立住',
    file: 'exercises/12-forms/01-createProfileForm.ts',
    concept: '先有稳定的数据模型，后面校验、提交和重置才不会乱。',
    instructions: [
      '实现 `createProfileForm()`。',
      '返回一个完整的空表单对象。',
    ],
    async validate(_, exercise) {
      const { createProfileForm } = await importExerciseModule(exercise.file)
      const result = createProfileForm()
      const failures = []

      if (result.name !== '' || result.email !== '') {
        failures.push('`name` 和 `email` 的默认值应该是空字符串。')
      }
      if (result.role !== 'engineer') {
        failures.push('默认 `role` 应该是 `engineer`。')
      }
      if (result.agreeToTerms !== false) {
        failures.push('默认 `agreeToTerms` 应该是 `false`。')
      }
      if (!Array.isArray(result.skills) || result.skills.length !== 0) {
        failures.push('默认 `skills` 应该是空数组。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'forms-02-validate-profile-form',
    track: '表单',
    title: '表单 2/2：补最小校验',
    file: 'exercises/12-forms/02-validateProfileForm.ts',
    concept: '表单难点往往不在输入，而在于约束规则和错误映射。',
    instructions: [
      '校验空 name。',
      '校验 email 至少包含 `@`。',
      '校验是否勾选协议。',
    ],
    async validate(_, exercise) {
      const { validateProfileForm } = await importExerciseModule(exercise.file)
      const invalid = validateProfileForm({
        name: '   ',
        email: 'not-an-email',
        role: 'engineer',
        agreeToTerms: false,
        skills: [],
      })
      const valid = validateProfileForm({
        name: 'Mina',
        email: 'mina@example.com',
        role: 'designer',
        agreeToTerms: true,
        skills: [],
      })
      const failures = []

      if (!invalid.name || !invalid.email || !invalid.agreeToTerms) {
        failures.push('无效表单没有返回完整的错误对象。')
      }
      if (Object.keys(valid).length !== 0) {
        failures.push('有效表单应该返回空错误对象。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'async-01-load-users',
    track: '异步数据获取',
    title: '异步数据获取 1/2：统一成功和失败返回',
    file: 'exercises/13-async-data/01-loadUsers.ts',
    concept: '先把请求结果标准化，页面层才好处理。',
    instructions: [
      '实现 `loadUsers(fetcher)`。',
      '成功时返回 success 结构。',
      '失败时返回 error 结构。',
    ],
    async validate(_, exercise) {
      const { loadUsers } = await importExerciseModule(exercise.file)
      const success = await loadUsers(async () => [{ id: 1, name: 'Ada' }])
      const failure = await loadUsers(async () => {
        throw new Error('boom')
      })
      const failures = []

      if (success.state !== 'success' || success.data.length !== 1 || success.error !== '') {
        failures.push('成功分支返回值不对。')
      }
      if (failure.state !== 'error' || failure.data.length !== 0 || failure.error !== '加载用户失败') {
        failures.push('失败分支返回值不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'async-02-map-user-options',
    track: '异步数据获取',
    title: '异步数据获取 2/2：把接口数据映射成 UI 数据',
    file: 'exercises/13-async-data/02-mapUserOptions.ts',
    concept: '接口模型和 UI 模型通常不是一回事，中间要有一层映射。',
    instructions: [
      '实现 `mapUserOptions(users)`。',
      '把接口数据映射成 `{ label, value }`。',
    ],
    async validate(_, exercise) {
      const { mapUserOptions } = await importExerciseModule(exercise.file)
      const result = mapUserOptions([
        { id: 7, profile: { displayName: 'Nora' } },
      ])
      const failures = []

      if (result.length !== 1) {
        failures.push('映射后的数组长度不对。')
      }
      if (result[0]?.label !== 'Nora' || result[0]?.value !== '7') {
        failures.push('映射结果应该是 `{ label: "Nora", value: "7" }`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'errors-01-async-view',
    track: '错误处理与加载态',
    title: '错误处理与加载态 1/2：四态映射',
    file: 'exercises/14-error-and-loading/01-async-state.ts',
    concept: '页面状态不是只有成功态，idle、loading、error 都要有一等公民地位。',
    instructions: [
      '实现 `resolveAsyncView`。',
      '覆盖 4 种异步状态。',
      'error 状态优先返回传入的错误消息，没有时再返回默认值。',
    ],
    async validate(_, exercise) {
      const loaded = await importExerciseModule(exercise.file)
      const actual = loaded.resolveAsyncView
      const cases = [
        ['idle', undefined, { tone: 'neutral', label: '等待开始' }],
        ['loading', undefined, { tone: 'accent', label: '加载中...' }],
        ['success', undefined, { tone: 'accent', label: '请求成功' }],
        ['error', '接口超时', { tone: 'danger', label: '接口超时' }],
        ['error', '', { tone: 'danger', label: '请求失败' }],
      ]
      const failures = []

      for (const [state, message, expected] of cases) {
        const result = actual(state, message)
        if (result?.tone !== expected.tone || result?.label !== expected.label) {
          failures.push(
            `状态 \`${state}\` 的返回值不对，期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(result)}。`,
          )
        }
      }

      return failures
    },
    preChecks: [
      [/switch\s*\(\s*state\s*\)|if\s*\(\s*state\s*===/, '还没有真正根据 `state` 做分支处理。'],
      [/['"]等待开始['"]/, '还没有返回 idle 的文案。'],
      [/['"]加载中\.\.\.['"]/, '还没有返回 loading 的文案。'],
      [/['"]请求成功['"]/, '还没有返回 success 的文案。'],
      [/['"]请求失败['"]/, '还没有处理默认错误文案。'],
    ],
  }),
  moduleExercise({
    slug: 'errors-02-to-error-message',
    track: '错误处理与加载态',
    title: '错误处理与加载态 2/2：把未知错误变成稳定文案',
    file: 'exercises/14-error-and-loading/02-toErrorMessage.ts',
    concept: '错误对象形状很乱，页面层需要稳定的文案出口。',
    instructions: [
      '实现 `toErrorMessage(error)`。',
      '处理 Error、string 和兜底三种情况。',
    ],
    async validate(_, exercise) {
      const { toErrorMessage } = await importExerciseModule(exercise.file)
      const failures = []

      if (toErrorMessage(new Error('network failed')) !== 'network failed') {
        failures.push('Error 分支返回值不对。')
      }
      if (toErrorMessage('timeout') !== 'timeout') {
        failures.push('string 分支返回值不对。')
      }
      if (toErrorMessage({ foo: 'bar' }) !== '未知错误') {
        failures.push('兜底分支返回值不对。')
      }

      return failures
    },
  }),
  regexExercise({
    slug: 'css-01-dashboard-grid',
    track: 'CSS、动画',
    title: 'CSS、动画 1/7：先把布局和断点写对',
    file: 'exercises/03-css-layout/01-dashboard-card.css',
    concept: '先练 grid 和媒体查询，再谈更细的视觉表现。',
    instructions: [
      '把 `.dashboard-grid` 改成三列 grid。',
      '给 `.dashboard-card--active` 加一个上浮效果。',
      '在 720px 以下把 grid 收成一列。',
    ],
    checks: [
      [/\.dashboard-grid\s*\{[\s\S]*display:\s*grid\s*;/s, '`.dashboard-grid` 还没有设置 `display: grid`。'],
      [/\.dashboard-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)\s*;/s, '还没有把 grid 改成三列。'],
      [/\.dashboard-card--active\s*\{[\s\S]*transform:\s*translateY\(-4px\)\s*;/s, 'active 卡片还没有上浮效果。'],
      [/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.dashboard-grid\s*\{[\s\S]*grid-template-columns:\s*1fr\s*;/s, '小屏断点下还没有收成一列。'],
    ],
  }),
  regexExercise({
    slug: 'css-02-fade-up',
    track: 'CSS、动画',
    title: 'CSS、动画 2/7：补最小动效',
    file: 'exercises/04-css-animation/01-fade-up.css',
    concept: '动画不用多，关键是知道什么时候该用 keyframes，什么时候只要 hover transform。',
    instructions: [
      '写出 `fade-up` 关键帧。',
      '让 `.card-enter-active` 使用这段动画。',
      '让 `.cta-button:hover` 微微上浮。',
    ],
    checks: [
      [/@keyframes\s+fade-up/, '还没有定义 `fade-up` 关键帧。'],
      [/@keyframes\s+fade-up\s*\{[\s\S]*opacity:\s*0[\s\S]*translateY\(12px\)[\s\S]*opacity:\s*1[\s\S]*translateY\(0\)/s, '`fade-up` 关键帧还不完整。'],
      [/\.card-enter-active\s*\{[\s\S]*animation:\s*fade-up\s+240ms\s+ease-out\s*;/s, '`.card-enter-active` 还没有使用 `fade-up` 动画。'],
      [/\.cta-button:hover\s*\{[\s\S]*transform:\s*translateY\(-2px\)\s*;/s, 'hover 状态还没有上浮效果。'],
    ],
  }),
  regexExercise({
    slug: 'css-03-fix-dashboard-grid',
    track: 'CSS、动画',
    title: 'CSS、动画 3/7：修复仪表盘双栏布局',
    file: 'exercises/03-css-layout/02-fixDashboardGrid.css',
    concept: '真实工作里更常见的是修现有样式，而不是从头写一套。',
    instructions: [
      '把容器改成两栏 grid。',
      'sidebar 用 18rem。',
      'content 用 minmax(0, 1fr)。',
      'gap 改成 1rem。',
    ],
    checks: [
      [/\.dashboard-layout\s*\{[\s\S]*display:\s*grid\s*;/s, '容器还没有改成 grid。'],
      [/grid-template-columns:\s*18rem\s+minmax\(0,\s*1fr\)\s*;/, '两栏模板还不对。'],
      [/gap:\s*1rem\s*;/, 'gap 还没有改成 1rem。'],
    ],
  }),
  regexExercise({
    slug: 'css-04-fix-form-alignment',
    track: 'CSS、动画',
    title: 'CSS、动画 4/7：修复表单对齐',
    file: 'exercises/03-css-layout/03-fixFormAlignment.css',
    concept: '表单对齐对后端转前端的人很容易痛苦，这题专门练常见表单行布局。',
    instructions: [
      '把 `.form-row` 改成 flex。',
      '对齐到 center。',
      'gap 改成 0.75rem。',
      'label 宽度 7rem。',
      'input 用 flex: 1。',
    ],
    checks: [
      [/\.form-row\s*\{[\s\S]*display:\s*flex\s*;/s, '`.form-row` 还没有改成 flex。'],
      [/align-items:\s*center\s*;/, '还没有垂直居中。'],
      [/gap:\s*0\.75rem\s*;/, 'gap 还没有改成 0.75rem。'],
      [/label\s*\{[\s\S]*width:\s*7rem\s*;/s, 'label 宽度还不对。'],
      [/input\s*\{[\s\S]*flex:\s*1\s*;/s, 'input 还没有用 flex: 1。'],
    ],
  }),
  regexExercise({
    slug: 'css-05-fix-mobile-cards',
    track: 'CSS、动画',
    title: 'CSS、动画 5/7：修复移动端卡片列数',
    file: 'exercises/03-css-layout/04-fixMobileCards.css',
    concept: '响应式最大的问题往往不是桌面，而是移动端断点下没收住。',
    instructions: [
      '保留桌面 4 列。',
      '在 720px 以下收成 1 列。',
    ],
    checks: [
      [/grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)\s*;/, '桌面 4 列设置不对。'],
      [/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*grid-template-columns:\s*1fr\s*;/s, '移动端还没有收成 1 列。'],
    ],
  }),
  regexExercise({
    slug: 'css-06-fix-hover-card',
    track: 'CSS、动画',
    title: 'CSS、动画 6/7：修复卡片 hover 动效',
    file: 'exercises/04-css-animation/02-fixHoverCard.css',
    concept: '很多“看起来不高级”的界面，问题其实只是缺少过渡和状态变化。',
    instructions: [
      '加 transition。',
      'hover 时上浮 4px。',
    ],
    checks: [
      [/transition:\s*transform 160ms ease,\s*box-shadow 160ms ease\s*;/, '还没有加 hover 过渡。'],
      [/\.hover-card:hover\s*\{[\s\S]*transform:\s*translateY\(-4px\)\s*;/s, 'hover 时还没有上浮。'],
    ],
  }),
  regexExercise({
    slug: 'css-07-fix-modal-layer',
    track: 'CSS、动画',
    title: 'CSS、动画 7/7：修复弹窗层级与定位',
    file: 'exercises/04-css-animation/03-fixModalLayer.css',
    concept: '弹窗层级和 fixed 定位是前端很经典的坑，非常值得专门练。',
    instructions: [
      'overlay 改成 fixed 并铺满视口。',
      'overlay 背景改深一点。',
      'overlay z-index 40。',
      'content 改成 fixed，z-index 50。',
    ],
    checks: [
      [/\.modal-overlay\s*\{[\s\S]*position:\s*fixed\s*;/s, 'overlay 还没有改成 fixed。'],
      [/inset:\s*0\s*;/, 'overlay 还没有铺满视口。'],
      [/background:\s*rgba\(15,\s*23,\s*42,\s*0\.55\)\s*;/, 'overlay 背景还不对。'],
      [/z-index:\s*40\s*;/, 'overlay z-index 还不对。'],
      [/\.modal-content\s*\{[\s\S]*position:\s*fixed[\s\S]*z-index:\s*50\s*;/s, 'content 定位或层级还不对。'],
    ],
  }),
  moduleExercise({
    slug: 'wasm-01-supports-wasm',
    track: 'WASM',
    title: 'WASM 1/2：先判断运行环境支不支持',
    file: 'exercises/20-wasm/01-supportsWasm.ts',
    concept: '接 WASM 前先做能力检测，这是浏览器侧很常见的一步。',
    instructions: [
      '实现 `supportsWasm()`。',
      '同时检查 `WebAssembly` 和 `WebAssembly.instantiate`。',
    ],
    async validate(_, exercise) {
      const { supportsWasm } = await importExerciseModule(exercise.file)
      const result = supportsWasm()
      const expected =
        typeof WebAssembly === 'object' &&
        typeof WebAssembly.instantiate === 'function'

      return result === expected ? [] : ['`supportsWasm()` 的返回值和当前环境不一致。']
    },
  }),
  moduleExercise({
    slug: 'wasm-02-call-add',
    track: 'WASM',
    title: 'WASM 2/2：调用导出的函数',
    file: 'exercises/20-wasm/02-callWasmAdd.ts',
    concept: '理解 JS 和 WASM 交界处最重要的事情之一，就是怎么调用 exports。',
    instructions: [
      '实现 `callWasmAdd(instance, left, right)`。',
      '缺少 add 导出时抛出 `missing add export`。',
    ],
    async validate(_, exercise) {
      const { callWasmAdd } = await importExerciseModule(exercise.file)
      const failures = []

      const result = callWasmAdd(
        {
          exports: {
            add(left, right) {
              return left + right
            },
          },
        },
        3,
        5,
      )

      if (result !== 8) {
        failures.push('有 add 导出时，返回值应该是 8。')
      }

      try {
        callWasmAdd({ exports: {} }, 1, 2)
        failures.push('缺少 add 导出时应该抛错。')
      } catch (error) {
        if (!(error instanceof Error) || error.message !== 'missing add export') {
          failures.push('抛出的错误文案应该是 `missing add export`。')
        }
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'sw-01-register',
    track: 'Service Worker',
    title: 'Service Worker 1/2：先写注册函数',
    file: 'exercises/19-service-worker/01-registerServiceWorker.ts',
    concept: '先把是否存在 `serviceWorker` 的分支写清楚，再谈缓存和离线。',
    instructions: [
      '实现 `registerServiceWorker(navigatorLike, swPath)`。',
      '没有 `serviceWorker` 时返回 `null`。',
      '有的话调用 `register(swPath)`。',
    ],
    async validate(_, exercise) {
      const { registerServiceWorker } = await importExerciseModule(exercise.file)
      const failures = []

      const withoutSw = await registerServiceWorker({})
      if (withoutSw !== null) {
        failures.push('没有 serviceWorker 时应该返回 `null`。')
      }

      let registeredPath = ''
      const withSw = await registerServiceWorker(
        {
          serviceWorker: {
            async register(swPath) {
              registeredPath = swPath
              return { scope: '/app/' }
            },
          },
        },
        '/custom-sw.js',
      )

      if (registeredPath !== '/custom-sw.js' || withSw?.scope !== '/app/') {
        failures.push('有 serviceWorker 时还没有正确调用 `register(swPath)`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'sw-02-refresh-prompt',
    track: 'Service Worker',
    title: 'Service Worker 2/2：判断何时提示用户刷新',
    file: 'exercises/19-service-worker/02-shouldPromptForRefresh.ts',
    concept: '更新流程的关键是：新版本装好了，而且当前页面有 controller，才值得提示刷新。',
    instructions: [
      '实现 `shouldPromptForRefresh(update)`。',
      '只在 `installed && hasController` 时返回 true。',
    ],
    async validate(_, exercise) {
      const { shouldPromptForRefresh } = await importExerciseModule(exercise.file)
      const failures = []

      if (shouldPromptForRefresh({ installingState: 'installed', hasController: true }) !== true) {
        failures.push('`installed + hasController` 应该返回 true。')
      }
      if (shouldPromptForRefresh({ installingState: 'installed', hasController: false }) !== false) {
        failures.push('没有 controller 时不该提示刷新。')
      }
      if (shouldPromptForRefresh({ installingState: 'installing', hasController: true }) !== false) {
        failures.push('还没装完的新版本不该提示刷新。')
      }

      return failures
    },
  }),
  regexExercise({
    slug: 'sass-01-tokens',
    track: 'Sass',
    title: 'Sass 1/2：变量和 mixin',
    file: 'exercises/05-sass/01-tokens.scss',
    concept: '先把 Sass 最常用的三件事练熟：变量、mixin、复用。',
    instructions: [
      '把 `$panel-radius` 改成 `1.5rem`。',
      '把 `$panel-bg` 改成 `#fff7ed`。',
      '把 `$panel-shadow` 改成 `0 18px 32px rgba(15, 23, 42, 0.12)`。',
      '在 `@mixin elevated-panel()` 里使用这三个变量。',
    ],
    checks: [
      [/\$panel-radius:\s*1\.5rem\s*;/, '`$panel-radius` 还没有改成 `1.5rem`。'],
      [/\$panel-bg:\s*#fff7ed\s*;/, '`$panel-bg` 还没有改成 `#fff7ed`。'],
      [/\$panel-shadow:\s*0 18px 32px rgba\(15,\s*23,\s*42,\s*0\.12\)\s*;/, '`$panel-shadow` 还没有改成目标值。'],
      [/@mixin\s+elevated-panel\(\)\s*\{[\s\S]*border-radius:\s*\$panel-radius[\s\S]*background:\s*\$panel-bg[\s\S]*box-shadow:\s*\$panel-shadow/s, 'mixin 里还没有正确使用三个 Sass 变量。'],
    ],
  }),
  regexExercise({
    slug: 'sass-02-profile-panel',
    track: 'Sass',
    title: 'Sass 2/2：嵌套和 hover 状态',
    file: 'exercises/05-sass/02-profile-panel.scss',
    concept: '把 Sass 真正用到组件样式里，重点看嵌套选择器和状态变化。',
    instructions: [
      '给 `.profile-panel` 增加 `transition`。',
      '给 `&:hover` 增加 `transform: translateY(-4px)`。',
    ],
    checks: [
      [/transition:\s*transform 160ms ease,\s*box-shadow 160ms ease\s*;/, '还没有加面板的过渡动画。'],
      [/&:hover\s*\{[\s\S]*transform:\s*translateY\(-4px\)\s*;/s, '还没有补上 hover 上浮效果。'],
    ],
  }),
  moduleExercise({
    slug: 'tailwind-01-card-classes',
    track: 'TailwindCSS',
    title: 'TailwindCSS 1/2：组合一张卡片的 utility classes',
    file: 'exercises/06-tailwindcss/01-buildCardClasses.ts',
    concept: 'Tailwind 的关键不是背类名，而是把结构类、状态类和语义拆清楚。',
    instructions: [
      '基础类里补上 `flex`、`flex-col`、`gap-3`。',
      '选中态补上 `ring-2`、`ring-emerald-500`、`-translate-y-1`。',
    ],
    async validate(_, exercise) {
      const { buildCardClasses } = await importExerciseModule(exercise.file)
      const selected = buildCardClasses(true)
      const idle = buildCardClasses(false)
      const failures = []

      for (const className of ['flex', 'flex-col', 'gap-3']) {
        if (!selected.includes(className) || !idle.includes(className)) {
          failures.push(`基础类里缺少 \`${className}\`。`)
        }
      }

      for (const className of ['ring-2', 'ring-emerald-500', '-translate-y-1']) {
        if (!selected.includes(className)) {
          failures.push(`选中态缺少 \`${className}\`。`)
        }
      }

      if (idle.includes('ring-2') || idle.includes('-translate-y-1')) {
        failures.push('未选中状态不应该带 ring 或上浮类。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'tailwind-02-badge-classes',
    track: 'TailwindCSS',
    title: 'TailwindCSS 2/2：根据状态返回不同 badge 类',
    file: 'exercises/06-tailwindcss/02-buildStatusBadgeClasses.ts',
    concept: 'Utility-first 的另一个关键，是用状态驱动类名而不是堆 if/else 到模板里。',
    instructions: [
      '在线状态补 `bg-emerald-100` 和 `text-emerald-700`。',
      '离线状态补 `bg-slate-200` 和 `text-slate-600`。',
    ],
    async validate(_, exercise) {
      const { buildStatusBadgeClasses } = await importExerciseModule(exercise.file)
      const online = buildStatusBadgeClasses('online')
      const offline = buildStatusBadgeClasses('offline')
      const failures = []

      for (const className of ['inline-flex', 'rounded-full', 'font-semibold']) {
        if (!online.includes(className) || !offline.includes(className)) {
          failures.push(`基础 badge 类里缺少 \`${className}\`。`)
        }
      }

      if (!online.includes('bg-emerald-100') || !online.includes('text-emerald-700')) {
        failures.push('在线状态类还不完整。')
      }

      if (!offline.includes('bg-slate-200') || !offline.includes('text-slate-600')) {
        failures.push('离线状态类还不完整。')
      }

      return failures
    },
  }),
  regexExercise({
    slug: 'nuxt-01-api-route',
    track: 'Nuxt Todo',
    title: 'Nuxt Todo 1/3：先写服务端 todo 接口',
    file: 'exercises/18-nuxt-todo/server/api/01-todos.get.ts',
    concept: 'Nuxt 实战先从最小接口开始，前后端一体的感觉会很快建立起来。',
    instructions: [
      '返回 3 条 todo 数据。',
      '每条数据都要有 `id`、`title`、`done`。',
    ],
    checks: [
      [/defineEventHandler\(\(\)\s*=>/, '还没有使用 `defineEventHandler`。'],
      [/title:\s*['"][^'"]+['"]/, 'todo 数据里还没有 `title`。'],
      [/done:\s*(true|false)/, 'todo 数据里还没有 `done`。'],
      [/id:\s*\d+/, 'todo 数据里还没有 `id`。'],
    ],
  }),
  regexExercise({
    slug: 'nuxt-02-use-todo-filter',
    track: 'Nuxt Todo',
    title: 'Nuxt Todo 2/3：抽一个过滤 composable',
    file: 'exercises/18-nuxt-todo/composables/01-useTodoFilter.ts',
    concept: 'Nuxt 里的 composable 和 Vue 一样，重点是把页面逻辑抽出去。',
    instructions: [
      '返回 `computed(...)`。',
      '用 `query.value.trim().toLowerCase()` 处理关键字。',
      '按 title 过滤 todos。',
    ],
    checks: [
      [/return\s+computed\(/, '还没有返回 `computed(...)`。'],
      [/query\.value\.trim\(\)\.toLowerCase\(\)/, '还没有标准化 query。'],
      [/todo\.title\.toLowerCase\(\)\.includes\(/, '还没有按标题做 includes 过滤。'],
    ],
  }),
  regexExercise({
    slug: 'nuxt-03-page',
    track: 'Nuxt Todo',
    title: 'Nuxt Todo 3/3：在页面里接上 useAsyncData',
    file: 'exercises/18-nuxt-todo/pages/todos/01-index.vue',
    concept: '最后把 API、页面状态和列表渲染串起来，就很接近真实 Nuxt 小案例了。',
    instructions: [
      '用 `useAsyncData(',
      '调用 `useTodoFilter`。',
      '处理 `pending`、`error` 和列表三种 UI。',
    ],
    checks: [
      [/useAsyncData\(\s*['"]todos['"]\s*,\s*\(\)\s*=>\s*\$fetch\(\s*['"]\/api\/todos['"]\s*\)\s*\)/, '还没有用 `useAsyncData` 请求 `/api/todos`。'],
      [/useTodoFilter\(/, '还没有调用 `useTodoFilter`。'],
      [/pending/, '页面里还没有处理 `pending`。'],
      [/error/, '页面里还没有处理 `error`。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-01-button-input',
    track: 'shadcn/vue',
    title: 'shadcn/vue 1/8：Button + Input 基础用法',
    file: 'exercises/17-shadcn-vue/01-ButtonInputExercise.vue',
    concept: '先练最常用的两个基础组件，重点是导入方式和最小模板组合。',
    instructions: [
      '从 `@/components/ui/button` 导入 `Button`。',
      '从 `@/components/ui/input` 导入 `Input`。',
      '渲染一个 email 输入框和一个提交按钮。',
    ],
    checks: [
      [/import\s*\{\s*Button\s*\}\s*from\s*['"]@\/components\/ui\/button['"]/, '还没有正确导入 `Button`。'],
      [/import\s*\{\s*Input\s*\}\s*from\s*['"]@\/components\/ui\/input['"]/, '还没有正确导入 `Input`。'],
      [/<Input\s+type=["']email["']\s+placeholder=["']Email["']\s*\/?>/, '还没有渲染 email `Input`。'],
      [/<Button\s+type=["']submit["']>[\s\S]*Subscribe[\s\S]*<\/Button>/, '还没有渲染提交 `Button`。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-02-card',
    track: 'shadcn/vue',
    title: 'shadcn/vue 2/8：Card 结构化组合',
    file: 'exercises/17-shadcn-vue/02-CardExercise.vue',
    concept: 'shadcn 的重点不是黑盒组件，而是用一组小部件拼出结构。',
    instructions: [
      '导入 Card 相关子组件。',
      '用 `CardHeader / CardTitle / CardDescription / CardContent / CardFooter` 组合一张卡片。',
    ],
    checks: [
      [/from\s*['"]@\/components\/ui\/card['"]/, '还没有从 card 组件路径导入。'],
      [/<Card>/, '还没有渲染 `<Card>`。'],
      [/<CardHeader>/, '还没有渲染 `<CardHeader>`。'],
      [/<CardTitle>/, '还没有渲染 `<CardTitle>`。'],
      [/<CardDescription>/, '还没有渲染 `<CardDescription>`。'],
      [/<CardContent>/, '还没有渲染 `<CardContent>`。'],
      [/<CardFooter>/, '还没有渲染 `<CardFooter>`。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-03-as-child',
    track: 'shadcn/vue',
    title: 'shadcn/vue 3/8：as-child 模式',
    file: 'exercises/17-shadcn-vue/03-ButtonAsChildExercise.vue',
    concept: '这是 shadcn 很有代表性的一个用法：让别的元素继承按钮外观。',
    instructions: [
      '导入 `Button`。',
      '渲染一个带 `as-child` 的 Button。',
      '内部放一个 `href="/login"` 的链接。',
    ],
    checks: [
      [/import\s*\{\s*Button\s*\}\s*from\s*['"]@\/components\/ui\/button['"]/, '还没有正确导入 `Button`。'],
      [/<Button\s+as-child>/, '还没有使用 `as-child`。'],
      [/<a\s+href=["']\/login["']>/, '还没有渲染 `/login` 链接。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-04-dialog',
    track: 'shadcn/vue',
    title: 'shadcn/vue 4/8：Dialog 常用结构',
    file: 'exercises/17-shadcn-vue/04-DialogExercise.vue',
    concept: 'Dialog 是最常见的组件之一，重点是 Trigger 和 Content 的组合。',
    instructions: [
      '导入 dialog 相关组件。',
      '渲染 trigger。',
      '渲染 title 和 description。',
    ],
    checks: [
      [/from\s*['"]@\/components\/ui\/dialog['"]/, '还没有从 dialog 路径导入。'],
      [/<Dialog>/, '还没有渲染 `<Dialog>`。'],
      [/<DialogTrigger/, '还没有渲染 `DialogTrigger`。'],
      [/<DialogContent/, '还没有渲染 `DialogContent`。'],
      [/<DialogTitle>/, '还没有渲染 `DialogTitle`。'],
      [/<DialogDescription>/, '还没有渲染 `DialogDescription`。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-05-tabs',
    track: 'shadcn/vue',
    title: 'shadcn/vue 5/8：Tabs',
    file: 'exercises/17-shadcn-vue/05-TabsExercise.vue',
    concept: 'Tabs 是后台界面里很常见的内容分区组件。',
    instructions: [
      '导入 tabs 相关组件。',
      '默认值设成 overview。',
      '至少两个 trigger 和两个 content。',
    ],
    checks: [
      [/from\s*['"]@\/components\/ui\/tabs['"]/, '还没有从 tabs 路径导入。'],
      [/<Tabs\s+default-value=["']overview["']>/, '还没有设置 `default-value="overview"`。'],
      [/<TabsTrigger[\s\S]*value=["']overview["']/s, '还没有 overview trigger。'],
      [/<TabsTrigger[\s\S]*value=["']metrics["']/s, '还没有 metrics trigger。'],
      [/<TabsContent[\s\S]*value=["']overview["']/s, '还没有 overview content。'],
      [/<TabsContent[\s\S]*value=["']metrics["']/s, '还没有 metrics content。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-06-select',
    track: 'shadcn/vue',
    title: 'shadcn/vue 6/8：Select',
    file: 'exercises/17-shadcn-vue/06-SelectExercise.vue',
    concept: 'Select 在后台表单和筛选里会非常高频。',
    instructions: [
      '导入 Select 相关组件。',
      '加 placeholder。',
      '加 admin 和 editor 两个选项。',
    ],
    checks: [
      [/from\s*['"]@\/components\/ui\/select['"]/, '还没有从 select 路径导入。'],
      [/<Select>/, '还没有渲染 `<Select>`。'],
      [/<SelectValue[\s\S]*placeholder=["']Choose a role["']/s, '还没有设置 placeholder。'],
      [/<SelectItem[\s\S]*value=["']admin["']/s, '还没有 admin 选项。'],
      [/<SelectItem[\s\S]*value=["']editor["']/s, '还没有 editor 选项。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-07-checkbox',
    track: 'shadcn/vue',
    title: 'shadcn/vue 7/8：Checkbox + Label',
    file: 'exercises/17-shadcn-vue/07-CheckboxExercise.vue',
    concept: 'Checkbox 和 Label 配对是表单无障碍里的很基础一环。',
    instructions: [
      '导入 Checkbox 和 Label。',
      'checkbox id 设为 terms。',
      'label for 绑定 terms。',
    ],
    checks: [
      [/from\s*['"]@\/components\/ui\/checkbox['"]/, '还没有导入 `Checkbox`。'],
      [/from\s*['"]@\/components\/ui\/label['"]/, '还没有导入 `Label`。'],
      [/<Checkbox[\s\S]*id=["']terms["']/s, 'Checkbox 还没有 `id="terms"`。'],
      [/<Label[\s\S]*for=["']terms["']/s, 'Label 还没有 `for="terms"`。'],
    ],
  }),
  regexExercise({
    slug: 'shadcn-08-sheet',
    track: 'shadcn/vue',
    title: 'shadcn/vue 8/8：Sheet',
    file: 'exercises/17-shadcn-vue/08-SheetExercise.vue',
    concept: 'Sheet 很像侧边抽屉，是后台筛选、编辑表单的高频组件。',
    instructions: [
      '导入 sheet 相关组件。',
      '加 trigger。',
      '加 title 和 description。',
    ],
    checks: [
      [/from\s*['"]@\/components\/ui\/sheet['"]/, '还没有从 sheet 路径导入。'],
      [/<Sheet>/, '还没有渲染 `<Sheet>`。'],
      [/<SheetTrigger/, '还没有渲染 `SheetTrigger`。'],
      [/<SheetContent/, '还没有渲染 `SheetContent`。'],
      [/<SheetTitle>/, '还没有渲染 `SheetTitle`。'],
      [/<SheetDescription>/, '还没有渲染 `SheetDescription`。'],
    ],
  }),
  regexExercise({
    slug: 'reka-01-select',
    track: 'Reka UI',
    title: 'Reka UI 1/8：Select 基础结构',
    file: 'exercises/16-reka-ui-components/01-SelectExercise.vue',
    concept: '先把 Reka Select 的骨架搭出来，理解它是由多层原语拼起来的。',
    instructions: [
      '导入 Select 相关部件。',
      '渲染 `SelectRoot`、`SelectTrigger`、`SelectValue`、`SelectContent`。',
      '用 `v-model` 绑定 `selected`。',
      '加两个选项：engineering 和 design。',
    ],
    checks: [
      [/SelectRoot/, '还没有导入或使用 `SelectRoot`。'],
      [/SelectTrigger/, '还没有导入或使用 `SelectTrigger`。'],
      [/SelectValue/, '还没有导入或使用 `SelectValue`。'],
      [/SelectContent/, '还没有导入或使用 `SelectContent`。'],
      [/<SelectRoot\s+v-model=["']selected["']>/, '还没有用 `v-model="selected"` 绑定。'],
      [/value=["']engineering["']/, '还没有加 `engineering` 选项。'],
      [/value=["']design["']/, '还没有加 `design` 选项。'],
    ],
  }),
  regexExercise({
    slug: 'reka-02-menubar',
    track: 'Reka UI',
    title: 'Reka UI 2/8：Menubar 基础结构',
    file: 'exercises/16-reka-ui-components/02-MenubarExercise.vue',
    concept: 'Menubar 很适合练原语思维：Root、Menu、Trigger、Content、Item 各司其职。',
    instructions: [
      '导入 Menubar 相关部件。',
      '渲染一个 `File` 菜单。',
      '放两个 item 和一个 separator。',
    ],
    checks: [
      [/MenubarRoot/, '还没有导入或使用 `MenubarRoot`。'],
      [/MenubarMenu/, '还没有导入或使用 `MenubarMenu`。'],
      [/MenubarTrigger/, '还没有导入或使用 `MenubarTrigger`。'],
      [/MenubarContent/, '还没有导入或使用 `MenubarContent`。'],
      [/MenubarItem/, '还没有导入或使用 `MenubarItem`。'],
      [/MenubarSeparator/, '还没有导入或使用 `MenubarSeparator`。'],
      [/>File</, '触发器文本还没有写成 `File`。'],
    ],
  }),
  regexExercise({
    slug: 'reka-03-controlled-open',
    track: 'Reka UI',
    title: 'Reka UI 3/8：受控 open 状态',
    file: 'exercises/16-reka-ui-components/03-ControlledOpenExercise.vue',
    concept: '再进一层，练受控状态，因为很多 headless 组件都支持 controlled/uncontrolled 两种模式。',
    instructions: [
      '导入 `SelectRoot`、`SelectTrigger`、`SelectValue`。',
      '给 `SelectRoot` 传 `:open=\"open\"`。',
      '监听 `@update:open` 同步本地状态。',
    ],
    checks: [
      [/SelectRoot/, '还没有导入或使用 `SelectRoot`。'],
      [/SelectTrigger/, '还没有导入或使用 `SelectTrigger`。'],
      [/SelectValue/, '还没有导入或使用 `SelectValue`。'],
      [/<SelectRoot\s+:open=["']open["']/, '还没有传入受控 `open`。'],
      [/@update:open=["']\(value\)\s*=>\s*\(open\s*=\s*value\)["']/, '还没有监听 `@update:open`。'],
    ],
  }),
  regexExercise({
    slug: 'reka-04-dialog',
    track: 'Reka UI',
    title: 'Reka UI 4/8：Dialog',
    file: 'exercises/16-reka-ui-components/04-DialogExercise.vue',
    concept: 'Dialog 是最典型的 headless 组合件之一，值得单独练。',
    instructions: [
      '导入 dialog 相关原语。',
      '渲染 trigger、overlay、content。',
      '内容里放 title 和 description。',
    ],
    checks: [
      [/DialogRoot/, '还没有导入或使用 `DialogRoot`。'],
      [/DialogTrigger/, '还没有导入或使用 `DialogTrigger`。'],
      [/DialogOverlay/, '还没有导入或使用 `DialogOverlay`。'],
      [/DialogContent/, '还没有导入或使用 `DialogContent`。'],
      [/DialogTitle/, '还没有导入或使用 `DialogTitle`。'],
      [/DialogDescription/, '还没有导入或使用 `DialogDescription`。'],
    ],
  }),
  regexExercise({
    slug: 'reka-05-tabs',
    track: 'Reka UI',
    title: 'Reka UI 5/8：Tabs',
    file: 'exercises/16-reka-ui-components/05-TabsExercise.vue',
    concept: 'Tabs 能很好地体现 Reka 的原语式 API 设计。',
    instructions: [
      '导入 tabs 相关原语。',
      '默认值 overview。',
      '渲染两个 trigger 和两个 content。',
    ],
    checks: [
      [/TabsRoot/, '还没有导入或使用 `TabsRoot`。'],
      [/TabsList/, '还没有导入或使用 `TabsList`。'],
      [/TabsTrigger/, '还没有导入或使用 `TabsTrigger`。'],
      [/TabsContent/, '还没有导入或使用 `TabsContent`。'],
      [/<TabsRoot[\s\S]*default-value=["']overview["']/s, '还没有设置默认值 overview。'],
    ],
  }),
  regexExercise({
    slug: 'reka-06-tooltip',
    track: 'Reka UI',
    title: 'Reka UI 6/8：Tooltip',
    file: 'exercises/16-reka-ui-components/06-TooltipExercise.vue',
    concept: 'Tooltip 是很经典的 portal + trigger + content 组合。',
    instructions: [
      '导入 tooltip 相关原语。',
      '渲染 trigger 和 content。',
    ],
    checks: [
      [/TooltipProvider/, '还没有导入或使用 `TooltipProvider`。'],
      [/TooltipRoot/, '还没有导入或使用 `TooltipRoot`。'],
      [/TooltipTrigger/, '还没有导入或使用 `TooltipTrigger`。'],
      [/TooltipContent/, '还没有导入或使用 `TooltipContent`。'],
      [/>Hover me</, 'trigger 文本还不对。'],
      [/>Tooltip content</, 'content 文本还不对。'],
    ],
  }),
  regexExercise({
    slug: 'reka-07-dropdown-menu',
    track: 'Reka UI',
    title: 'Reka UI 7/8：Dropdown Menu',
    file: 'exercises/16-reka-ui-components/07-DropdownMenuExercise.vue',
    concept: '下拉菜单是后台和工具页里非常高频的交互。',
    instructions: [
      '导入 dropdown menu 相关原语。',
      '渲染 trigger。',
      '内容里至少两个 item 和一个 separator。',
    ],
    checks: [
      [/DropdownMenuRoot/, '还没有导入或使用 `DropdownMenuRoot`。'],
      [/DropdownMenuTrigger/, '还没有导入或使用 `DropdownMenuTrigger`。'],
      [/DropdownMenuContent/, '还没有导入或使用 `DropdownMenuContent`。'],
      [/DropdownMenuItem/, '还没有导入或使用 `DropdownMenuItem`。'],
      [/DropdownMenuSeparator/, '还没有导入或使用 `DropdownMenuSeparator`。'],
      [/>Actions</, 'trigger 文本还不对。'],
    ],
  }),
  regexExercise({
    slug: 'reka-08-accordion',
    track: 'Reka UI',
    title: 'Reka UI 8/8：Accordion',
    file: 'exercises/16-reka-ui-components/08-AccordionExercise.vue',
    concept: 'Accordion 在 FAQ、配置面板、折叠设置里很常见。',
    instructions: [
      '导入 accordion 相关原语。',
      '渲染单开可折叠 accordion。',
      'item value 设为 faq。',
    ],
    checks: [
      [/AccordionRoot/, '还没有导入或使用 `AccordionRoot`。'],
      [/AccordionItem/, '还没有导入或使用 `AccordionItem`。'],
      [/AccordionTrigger/, '还没有导入或使用 `AccordionTrigger`。'],
      [/AccordionContent/, '还没有导入或使用 `AccordionContent`。'],
      [/<AccordionRoot[\s\S]*type=["']single["'][\s\S]*collapsible/s, '还没有设置 `type="single"` 和 `collapsible`。'],
      [/<AccordionItem[\s\S]*value=["']faq["']/s, 'item value 还没有设成 faq。'],
    ],
  }),
  moduleExercise({
    slug: 'js-01-destructure-profile',
    track: 'JavaScript',
    title: 'JavaScript 1/16：对象解构',
    file: 'exercises/01-javascript/01-destructureProfile.ts',
    concept: '前端里解构会非常高频，尤其在 props、API 响应和 store 数据上。',
    instructions: [
      '用对象解构拿到 `name`、`role`、`stats.tasks`。',
      '返回 `${name}:${role}:${tasks}`。',
    ],
    async validate(_, exercise) {
      const { destructureProfile } = await importExerciseModule(exercise.file)
      const result = destructureProfile({ name: 'Ada', role: 'Engineer', stats: { tasks: 5 } })
      return result === 'Ada:Engineer:5' ? [] : ['返回值不对，期望 `Ada:Engineer:5`。']
    },
  }),
  moduleExercise({
    slug: 'js-02-filter-done',
    track: 'JavaScript',
    title: 'JavaScript 2/16：filter',
    file: 'exercises/01-javascript/02-filterDoneTodos.ts',
    concept: '列表过滤几乎是前端最常见的数据处理动作之一。',
    instructions: ['只保留 `done === true` 的 todo。'],
    async validate(_, exercise) {
      const { filterDoneTodos } = await importExerciseModule(exercise.file)
      const result = filterDoneTodos([
        { id: 1, title: 'A', done: false },
        { id: 2, title: 'B', done: true },
      ])
      return result.length === 1 && result[0].id === 2 ? [] : ['`filterDoneTodos` 还没有正确过滤完成项。']
    },
  }),
  moduleExercise({
    slug: 'js-03-map-titles',
    track: 'JavaScript',
    title: 'JavaScript 3/16：map',
    file: 'exercises/01-javascript/03-mapTaskTitles.ts',
    concept: '接口数据映射成 UI 数据时，`map` 会用得非常多。',
    instructions: ['返回大写标题数组。'],
    async validate(_, exercise) {
      const { mapTaskTitles } = await importExerciseModule(exercise.file)
      const result = mapTaskTitles([{ title: 'build' }, { title: 'ship' }])
      return JSON.stringify(result) === JSON.stringify(['BUILD', 'SHIP']) ? [] : ['`mapTaskTitles` 返回值不对。']
    },
  }),
  moduleExercise({
    slug: 'js-04-reduce-points',
    track: 'JavaScript',
    title: 'JavaScript 4/16：reduce',
    file: 'exercises/01-javascript/04-sumTaskPoints.ts',
    concept: '聚合统计很常见，比如总分、总数、金额汇总。',
    instructions: ['用 `reduce` 累加 `points`。'],
    async validate(_, exercise) {
      const { sumTaskPoints } = await importExerciseModule(exercise.file)
      return sumTaskPoints([{ points: 2 }, { points: 5 }, { points: 3 }]) === 10
        ? []
        : ['`sumTaskPoints` 还没有正确求和。']
    },
  }),
  moduleExercise({
    slug: 'js-05-merge-filters',
    track: 'JavaScript',
    title: 'JavaScript 5/16：对象展开合并',
    file: 'exercises/01-javascript/05-mergeFilters.ts',
    concept: '不可变更新对象时，spread 是最常见手法之一。',
    instructions: ['用对象展开合并默认筛选项和覆盖项。'],
    async validate(_, exercise) {
      const { mergeFilters } = await importExerciseModule(exercise.file)
      const result = mergeFilters(
        { page: 1, pageSize: 20, tag: 'all' },
        { page: 3, tag: 'bug' },
      )
      return result.page === 3 && result.pageSize === 20 && result.tag === 'bug'
        ? []
        : ['`mergeFilters` 还没有正确合并对象。']
    },
  }),
  moduleExercise({
    slug: 'js-06-primary-email',
    track: 'JavaScript',
    title: 'JavaScript 6/16：optional chaining + nullish coalescing',
    file: 'exercises/01-javascript/06-getPrimaryEmail.ts',
    concept: '处理不稳定接口数据时，这两个运算符能大幅减少防御式代码。',
    instructions: ['用 `?.` 和 `??` 取邮箱并兜底。'],
    async validate(_, exercise) {
      const { getPrimaryEmail } = await importExerciseModule(exercise.file)
      const ok = getPrimaryEmail({ profile: { contact: { email: 'ada@example.com' } } })
      const fallback = getPrimaryEmail({})
      return ok === 'ada@example.com' && fallback === 'unknown@example.com'
        ? []
        : ['邮箱提取或默认值逻辑还不对。']
    },
  }),
  moduleExercise({
    slug: 'js-07-load-dashboard',
    track: 'JavaScript',
    title: 'JavaScript 7/16：Promise.all + async/await',
    file: 'exercises/01-javascript/07-loadDashboard.ts',
    concept: '前端并发请求非常常见，这题专门练最常用的异步组合方式。',
    instructions: ['用 `Promise.all` 并发拿 summary 和 tasks，并返回对象。'],
    async validate(_, exercise) {
      const { loadDashboard } = await importExerciseModule(exercise.file)
      const result = await loadDashboard(
        async () => ({ projects: 4 }),
        async () => [{ id: 1 }, { id: 2 }],
      )
      return result.summary?.projects === 4 && result.tasks.length === 2
        ? []
        : ['`loadDashboard` 还没有正确并发获取并返回结果。']
    },
  }),
  moduleExercise({
    slug: 'js-08-destructure-first-rest',
    track: 'JavaScript',
    title: 'JavaScript 8/16：数组解构',
    file: 'exercises/01-javascript/08-destructureFirstAndRest.ts',
    concept: '数组解构在列表首项、剩余项、分页首屏数据里都很常见。',
    instructions: ['用数组解构拿到第一个成员和剩余成员。', '返回 `${first.name}:${rest.length}`。'],
    async validate(_, exercise) {
      const { destructureFirstAndRest } = await importExerciseModule(exercise.file)
      const result = destructureFirstAndRest([{ name: 'Ada' }, { name: 'Linus' }, { name: 'Grace' }])
      return result === 'Ada:2' ? [] : ['`destructureFirstAndRest` 返回值不对，期望 `Ada:2`。']
    },
  }),
  moduleExercise({
    slug: 'js-09-find-todo-by-id',
    track: 'JavaScript',
    title: 'JavaScript 9/16：find',
    file: 'exercises/01-javascript/09-findTodoById.ts',
    concept: '`find` 很适合做“从列表里拿当前项”这种前端高频动作。',
    instructions: ['用 `find` 返回匹配 id 的 todo。'],
    async validate(_, exercise) {
      const { findTodoById } = await importExerciseModule(exercise.file)
      const todos = [
        { id: 1, title: 'A', done: false },
        { id: 2, title: 'B', done: true },
      ]
      const found = findTodoById(todos, 2)
      const missing = findTodoById(todos, 99)
      return found?.title === 'B' && missing === undefined
        ? []
        : ['`findTodoById` 还没有正确返回匹配项或 undefined。']
    },
  }),
  moduleExercise({
    slug: 'js-10-has-blocking-issue',
    track: 'JavaScript',
    title: 'JavaScript 10/16：some',
    file: 'exercises/01-javascript/10-hasBlockingIssue.ts',
    concept: '`some` 很适合做权限、异常、告警、禁用态这类“是否存在一个”判断。',
    instructions: ['当存在高优先级且未完成的问题时返回 true。'],
    async validate(_, exercise) {
      const { hasBlockingIssue } = await importExerciseModule(exercise.file)
      const yes = hasBlockingIssue([{ title: 'A', priority: 'high', status: 'blocked' }])
      const no = hasBlockingIssue([{ title: 'B', priority: 'high', status: 'done' }])
      return yes === true && no === false
        ? []
        : ['`hasBlockingIssue` 还没有正确实现 some 判断。']
    },
  }),
  moduleExercise({
    slug: 'js-11-all-todos-done',
    track: 'JavaScript',
    title: 'JavaScript 11/16：every',
    file: 'exercises/01-javascript/11-areAllTodosDone.ts',
    concept: '`every` 很适合做“是否全部满足条件”的表格和批量操作判断。',
    instructions: ['用 `every` 判断 todos 是否全部完成。'],
    async validate(_, exercise) {
      const { areAllTodosDone } = await importExerciseModule(exercise.file)
      const yes = areAllTodosDone([{ done: true }, { done: true }])
      const no = areAllTodosDone([{ done: true }, { done: false }])
      return yes === true && no === false
        ? []
        : ['`areAllTodosDone` 还没有正确实现 every 判断。']
    },
  }),
  moduleExercise({
    slug: 'js-12-sort-updated-at',
    track: 'JavaScript',
    title: 'JavaScript 12/16：sort + 不可变排序',
    file: 'exercises/01-javascript/12-sortTasksByUpdatedAt.ts',
    concept: '前端列表排序很常见，但更重要的是别直接改原数组。',
    instructions: ['返回一个新数组。', '按 `updatedAt` 从新到旧排序。', '不要修改原始 tasks。'],
    async validate(_, exercise) {
      const { sortTasksByUpdatedAt } = await importExerciseModule(exercise.file)
      const tasks = [
        { id: 1, updatedAt: '2026-04-18T10:00:00.000Z' },
        { id: 2, updatedAt: '2026-04-19T10:00:00.000Z' },
        { id: 3, updatedAt: '2026-04-17T10:00:00.000Z' },
      ]
      const result = sortTasksByUpdatedAt(tasks)
      const ids = result.map(task => task.id).join(',')
      const originalUnchanged = tasks.map(task => task.id).join(',') === '1,2,3'
      const newArray = result !== tasks
      return ids === '2,1,3' && originalUnchanged && newArray
        ? []
        : ['`sortTasksByUpdatedAt` 需要返回新数组，并按时间从新到旧排序。']
    },
  }),
  moduleExercise({
    slug: 'js-13-unique-tags',
    track: 'JavaScript',
    title: 'JavaScript 13/16：Set 去重',
    file: 'exercises/01-javascript/13-uniqueTags.ts',
    concept: '标签、筛选项、候选值去重时，Set 是非常常用的手法。',
    instructions: ['返回去重后的 tags 数组，并保留原始顺序。'],
    async validate(_, exercise) {
      const { uniqueTags } = await importExerciseModule(exercise.file)
      const result = uniqueTags(['bug', 'feature', 'bug', 'ops'])
      return JSON.stringify(result) === JSON.stringify(['bug', 'feature', 'ops'])
        ? []
        : ['`uniqueTags` 还没有正确去重。']
    },
  }),
  moduleExercise({
    slug: 'js-14-flatmap-authors',
    track: 'JavaScript',
    title: 'JavaScript 14/16：flatMap',
    file: 'exercises/01-javascript/14-flatMapCommentAuthors.ts',
    concept: '`flatMap` 很适合把嵌套列表直接摊平成 UI 更好消费的结构。',
    instructions: ['用 `flatMap` 返回所有 comment author 的扁平数组。'],
    async validate(_, exercise) {
      const { flatMapCommentAuthors } = await importExerciseModule(exercise.file)
      const result = flatMapCommentAuthors([
        { id: 1, comments: [{ author: 'Ada' }, { author: 'Linus' }] },
        { id: 2, comments: [{ author: 'Grace' }] },
      ])
      return JSON.stringify(result) === JSON.stringify(['Ada', 'Linus', 'Grace'])
        ? []
        : ['`flatMapCommentAuthors` 还没有正确摊平作者数组。']
    },
  }),
  moduleExercise({
    slug: 'js-15-group-by-status',
    track: 'JavaScript',
    title: 'JavaScript 15/16：reduce 分组',
    file: 'exercises/01-javascript/15-groupTasksByStatus.ts',
    concept: '前端经常要把原始列表分组后喂给多个区块或多个 tab。',
    instructions: ['用 `reduce` 构建 `{ todo, doing, done }` 分组对象。'],
    async validate(_, exercise) {
      const { groupTasksByStatus } = await importExerciseModule(exercise.file)
      const result = groupTasksByStatus([
        { id: 1, status: 'todo' },
        { id: 2, status: 'doing' },
        { id: 3, status: 'done' },
        { id: 4, status: 'todo' },
      ])
      return result.todo.length === 2 && result.doing[0]?.id === 2 && result.done[0]?.id === 3
        ? []
        : ['`groupTasksByStatus` 还没有正确分组。']
    },
  }),
  moduleExercise({
    slug: 'js-16-build-query-string',
    track: 'JavaScript',
    title: 'JavaScript 16/16：URLSearchParams',
    file: 'exercises/01-javascript/16-buildQueryString.ts',
    concept: '列表筛选、搜索和跳转页面状态时，经常要把对象转成查询字符串。',
    instructions: ['用 `URLSearchParams` 构建查询字符串。', '跳过 null、undefined 和空字符串。'],
    async validate(_, exercise) {
      const { buildQueryString } = await importExerciseModule(exercise.file)
      const result = buildQueryString({ page: 2, tag: 'bug', owner: '', extra: undefined, archived: null })
      return result === 'page=2&tag=bug'
        ? []
        : ['`buildQueryString` 返回值不对，期望 `page=2&tag=bug`。']
    },
  }),
  regexExercise({
    slug: 'ts-01-record',
    track: 'TypeScript',
    title: 'TypeScript 1/14：Record',
    file: 'exercises/02-typescript/01-createMetricRecord.ts',
    concept: '`Record` 在前端里特别常见，常拿来表示状态表、映射表和字典对象。',
    instructions: ['把 `metrics` 明确标注成 `Record<string, number>`。'],
    checks: [[/const\s+metrics:\s*Record<string,\s*number>\s*=/, '还没有用 `Record<string, number>` 标注。']],
  }),
  moduleExercise({
    slug: 'ts-02-pluck',
    track: 'TypeScript',
    title: 'TypeScript 2/14：泛型 + keyof',
    file: 'exercises/02-typescript/02-pluck.ts',
    concept: '这是组件库、表格列配置、表单字段工具里特别高频的一类写法。',
    instructions: ['返回 `item[key]`。'],
    async validate(_, exercise) {
      const { pluck } = await importExerciseModule(exercise.file)
      return pluck({ id: 7, title: 'Roadmap' }, 'title') === 'Roadmap'
        ? []
        : ['`pluck` 还没有返回正确字段值。']
    },
  }),
  moduleExercise({
    slug: 'ts-03-format-result',
    track: 'TypeScript',
    title: 'TypeScript 3/14：联合类型收窄',
    file: 'exercises/02-typescript/03-formatResult.ts',
    concept: '接口状态、异步结果、表单提交结果都很适合用判别联合建模。',
    instructions: ['根据 `result.ok` 做类型收窄。'],
    async validate(_, exercise) {
      const { formatResult } = await importExerciseModule(exercise.file)
      const ok = formatResult({ ok: true, data: { id: 1 } })
      const fail = formatResult({ ok: false, error: 'network' })
      return ok === 'success' && fail === 'error:network'
        ? []
        : ['`formatResult` 还没有正确处理联合类型。']
    },
  }),
  moduleExercise({
    slug: 'ts-04-merge-config',
    track: 'TypeScript',
    title: 'TypeScript 4/14：Partial',
    file: 'exercises/02-typescript/04-mergeConfig.ts',
    concept: '前端很常把“默认配置 + 局部覆盖”建模成 `Partial<T>`。',
    instructions: ['把 `defaults` 和 `overrides` 合成一个完整 `ViewConfig`。'],
    async validate(_, exercise) {
      const { mergeConfig } = await importExerciseModule(exercise.file)
      const result = mergeConfig(
        { pageSize: 20, theme: 'light', dense: false },
        { theme: 'dark' },
      )
      return result.pageSize === 20 && result.theme === 'dark' && result.dense === false
        ? []
        : ['`mergeConfig` 还没有正确合并配置。']
    },
  }),
  moduleExercise({
    slug: 'ts-05-to-id-label',
    track: 'TypeScript',
    title: 'TypeScript 5/14：泛型返回类型',
    file: 'exercises/02-typescript/05-toIdLabel.ts',
    concept: '这类“输入什么 id 类型，就返回什么 id 类型”的工具函数很常见。',
    instructions: ['返回正确的 `{ id, label }` 对象。'],
    async validate(_, exercise) {
      const { toIdLabel } = await importExerciseModule(exercise.file)
      const a = toIdLabel(3, 'Three')
      const b = toIdLabel('x-1', 'Node')
      return a.id === 3 && a.label === 'Three' && b.id === 'x-1'
        ? []
        : ['`toIdLabel` 返回值不对。']
    },
  }),
  moduleExercise({
    slug: 'ts-06-pick-fields',
    track: 'TypeScript',
    title: 'TypeScript 6/14：Pick + keyof 组合',
    file: 'exercises/02-typescript/06-pickFields.ts',
    concept: '这类字段选择工具在表格、表单和 API 适配层都非常实用。',
    instructions: ['只返回指定 keys 对应的字段。'],
    async validate(_, exercise) {
      const { pickFields } = await importExerciseModule(exercise.file)
      const result = pickFields(
        { id: 1, title: 'Build', done: true },
        ['id', 'title'],
      )
      return JSON.stringify(result) === JSON.stringify({ id: 1, title: 'Build' })
        ? []
        : ['`pickFields` 还没有正确挑选字段。']
    },
  }),
  moduleExercise({
    slug: 'ts-07-editable-user',
    track: 'TypeScript',
    title: 'TypeScript 7/14：Omit',
    file: 'exercises/02-typescript/07-toEditableUser.ts',
    concept: '`Omit` 很适合把接口实体裁成表单可编辑模型。',
    instructions: ['让 `EditableUser` 用 `Omit` 去掉时间字段。', '返回不包含 `createdAt` 和 `updatedAt` 的对象。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { toEditableUser } = await importExerciseModule(exercise.file)
      const result = toEditableUser({
        id: 1,
        name: 'Ada',
        role: 'admin',
        createdAt: '2026-04-19',
        updatedAt: '2026-04-19',
      })
      const usesOmit = /type\s+EditableUser\s*=\s*Omit<ApiUser,\s*['"]createdAt['"]\s*\|\s*['"]updatedAt['"]\s*>/.test(source)
      const removedFields = !('createdAt' in result) && !('updatedAt' in result)
      return usesOmit && removedFields
        ? []
        : ['`EditableUser` 需要用 `Omit`，并且返回对象里不能再有时间字段。']
    },
  }),
  moduleExercise({
    slug: 'ts-08-readonly-columns',
    track: 'TypeScript',
    title: 'TypeScript 8/14：ReadonlyArray',
    file: 'exercises/02-typescript/08-defineReadonlyColumns.ts',
    concept: '列配置、导航配置这类静态元数据很适合标成只读数组。',
    instructions: ['把 `columns` 标成只读数组。', '继续返回所有列 key。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { getColumnKeys } = await importExerciseModule(exercise.file)
      const result = getColumnKeys()
      const usesReadonly = /const\s+columns:\s*(ReadonlyArray<Column>|readonly\s+Column\[\])/.test(source)
      return usesReadonly && JSON.stringify(result) === JSON.stringify(['title', 'status'])
        ? []
        : ['`columns` 需要改成只读数组，并继续返回正确的 key 列表。']
    },
  }),
  moduleExercise({
    slug: 'ts-09-error-message',
    track: 'TypeScript',
    title: 'TypeScript 9/14：unknown 收窄',
    file: 'exercises/02-typescript/09-getErrorMessage.ts',
    concept: '`catch (error: unknown)` 是前端里很值得养成的习惯。',
    instructions: ['收窄 unknown。', 'Error -> message，string -> 原字符串，其他 -> `unknown error`。'],
    async validate(_, exercise) {
      const { getErrorMessage } = await importExerciseModule(exercise.file)
      const a = getErrorMessage(new Error('network'))
      const b = getErrorMessage('timeout')
      const c = getErrorMessage({ code: 500 })
      return a === 'network' && b === 'timeout' && c === 'unknown error'
        ? []
        : ['`getErrorMessage` 还没有正确收窄 unknown。']
    },
  }),
  moduleExercise({
    slug: 'ts-10-status-labels',
    track: 'TypeScript',
    title: 'TypeScript 10/14：satisfies',
    file: 'exercises/02-typescript/10-createStatusLabels.ts',
    concept: '`satisfies` 很适合给配置对象做“既推断值，又校验结构”的约束。',
    instructions: ['让 `statusLabels` 使用 `satisfies Record<Status, string>`。', '继续返回正确标签。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { getStatusLabel } = await importExerciseModule(exercise.file)
      const usesSatisfies = /}\s+satisfies\s+Record<Status,\s*string>/.test(source)
      return usesSatisfies && getStatusLabel('loading') === 'Loading'
        ? []
        : ['`statusLabels` 需要用 `satisfies Record<Status, string>`。']
    },
  }),
  moduleExercise({
    slug: 'ts-11-extract-success',
    track: 'TypeScript',
    title: 'TypeScript 11/14：Extract',
    file: 'exercises/02-typescript/11-extractSuccessData.ts',
    concept: '`Extract` 适合从联合类型里拿出某一个分支，常见于接口响应和事件类型。',
    instructions: ['让 `SuccessResponse` 使用 `Extract`。', 'success 返回 data，error 返回 null。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { extractSuccessData } = await importExerciseModule(exercise.file)
      const ok = extractSuccessData({ type: 'success', data: { id: 1 } })
      const fail = extractSuccessData({ type: 'error', message: 'oops' })
      const usesExtract = /type\s+SuccessResponse<\s*T\s*>\s*=\s*Extract<ApiResponse<T>,\s*\{\s*type:\s*['"]success['"]\s*\}>/.test(source)
      return usesExtract && ok?.id === 1 && fail === null
        ? []
        : ['`SuccessResponse` 需要用 `Extract`，并正确返回 success data。']
    },
  }),
  moduleExercise({
    slug: 'ts-12-resolve-loader',
    track: 'TypeScript',
    title: 'TypeScript 12/14：Awaited + ReturnType',
    file: 'exercises/02-typescript/12-resolveLoaderData.ts',
    concept: '这类“把 loader 的返回类型透传出去”的写法在 composable 和 data layer 里很常见。',
    instructions: ['返回 loader 的结果。', '返回类型使用 `Awaited<ReturnType<TLoader>>`。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { resolveLoaderData } = await importExerciseModule(exercise.file)
      const result = await resolveLoaderData(async () => ({ items: [1, 2, 3] }))
      const usesAwaitedReturnType = /Awaited<ReturnType<TLoader>>/.test(source)
      return usesAwaitedReturnType && Array.isArray(result.items) && result.items.length === 3
        ? []
        : ['`resolveLoaderData` 需要正确返回 loader 结果，并用 `Awaited<ReturnType<TLoader>>` 标注返回类型。']
    },
  }),
  moduleExercise({
    slug: 'ts-13-entity-map',
    track: 'TypeScript',
    title: 'TypeScript 13/14：泛型约束',
    file: 'exercises/02-typescript/13-createEntityMap.ts',
    concept: '“任何有 id 的实体都能复用这个工具”是前端里非常高频的泛型约束场景。',
    instructions: ['约束 `T` 一定有 `id`。', '返回一个按 `id` 建好的映射对象。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { createEntityMap } = await importExerciseModule(exercise.file)
      const result = createEntityMap([
        { id: 1, title: 'Build' },
        { id: 2, title: 'Ship' },
      ])
      const usesConstraint = /function\s+createEntityMap<\s*T\s+extends\s+\{\s*id:\s*(string\s*\|\s*number|number\s*\|\s*string)\s*\}\s*>/.test(source)
      return usesConstraint && result[1]?.title === 'Build' && result[2]?.title === 'Ship'
        ? []
        : ['`createEntityMap` 需要给泛型加上 `id` 约束，并返回按 id 建的映射。']
    },
  }),
  moduleExercise({
    slug: 'ts-14-is-tab',
    track: 'TypeScript',
    title: 'TypeScript 14/14：as const + 派生联合类型',
    file: 'exercises/02-typescript/14-isTab.ts',
    concept: '从常量数组派生联合类型，是前端路由名、tab 名、权限名里非常常见的写法。',
    instructions: ['给 `tabs` 加上 `as const`。', '让 `Tab` 从 `tabs` 派生出来。', '实现 `isTab`。'],
    async validate(_, exercise) {
      const source = fs.readFileSync(path.join(rootDir, exercise.file), 'utf8')
      const { isTab } = await importExerciseModule(exercise.file)
      const usesAsConst = /const\s+tabs\s*=\s*\[[^\]]+\]\s+as\s+const/.test(source)
      const derivesTab = /type\s+Tab\s*=\s*\(typeof\s+tabs\)\[number\]/.test(source)
      return usesAsConst && derivesTab && isTab('members') === true && isTab('billing') === false
        ? []
        : ['`tabs` 需要用 `as const`，`Tab` 需要从 `tabs` 派生，并正确实现 `isTab`。']
    },
  }),
  moduleExercise({
    slug: 'node-01-join-study-path',
    track: 'Node.js',
    title: 'Node.js 1/8：path.join',
    file: 'exercises/34-nodejs/01-joinStudyPath.ts',
    concept: '做脚本、CLI、构建工具和本地开发服务时，路径拼接是最基础也最高频的动作。',
    instructions: ['用 `path.join` 把 `front-study` 和传入片段拼起来。'],
    async validate(_, exercise) {
      const { joinStudyPath } = await importExerciseModule(exercise.file)
      return joinStudyPath('vue3-component-lab', 'src') === path.join('front-study', 'vue3-component-lab', 'src')
        ? []
        : ['`joinStudyPath` 还没有正确使用 `path.join`。']
    },
  }),
  moduleExercise({
    slug: 'node-02-read-json-file',
    track: 'Node.js',
    title: 'Node.js 2/8：fs/promises readFile + JSON.parse',
    file: 'exercises/34-nodejs/02-readJsonFile.ts',
    concept: 'Node 脚本里读配置、读 mock、读本地数据文件非常常见。',
    instructions: ['用 `readFile` 读取 utf8。', '用 `JSON.parse` 返回对象。'],
    async validate(_, exercise) {
      const { readJsonFile } = await importExerciseModule(exercise.file)
      const tempFile = path.join(os.tmpdir(), `vue-lings-read-json-${Date.now()}.json`)
      fs.writeFileSync(tempFile, JSON.stringify({ name: 'Ada', tasks: 3 }))
      const result = await readJsonFile(tempFile)
      fs.unlinkSync(tempFile)
      return result.name === 'Ada' && result.tasks === 3
        ? []
        : ['`readJsonFile` 还没有正确读取并解析 JSON 文件。']
    },
  }),
  moduleExercise({
    slug: 'node-03-write-pretty-json',
    track: 'Node.js',
    title: 'Node.js 3/8：fs/promises writeFile',
    file: 'exercises/34-nodejs/03-writePrettyJson.ts',
    concept: '写配置、输出调试结果、生成脚本产物时，很常需要写格式化 JSON。',
    instructions: ['把对象写成两空格缩进的 JSON。', '末尾补一个换行。'],
    async validate(_, exercise) {
      const { writePrettyJson } = await importExerciseModule(exercise.file)
      const tempFile = path.join(os.tmpdir(), `vue-lings-write-json-${Date.now()}.json`)
      await writePrettyJson(tempFile, { id: 1, title: 'Build' })
      const content = fs.readFileSync(tempFile, 'utf8')
      fs.unlinkSync(tempFile)
      return content === '{\n  "id": 1,\n  "title": "Build"\n}\n'
        ? []
        : ['`writePrettyJson` 需要写出两空格缩进并带结尾换行的 JSON。']
    },
  }),
  moduleExercise({
    slug: 'node-04-read-port',
    track: 'Node.js',
    title: 'Node.js 4/8：process.env',
    file: 'exercises/34-nodejs/04-readPortFromEnv.ts',
    concept: '读取环境变量是 Node 服务、脚本和本地开发服务的基本功。',
    instructions: ['读取 `PORT`。', '把它解析成正整数。', '无效时回退到 fallback。'],
    async validate(_, exercise) {
      const { readPortFromEnv } = await importExerciseModule(exercise.file)
      const valid = readPortFromEnv({ PORT: '4173' }, 3000)
      const invalid = readPortFromEnv({ PORT: 'abc' }, 3000)
      const missing = readPortFromEnv({}, 3000)
      return valid === 4173 && invalid === 3000 && missing === 3000
        ? []
        : ['`readPortFromEnv` 还没有正确处理合法值、无效值和缺失值。']
    },
  }),
  moduleExercise({
    slug: 'node-05-basic-auth',
    track: 'Node.js',
    title: 'Node.js 5/8：Buffer + Base64',
    file: 'exercises/34-nodejs/05-createBasicAuthHeader.ts',
    concept: '`Buffer` 在 Node 里处理编码、二进制和基础认证头时非常常见。',
    instructions: ['用 `Buffer` 把 `username:password` 编成 Base64。', '返回 `Basic ...` 头。'],
    async validate(_, exercise) {
      const { createBasicAuthHeader } = await importExerciseModule(exercise.file)
      return createBasicAuthHeader('ada', 'secret') === 'Basic YWRhOnNlY3JldA=='
        ? []
        : ['`createBasicAuthHeader` 返回值不对。']
    },
  }),
  moduleExercise({
    slug: 'node-06-build-callback-url',
    track: 'Node.js',
    title: 'Node.js 6/8：URL + URLSearchParams',
    file: 'exercises/34-nodejs/06-buildCallbackUrl.ts',
    concept: '回调地址、代理地址、跳转地址生成时，Node 里最稳的方式就是用 URL 对象。',
    instructions: ['用 `URL` 构建 `/auth/callback`。', '用 `URLSearchParams` 挂上 `code` 和 `state`。'],
    async validate(_, exercise) {
      const { buildCallbackUrl } = await importExerciseModule(exercise.file)
      return buildCallbackUrl('https://example.com/base', { code: 'abc', state: 'xyz' }) === 'https://example.com/auth/callback?code=abc&state=xyz'
        ? []
        : ['`buildCallbackUrl` 还没有正确生成回调地址。']
    },
  }),
  moduleExercise({
    slug: 'node-07-task-emitter',
    track: 'Node.js',
    title: 'Node.js 7/8：EventEmitter',
    file: 'exercises/34-nodejs/07-createTaskEmitter.ts',
    concept: 'Node 里的事件模型在 CLI、插件、dev server 和某些中间层里都很常见。',
    instructions: ['创建 `EventEmitter`。', '暴露 `emitCreated(title)`，触发 `task:created`。'],
    async validate(_, exercise) {
      const { createTaskEmitter } = await importExerciseModule(exercise.file)
      const { emitter, emitCreated } = createTaskEmitter()
      let received = null
      emitter.on('task:created', payload => {
        received = payload
      })
      emitCreated('Ship it')
      return received?.title === 'Ship it'
        ? []
        : ['`createTaskEmitter` 还没有正确发出 `task:created` 事件。']
    },
  }),
  moduleExercise({
    slug: 'node-08-append-log-line',
    track: 'Node.js',
    title: 'Node.js 8/8：appendFile',
    file: 'exercises/34-nodejs/08-appendLogLine.ts',
    concept: '脚本日志、任务流水、调试输出里，经常会做逐行追加写入。',
    instructions: ['用 `appendFile` 追加一行文本，并补上换行。'],
    async validate(_, exercise) {
      const { appendLogLine } = await importExerciseModule(exercise.file)
      const tempFile = path.join(os.tmpdir(), `vue-lings-append-log-${Date.now()}.log`)
      await appendLogLine(tempFile, 'first')
      await appendLogLine(tempFile, 'second')
      const content = fs.readFileSync(tempFile, 'utf8')
      fs.unlinkSync(tempFile)
      return content === 'first\nsecond\n'
        ? []
        : ['`appendLogLine` 还没有正确逐行追加内容。']
    },
  }),
  moduleExercise({
    slug: 'composable-01-use-counter',
    track: 'Composables',
    title: 'Composables 1/3：useCounter',
    file: 'exercises/27-composables/01-useCounter.ts',
    concept: 'composable 是 Vue 实战里非常高频的抽逻辑方式，值得单独成组练。',
    instructions: [
      '创建 `count` ref。',
      '实现 `increment` 和 `decrement`。',
      '暴露 `isPositive` 计算属性。',
    ],
    async validate(_, exercise) {
      const { useCounter } = await importExerciseModule(exercise.file)
      const counter = useCounter(1)
      counter.increment()
      counter.decrement()
      const failures = []

      if (counter.count.value !== 1) {
        failures.push('increment/decrement 后，count 应该回到 1。')
      }
      if (counter.isPositive.value !== true) {
        failures.push('`isPositive` 计算结果不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'composable-02-use-toggle',
    track: 'Composables',
    title: 'Composables 2/3：useToggle',
    file: 'exercises/27-composables/02-useToggle.ts',
    concept: '很多 UI 状态都是开关型的，这类 composable 会反复出现。',
    instructions: [
      '创建 `value` ref。',
      '实现 `toggle`。',
      '实现 `set(next)`。',
    ],
    async validate(_, exercise) {
      const { useToggle } = await importExerciseModule(exercise.file)
      const toggle = useToggle(false)
      toggle.toggle()
      const afterToggle = toggle.value.value
      toggle.set(false)
      const failures = []

      if (afterToggle !== true) {
        failures.push('`toggle()` 没有把值切成 true。')
      }
      if (toggle.value.value !== false) {
        failures.push('`set(false)` 没有正确设置值。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'composable-03-use-filtered-list',
    track: 'Composables',
    title: 'Composables 3/3：useFilteredList',
    file: 'exercises/27-composables/03-useFilteredList.ts',
    concept: '把筛选逻辑抽成 composable，比把逻辑塞在组件里更接近真实项目写法。',
    instructions: [
      '返回一个 computed 列表。',
      'query 需要 trim + lowercase。',
      '空 query 返回全部数据。',
    ],
    async validate(_, exercise) {
      const vue = await import('vue')
      const { useFilteredList } = await importExerciseModule(exercise.file)
      const items = vue.ref([{ title: 'Build App' }, { title: 'Write Docs' }])
      const query = vue.ref(' build ')
      const filtered = useFilteredList(items, query)
      const failures = []

      if (filtered.value.length !== 1 || filtered.value[0].title !== 'Build App') {
        failures.push('过滤逻辑还不对。')
      }

      query.value = ''
      if (filtered.value.length !== 2) {
        failures.push('空 query 时应该返回全部数据。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'browser-01-build-json-request',
    track: '浏览器与网络',
    title: '浏览器与网络 1/3：构建 JSON 请求配置',
    file: 'exercises/21-browser-network/01-buildJsonRequest.ts',
    concept: '把请求配置标准化，是前端网络层最常见的第一步。',
    instructions: [
      '返回包含 `method`、`credentials`、`headers` 的对象。',
      '有 payload 时补上 `body: JSON.stringify(payload)`。',
    ],
    async validate(_, exercise) {
      const { buildJsonRequest } = await importExerciseModule(exercise.file)
      const result = buildJsonRequest('POST', { id: 1 })
      const failures = []

      if (result.method !== 'POST') {
        failures.push('`method` 还没有正确透传。')
      }
      if (result.credentials !== 'include') {
        failures.push('`credentials` 应该是 `include`。')
      }
      if (result.headers?.Accept !== 'application/json' || result.headers?.['Content-Type'] !== 'application/json') {
        failures.push('还没有补齐 JSON 请求头。')
      }
      if (result.body !== JSON.stringify({ id: 1 })) {
        failures.push('有 payload 时还没有正确设置 `body`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'browser-02-should-preflight',
    track: '浏览器与网络',
    title: '浏览器与网络 2/3：判断是否会触发预检请求',
    file: 'exercises/21-browser-network/02-shouldPreflight.ts',
    concept: '理解 CORS 预检规则，是浏览器网络层必须补的一块。',
    instructions: [
      '非 GET/HEAD/POST 方法返回 true。',
      '带 Authorization 等非简单头时返回 true。',
      '简单请求返回 false。',
    ],
    async validate(_, exercise) {
      const { shouldPreflight } = await importExerciseModule(exercise.file)
      const failures = []

      if (shouldPreflight('PUT', {}) !== true) {
        failures.push('PUT 请求应该触发预检。')
      }
      if (shouldPreflight('GET', { Authorization: 'Bearer token' }) !== true) {
        failures.push('带 Authorization 头时应该触发预检。')
      }
      if (shouldPreflight('POST', { Accept: 'application/json' }) !== false) {
        failures.push('简单 POST 请求不该触发预检。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'browser-03-parse-cache-control',
    track: '浏览器与网络',
    title: '浏览器与网络 3/3：解析缓存控制头',
    file: 'exercises/21-browser-network/03-parseCacheControl.ts',
    concept: '缓存策略会直接影响前端性能和数据一致性，值得单独练一题。',
    instructions: [
      '解析 `no-store`。',
      '解析 `max-age=...`。',
      '没有 `max-age` 时返回 `null`。',
    ],
    async validate(_, exercise) {
      const { parseCacheControl } = await importExerciseModule(exercise.file)
      const a = parseCacheControl('public, max-age=120')
      const b = parseCacheControl('no-store, private')
      const failures = []

      if (a.noStore !== false || a.maxAge !== 120) {
        failures.push('`max-age=120` 的解析结果不对。')
      }
      if (b.noStore !== true || b.maxAge !== null) {
        failures.push('`no-store` 的解析结果不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'dom-01-handle-enter-submit',
    track: 'DOM 与事件',
    title: 'DOM 与事件 1/3：Enter 提交',
    file: 'exercises/28-dom-events/01-handleEnterSubmit.ts',
    concept: '事件处理是前端最基础也最高频的一层逻辑。',
    instructions: [
      '按下 Enter 时调用 preventDefault。',
      '按下 Enter 时调用 submit。',
    ],
    async validate(_, exercise) {
      const { handleEnterSubmit } = await importExerciseModule(exercise.file)
      let prevented = false
      let submitted = false
      handleEnterSubmit(
        { key: 'Enter', preventDefault: () => { prevented = true } },
        () => { submitted = true },
      )
      return prevented && submitted ? [] : ['Enter 键处理逻辑还不对。']
    },
  }),
  moduleExercise({
    slug: 'dom-02-ignore-click-outside',
    track: 'DOM 与事件',
    title: 'DOM 与事件 2/3：忽略特定区域的 outside click',
    file: 'exercises/28-dom-events/02-shouldIgnoreClickOutside.ts',
    concept: 'outside click 和弹层关闭逻辑在真实项目里极其常见。',
    instructions: [
      '命中 `[data-ignore-outside]` 时返回 true。',
    ],
    async validate(_, exercise) {
      const { shouldIgnoreClickOutside } = await importExerciseModule(exercise.file)
      const inside = shouldIgnoreClickOutside({ closest: (selector) => selector === '[data-ignore-outside]' ? {} : null })
      const outside = shouldIgnoreClickOutside({ closest: () => null })
      return inside === true && outside === false ? [] : ['outside click 忽略判断还不对。']
    },
  }),
  moduleExercise({
    slug: 'dom-03-shortcut-label',
    track: 'DOM 与事件',
    title: 'DOM 与事件 3/3：快捷键标签',
    file: 'exercises/28-dom-events/03-buildKeyShortcutLabel.ts',
    concept: '快捷键文案在命令面板、编辑器、后台工具页都很常见。',
    instructions: [
      '把修饰键和 key 用 `+` 连接起来。',
    ],
    async validate(_, exercise) {
      const { buildKeyShortcutLabel } = await importExerciseModule(exercise.file)
      return buildKeyShortcutLabel({ meta: true, shift: true, key: 'K' }) === 'Meta+Shift+K'
        ? []
        : ['快捷键标签拼接还不对。']
    },
  }),
  moduleExercise({
    slug: 'a11y-01-build-input-aria',
    track: '可访问性',
    title: '可访问性 1/3：表单 aria 属性',
    file: 'exercises/29-accessibility/01-buildInputAria.ts',
    concept: '表单可访问性是最容易落地也最容易遗漏的一块。',
    instructions: [
      '始终设置 `aria-describedby`。',
      'invalid 时设置 `aria-invalid` 并拼接 errorId。',
    ],
    async validate(_, exercise) {
      const { buildInputAria } = await importExerciseModule(exercise.file)
      const ok = buildInputAria({ invalid: false, descriptionId: 'desc', errorId: 'err' })
      const bad = buildInputAria({ invalid: true, descriptionId: 'desc', errorId: 'err' })
      const failures = []

      if (ok['aria-describedby'] !== 'desc') {
        failures.push('正常状态下的 `aria-describedby` 不对。')
      }
      if (bad['aria-invalid'] !== true || bad['aria-describedby'] !== 'desc err') {
        failures.push('错误状态下的 aria 属性不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'a11y-02-dialog-props',
    track: '可访问性',
    title: '可访问性 2/3：Dialog 基础无障碍属性',
    file: 'exercises/29-accessibility/02-getDialogA11yProps.ts',
    concept: '模态框的语义和关联关系，是无障碍里最经典的一组属性。',
    instructions: [
      '返回 dialog 基础属性对象。',
    ],
    async validate(_, exercise) {
      const { getDialogA11yProps } = await importExerciseModule(exercise.file)
      const result = getDialogA11yProps('title-id', 'desc-id')
      const failures = []

      if (
        result.role !== 'dialog' ||
        result['aria-modal'] !== true ||
        result['aria-labelledby'] !== 'title-id' ||
        result['aria-describedby'] !== 'desc-id'
      ) {
        failures.push('Dialog 的基础无障碍属性还不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'a11y-03-interactive-key',
    track: '可访问性',
    title: '可访问性 3/3：可交互键盘按键',
    file: 'exercises/29-accessibility/03-isInteractiveKey.ts',
    concept: '很多自定义可点击元素，都需要补 Enter/Space 键盘支持。',
    instructions: [
      'Enter 和 Space 返回 true。',
    ],
    async validate(_, exercise) {
      const { isInteractiveKey } = await importExerciseModule(exercise.file)
      return (
        isInteractiveKey('Enter') === true &&
        isInteractiveKey(' ') === true &&
        isInteractiveKey('Escape') === false
      )
        ? []
        : ['可交互按键判断还不对。']
    },
  }),
  regexExercise({
    slug: 'testing-01-request-status-spec',
    track: '测试',
    title: '测试 1/2：写一个最小 Vitest 单测',
    file: 'exercises/22-testing/01-requestStatus.spec.ts',
    concept: '先从最小断言开始，把 describe / it / expect 的节奏练熟。',
    instructions: [
      '写一个 `describe`。',
      '补一个 loading -> loading 的测试。',
      '补一个 success -> done 的测试。',
    ],
    checks: [
      [/describe\(\s*['"`]requestStatus['"`]/, '还没有写 `describe("requestStatus")`。'],
      [/it\(\s*['"`].*loading.*['"`][\s\S]*expect\(\s*requestStatus\(\s*['"`]loading['"`]\s*\)\s*\)\.toBe\(\s*['"`]loading['"`]\s*\)/s, '还没有写 loading 分支测试。'],
      [/it\(\s*['"`].*success.*['"`][\s\S]*expect\(\s*requestStatus\(\s*['"`]success['"`]\s*\)\s*\)\.toBe\(\s*['"`]done['"`]\s*\)/s, '还没有写 success 分支测试。'],
    ],
  }),
  regexExercise({
    slug: 'testing-02-load-users-spec',
    track: '测试',
    title: '测试 2/2：对异步函数写成功和失败分支测试',
    file: 'exercises/22-testing/02-loadUsers.spec.ts',
    concept: '第二步就练真实一点的：异步函数 + mock + 两个分支。',
    instructions: [
      '用 `vi.fn()` mock fetcher。',
      '写 success 测试。',
      '写 error 测试。',
    ],
    checks: [
      [/vi\.fn\(\)/, '还没有用 `vi.fn()` mock fetcher。'],
      [/it\(\s*['"`].*success.*['"`]/, '还没有写 success 测试块。'],
      [/it\(\s*['"`].*error.*['"`]/, '还没有写 error 测试块。'],
      [/state:\s*['"`]success['"`]|toBe\(\s*['"`]success['"`]\s*\)/, '还没有断言 success 分支。'],
      [/state:\s*['"`]error['"`]|toBe\(\s*['"`]error['"`]\s*\)/, '还没有断言 error 分支。'],
    ],
  }),
  moduleExercise({
    slug: 'perf-01-image-loading',
    track: '性能',
    title: '性能 1/3：选择图片加载策略',
    file: 'exercises/23-performance/01-chooseImageLoading.ts',
    concept: '性能优化很多时候先是一个判断题：哪些资源该 eager，哪些该 lazy。',
    instructions: [
      '首屏图片返回 `eager`。',
      '非首屏图片返回 `lazy`。',
    ],
    async validate(_, exercise) {
      const { chooseImageLoading } = await importExerciseModule(exercise.file)
      const failures = []

      if (chooseImageLoading(true) !== 'eager') {
        failures.push('首屏图片应该返回 `eager`。')
      }
      if (chooseImageLoading(false) !== 'lazy') {
        failures.push('非首屏图片应该返回 `lazy`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'perf-02-build-list-window',
    track: '性能',
    title: '性能 2/3：列表窗口化的最小思路',
    file: 'exercises/23-performance/02-buildListWindow.ts',
    concept: '大列表优化的核心之一就是：只处理当前窗口的数据。',
    instructions: [
      '返回当前窗口的 slice。',
    ],
    async validate(_, exercise) {
      const { buildListWindow } = await importExerciseModule(exercise.file)
      const result = buildListWindow([1, 2, 3, 4, 5], 1, 2)
      return JSON.stringify(result) === JSON.stringify([2, 3])
        ? []
        : ['`buildListWindow` 应该返回 `[2, 3]`。']
    },
  }),
  moduleExercise({
    slug: 'perf-03-should-preconnect',
    track: '性能',
    title: '性能 3/3：判断是否值得 preconnect',
    file: 'exercises/23-performance/03-shouldPreconnectOrigin.ts',
    concept: '连接优化不是越多越好，关键是关键资源和跨域来源。',
    instructions: [
      'critical 为 true 且来源不同才返回 true。',
    ],
    async validate(_, exercise) {
      const { shouldPreconnectOrigin } = await importExerciseModule(exercise.file)
      const failures = []

      if (shouldPreconnectOrigin('https://app.test', 'https://cdn.test', true) !== true) {
        failures.push('关键跨域资源应该返回 true。')
      }
      if (shouldPreconnectOrigin('https://app.test', 'https://app.test', true) !== false) {
        failures.push('同源资源不需要 preconnect。')
      }
      if (shouldPreconnectOrigin('https://app.test', 'https://cdn.test', false) !== false) {
        failures.push('非关键资源不该 preconnect。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'auth-01-cookie-options',
    track: '认证',
    title: '认证 1/3：构建安全 cookie 配置',
    file: 'exercises/24-authentication/01-createAuthCookieOptions.ts',
    concept: '后端出身做前端 full stack，这题会很有感觉：安全 cookie 是登录体系的基本功。',
    instructions: [
      '返回安全 cookie 配置对象。',
    ],
    async validate(_, exercise) {
      const { createAuthCookieOptions } = await importExerciseModule(exercise.file)
      const result = createAuthCookieOptions(3600)
      const failures = []

      if (
        result.httpOnly !== true ||
        result.secure !== true ||
        result.sameSite !== 'lax' ||
        result.path !== '/' ||
        result.maxAge !== 3600
      ) {
        failures.push('cookie 配置对象还不完整或默认值不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'auth-02-can-access-admin',
    track: '认证',
    title: '认证 2/3：角色与封禁状态判断',
    file: 'exercises/24-authentication/02-canAccessAdmin.ts',
    concept: '权限判断很适合做成纯函数，清晰、可测、易复用。',
    instructions: [
      '只有 admin 且未封禁时返回 true。',
    ],
    async validate(_, exercise) {
      const { canAccessAdmin } = await importExerciseModule(exercise.file)
      const failures = []

      if (canAccessAdmin({ role: 'admin', suspended: false }) !== true) {
        failures.push('正常 admin 应该能访问。')
      }
      if (canAccessAdmin({ role: 'admin', suspended: true }) !== false) {
        failures.push('被封禁 admin 不该访问。')
      }
      if (canAccessAdmin({ role: 'editor', suspended: false }) !== false) {
        failures.push('非 admin 不该访问。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'auth-03-attach-bearer',
    track: '认证',
    title: '认证 3/3：附加 Bearer Token',
    file: 'exercises/24-authentication/03-attachBearerToken.ts',
    concept: '认证信息拼接是最基础也最常见的一层网络封装。',
    instructions: [
      'token 为空时返回原 headers。',
      '有 token 时返回带 Authorization 的新对象。',
    ],
    async validate(_, exercise) {
      const { attachBearerToken } = await importExerciseModule(exercise.file)
      const base = { Accept: 'application/json' }
      const withToken = attachBearerToken(base, 'abc')
      const withoutToken = attachBearerToken(base, null)
      const failures = []

      if (withoutToken !== base) {
        failures.push('token 为空时应该直接返回原对象。')
      }
      if (withToken === base) {
        failures.push('有 token 时应该返回新对象。')
      }
      if (withToken.Authorization !== 'Bearer abc' || withToken.Accept !== 'application/json') {
        failures.push('Authorization 头还没有正确附加。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'storage-01-safe-read-json',
    track: '浏览器存储',
    title: '浏览器存储 1/3：安全读取 JSON',
    file: 'exercises/30-browser-storage/01-safeReadJson.ts',
    concept: '浏览器存储最常见的问题不是写，而是读坏数据时别把页面搞崩。',
    instructions: [
      'null 返回 fallback。',
      'JSON 解析失败也返回 fallback。',
    ],
    async validate(_, exercise) {
      const { safeReadJson } = await importExerciseModule(exercise.file)
      const failures = []

      if (safeReadJson(null, { ok: false }).ok !== false) {
        failures.push('null 分支还不对。')
      }
      if (safeReadJson('{"ok":true}', { ok: false }).ok !== true) {
        failures.push('正常 JSON 解析还不对。')
      }
      if (safeReadJson('{oops}', { ok: false }).ok !== false) {
        failures.push('解析失败时应该回退。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'storage-02-build-storage-key',
    track: '浏览器存储',
    title: '浏览器存储 2/3：统一 storage key',
    file: 'exercises/30-browser-storage/02-buildStorageKey.ts',
    concept: '统一 key 规则能避免 localStorage / sessionStorage 到处散落魔法字符串。',
    instructions: [
      '返回 `front-study:${scope}:${name}`。',
    ],
    async validate(_, exercise) {
      const { buildStorageKey } = await importExerciseModule(exercise.file)
      return buildStorageKey('filters', 'issues') === 'front-study:filters:issues'
        ? []
        : ['storage key 拼接还不对。']
    },
  }),
  moduleExercise({
    slug: 'storage-03-merge-recent-searches',
    track: '浏览器存储',
    title: '浏览器存储 3/3：维护最近搜索记录',
    file: 'exercises/30-browser-storage/03-mergeRecentSearches.ts',
    concept: '最近搜索、历史筛选、最近访问这些都是很常见的本地存储需求。',
    instructions: [
      'trim 查询词。',
      '忽略空值。',
      '重复项前置。',
      '限制数量。',
    ],
    async validate(_, exercise) {
      const { mergeRecentSearches } = await importExerciseModule(exercise.file)
      const result = mergeRecentSearches(['alpha', 'beta', 'gamma'], ' beta ', 3)
      return JSON.stringify(result) === JSON.stringify(['beta', 'alpha', 'gamma'])
        ? []
        : ['最近搜索合并逻辑还不对。']
    },
  }),
  moduleExercise({
    slug: 'upload-01-validate-file',
    track: '文件上传',
    title: '文件上传 1/3：校验上传文件',
    file: 'exercises/31-file-upload/01-validateUploadFile.ts',
    concept: '文件上传第一步几乎永远是前端预校验。',
    instructions: [
      '只接受 png/jpeg。',
      '限制 2MB。',
      '返回 ok/error 结构。',
    ],
    async validate(_, exercise) {
      const { validateUploadFile } = await importExerciseModule(exercise.file)
      const ok = validateUploadFile({ name: 'a.png', size: 1024, type: 'image/png' })
      const badType = validateUploadFile({ name: 'a.pdf', size: 1024, type: 'application/pdf' })
      const badSize = validateUploadFile({ name: 'b.jpg', size: 3 * 1024 * 1024, type: 'image/jpeg' })
      const failures = []

      if (ok.ok !== true) {
        failures.push('合法图片文件应该通过。')
      }
      if (badType.ok !== false) {
        failures.push('非法类型应该失败。')
      }
      if (badSize.ok !== false) {
        failures.push('超过 2MB 应该失败。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'upload-02-preview-url',
    track: '文件上传',
    title: '文件上传 2/3：预览地址',
    file: 'exercises/31-file-upload/02-getUploadPreviewUrl.ts',
    concept: '图片上传预览是最常见的一种文件上传交互。',
    instructions: [
      'file 为空时返回空字符串。',
      '否则调用 `createObjectURL`。',
    ],
    async validate(_, exercise) {
      const { getUploadPreviewUrl } = await importExerciseModule(exercise.file)
      const result = getUploadPreviewUrl(() => 'blob:preview', {})
      const empty = getUploadPreviewUrl(() => 'blob:preview', null)
      return result === 'blob:preview' && empty === ''
        ? []
        : ['预览地址逻辑还不对。']
    },
  }),
  moduleExercise({
    slug: 'upload-03-upload-state',
    track: '文件上传',
    title: '文件上传 3/3：上传进度状态',
    file: 'exercises/31-file-upload/03-buildUploadState.ts',
    concept: '上传 UI 很依赖稳定的阶段状态，不然按钮、进度条和提示都不好渲染。',
    instructions: [
      '0 或以下 -> idle。',
      '1-99 -> uploading。',
      '100 及以上 -> success。',
    ],
    async validate(_, exercise) {
      const { buildUploadState } = await importExerciseModule(exercise.file)
      return (
        buildUploadState(0) === 'idle' &&
        buildUploadState(34) === 'uploading' &&
        buildUploadState(100) === 'success'
      )
        ? []
        : ['上传进度状态判断还不对。']
    },
  }),
  moduleExercise({
    slug: 'nuxt-ssr-01-render-strategy',
    track: 'Nuxt SSR',
    title: 'Nuxt SSR 1/2：选择渲染策略',
    file: 'exercises/25-nuxt-ssr/01-chooseRenderStrategy.ts',
    concept: '同构框架里非常重要的一件事，就是先判断这个页面该 SSR、CSR 还是静态生成。',
    instructions: [
      'SEO 关键且非个性化 -> ssr。',
      '实时数据且非 SEO 关键 -> csr。',
      '其他 -> ssg。',
    ],
    async validate(_, exercise) {
      const { chooseRenderStrategy } = await importExerciseModule(exercise.file)
      const failures = []

      if (chooseRenderStrategy({ seoCritical: true, personalized: false, liveData: false }) !== 'ssr') {
        failures.push('SEO 关键页面应该选 `ssr`。')
      }
      if (chooseRenderStrategy({ seoCritical: false, personalized: true, liveData: true }) !== 'csr') {
        failures.push('实时数据页面应该选 `csr`。')
      }
      if (chooseRenderStrategy({ seoCritical: false, personalized: false, liveData: false }) !== 'ssg') {
        failures.push('普通静态页面应该选 `ssg`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'nuxt-ssr-02-async-data-options',
    track: 'Nuxt SSR',
    title: 'Nuxt SSR 2/2：构造 useAsyncData 选项',
    file: 'exercises/25-nuxt-ssr/02-buildAsyncDataOptions.ts',
    concept: '这题专门练 Nuxt 数据层里常见的 `{ server, lazy, default }` 结构。',
    instructions: [
      '返回 `{ server, lazy, default: () => [] }`。',
    ],
    async validate(_, exercise) {
      const { buildAsyncDataOptions } = await importExerciseModule(exercise.file)
      const result = buildAsyncDataOptions(true, false)
      const failures = []

      if (result.server !== true || result.lazy !== false) {
        failures.push('`server` 和 `lazy` 透传不对。')
      }
      if (!Array.isArray(result.default()) || result.default().length !== 0) {
        failures.push('`default` 应该返回空数组。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'admin-01-issue-filters',
    track: '完整后台实战',
    title: '完整后台实战 1/3：后台列表筛选',
    file: 'exercises/26-admin-dashboard/01-applyIssueFilters.ts',
    concept: '后台页面里最常见的不是花哨 UI，而是列表、筛选、状态和搜索。',
    instructions: [
      '按标题做 query 过滤。',
      '按状态做 status 过滤。',
    ],
    async validate(_, exercise) {
      const { applyIssueFilters } = await importExerciseModule(exercise.file)
      const issues = [
        { id: 1, title: 'Fix login bug', status: 'open', assignee: 'Ada' },
        { id: 2, title: 'Write docs', status: 'closed', assignee: 'Mina' },
      ]
      const a = applyIssueFilters(issues, { query: 'login', status: 'all' })
      const b = applyIssueFilters(issues, { query: '', status: 'closed' })
      const failures = []

      if (a.length !== 1 || a[0].id !== 1) {
        failures.push('query 过滤还不对。')
      }
      if (b.length !== 1 || b[0].id !== 2) {
        failures.push('status 过滤还不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'admin-02-sort-table-rows',
    track: '完整后台实战',
    title: '完整后台实战 2/3：表格排序',
    file: 'exercises/26-admin-dashboard/02-sortTableRows.ts',
    concept: '管理后台的另一个基本功是表格排序，而且通常要求不可变处理。',
    instructions: [
      '返回新的排序数组。',
      '支持 asc 和 desc。',
    ],
    async validate(_, exercise) {
      const { sortTableRows } = await importExerciseModule(exercise.file)
      const source = [
        { id: 1, score: 30 },
        { id: 2, score: 10 },
        { id: 3, score: 20 },
      ]
      const asc = sortTableRows(source, 'asc')
      const desc = sortTableRows(source, 'desc')
      const failures = []

      if (asc === source || desc === source) {
        failures.push('排序时应该返回新数组。')
      }
      if (JSON.stringify(asc.map((item) => item.id)) !== JSON.stringify([2, 3, 1])) {
        failures.push('升序排序结果不对。')
      }
      if (JSON.stringify(desc.map((item) => item.id)) !== JSON.stringify([1, 3, 2])) {
        failures.push('降序排序结果不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'admin-03-pagination-state',
    track: '完整后台实战',
    title: '完整后台实战 3/3：分页状态',
    file: 'exercises/26-admin-dashboard/03-buildPaginationState.ts',
    concept: '分页是后台页面的高频需求，很适合练成一个稳定的纯函数。',
    instructions: [
      '返回带 totalPages 的分页状态。',
    ],
    async validate(_, exercise) {
      const { buildPaginationState } = await importExerciseModule(exercise.file)
      const result = buildPaginationState(2, 20, 95)
      return (
        result.page === 2 &&
        result.pageSize === 20 &&
        result.total === 95 &&
        result.totalPages === 5
      )
        ? []
        : ['分页状态返回值不对，`totalPages` 应该是 5。']
    },
  }),
  moduleExercise({
    slug: 'realtime-01-build-sse-url',
    track: 'SSE / WebSocket',
    title: 'SSE / WebSocket 1/4：构造 SSE 订阅地址',
    file: 'exercises/32-sse-websocket/01-buildSseUrl.ts',
    concept: '很多 AI 流式接口第一步就是先把订阅地址和 query 参数拼对。',
    instructions: [
      '把路径改成 `/sse`。',
      '写入 `topic` query。',
      '写入 `usage` query。',
    ],
    async validate(_, exercise) {
      const { buildSseUrl } = await importExerciseModule(exercise.file)
      const result = buildSseUrl('http://127.0.0.1:4310', 'Agent Sync', false)
      const url = new URL(result)
      const failures = []

      if (url.pathname !== '/sse') {
        failures.push('路径应该是 `/sse`。')
      }
      if (url.searchParams.get('topic') !== 'Agent Sync') {
        failures.push('`topic` query 还没有正确写入。')
      }
      if (url.searchParams.get('usage') !== 'false') {
        failures.push('`usage` query 还没有正确写入。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'realtime-02-reduce-sse-stream',
    track: 'SSE / WebSocket',
    title: 'SSE / WebSocket 2/4：累积 SSE 流状态',
    file: 'exercises/32-sse-websocket/02-reduceSseStream.ts',
    concept: 'SSE 真正的难点不在连上，而在把 token、usage、done 这些事件稳定收敛成 UI 状态。',
    instructions: [
      'token 事件要追加文本。',
      'usage 事件要格式化成 usage 字符串。',
      'done 事件要标记完成。',
    ],
    async validate(_, exercise) {
      const { reduceSseStream } = await importExerciseModule(exercise.file)
      const idle = { text: '', usage: '', done: false }
      const withToken = reduceSseStream(idle, { type: 'token', chunk: 'Hello' })
      const withUsage = reduceSseStream(withToken, {
        type: 'usage',
        promptTokens: 8,
        completionTokens: 12,
      })
      const completed = reduceSseStream(withUsage, { type: 'done' })
      const failures = []

      if (withToken.text !== 'Hello') {
        failures.push('token 事件还没有正确追加文本。')
      }
      if (withUsage.usage !== 'prompt 8 / completion 12') {
        failures.push('usage 事件格式化结果不对。')
      }
      if (completed.done !== true) {
        failures.push('done 事件还没有把 `done` 设成 true。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'realtime-03-create-socket-envelope',
    track: 'SSE / WebSocket',
    title: 'SSE / WebSocket 3/4：规范化 WebSocket 消息包',
    file: 'exercises/32-sse-websocket/03-createSocketEnvelope.ts',
    concept: '双向消息一旦没有统一 envelope，很快就会让客户端和服务端都变乱。',
    instructions: [
      '返回 `{ type, requestId, payload }`。',
    ],
    async validate(_, exercise) {
      const { createSocketEnvelope } = await importExerciseModule(exercise.file)
      const result = createSocketEnvelope('chat.prompt', 'req-1', { prompt: 'Explain SSE' })
      const failures = []

      if (result.type !== 'chat.prompt') {
        failures.push('`type` 没有正确透传。')
      }
      if (result.requestId !== 'req-1') {
        failures.push('`requestId` 没有正确透传。')
      }
      if (result.payload?.prompt !== 'Explain SSE') {
        failures.push('`payload` 没有正确透传。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'realtime-04-should-reconnect-socket',
    track: 'SSE / WebSocket',
    title: 'SSE / WebSocket 4/4：判断是否需要重连',
    file: 'exercises/32-sse-websocket/04-shouldReconnectSocket.ts',
    concept: '实时连接不是断了就重连，正常关闭和用户主动关闭都不该盲目重连。',
    instructions: [
      '手动关闭返回 false。',
      '1000 正常关闭返回 false。',
      '异常关闭返回 true。',
    ],
    async validate(_, exercise) {
      const { shouldReconnectSocket } = await importExerciseModule(exercise.file)
      const failures = []

      if (shouldReconnectSocket(1006, true) !== false) {
        failures.push('用户主动关闭时不该重连。')
      }
      if (shouldReconnectSocket(1000, false) !== false) {
        failures.push('正常关闭时不该重连。')
      }
      if (shouldReconnectSocket(1011, false) !== true) {
        failures.push('异常关闭时应该允许重连。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'collab-01-normalize-room',
    track: '协同编辑（Yjs）',
    title: '协同编辑（Yjs） 1/4：规范化 room name',
    file: 'exercises/33-collaboration-yjs/01-normalizeCollabRoom.ts',
    concept: '协同房间名最好一开始就定好规则，不然后面 URL、分享链接、服务端日志都会乱。',
    instructions: [
      'trim 输入。',
      '转小写。',
      '空白替换成 `-`。',
      '空字符串回退到默认 room。',
    ],
    async validate(_, exercise) {
      const { normalizeCollabRoom } = await importExerciseModule(exercise.file)
      const a = normalizeCollabRoom('  AI Sprint Room  ')
      const b = normalizeCollabRoom('   ')
      const failures = []

      if (a !== 'ai-sprint-room') {
        failures.push('room name 规范化结果应该是 `ai-sprint-room`。')
      }
      if (b !== 'front-study-collab') {
        failures.push('空 room 应该回退到 `front-study-collab`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'collab-02-create-y-todo-record',
    track: '协同编辑（Yjs）',
    title: '协同编辑（Yjs） 2/4：创建共享 Todo 记录',
    file: 'exercises/33-collaboration-yjs/02-createYTodoRecord.ts',
    concept: '协同编辑里更重要的是统一文档数据形状，而不是先上复杂 UI。',
    instructions: [
      '保留传入 id。',
      'trim 文本。',
      '默认 `done: false`。',
    ],
    async validate(_, exercise) {
      const { createYTodoRecord } = await importExerciseModule(exercise.file)
      const result = createYTodoRecord('todo-1', '  draft sync spec  ')
      const failures = []

      if (result.id !== 'todo-1') {
        failures.push('`id` 还没有正确保留。')
      }
      if (result.text !== 'draft sync spec') {
        failures.push('文本还没有 trim。')
      }
      if (result.done !== false) {
        failures.push('共享 todo 的默认 done 应该是 false。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'collab-03-find-y-todo-index',
    track: '协同编辑（Yjs）',
    title: '协同编辑（Yjs） 3/4：定位共享 Todo 下标',
    file: 'exercises/33-collaboration-yjs/03-findYTodoIndex.ts',
    concept: '协同文档里做 toggle、delete 时，常常需要先从快照里找到稳定索引。',
    instructions: [
      '按 id 查找下标。',
      '找不到时返回 -1。',
    ],
    async validate(_, exercise) {
      const { findYTodoIndex } = await importExerciseModule(exercise.file)
      const items = [
        { id: 'a', text: 'One', done: false },
        { id: 'b', text: 'Two', done: true },
      ]
      const failures = []

      if (findYTodoIndex(items, 'b') !== 1) {
        failures.push('id=b 的下标应该是 1。')
      }
      if (findYTodoIndex(items, 'missing') !== -1) {
        failures.push('找不到时应该返回 -1。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'collab-04-build-awareness-user',
    track: '协同编辑（Yjs）',
    title: '协同编辑（Yjs） 4/4：构造 awareness user',
    file: 'exercises/33-collaboration-yjs/04-buildAwarenessUser.ts',
    concept: 'presence 和协作者列表，本质上都是把本地用户信息写进 awareness state。',
    instructions: [
      'trim 名字。',
      '返回 `{ name, color }`。',
    ],
    async validate(_, exercise) {
      const { buildAwarenessUser } = await importExerciseModule(exercise.file)
      const result = buildAwarenessUser('  Ada  ', '#0f766e')
      const failures = []

      if (result.name !== 'Ada') {
        failures.push('用户名字还没有 trim。')
      }
      if (result.color !== '#0f766e') {
        failures.push('颜色还没有正确透传。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'data-layer-01-normalize-users',
    track: '数据层',
    title: '数据层 1/5：规范化实体列表',
    file: 'exercises/35-data-layer/01-normalizeUsers.ts',
    concept: '高级前端几乎都会把列表状态规范化成 byId + allIds，这样更新、缓存和共享都更稳。',
    instructions: [
      '返回 `{ byId, allIds }`。',
      'byId 以 `user.id` 为 key。',
      'allIds 保留原始顺序。',
    ],
    async validate(_, exercise) {
      const { normalizeUsers } = await importExerciseModule(exercise.file)
      const result = normalizeUsers([
        { id: 1, name: 'Ada' },
        { id: 2, name: 'Linus' },
      ])
      const failures = []

      if (result.byId?.[1]?.name !== 'Ada' || result.byId?.[2]?.name !== 'Linus') {
        failures.push('`byId` 还没有正确按 id 建立映射。')
      }
      if (JSON.stringify(result.allIds) !== JSON.stringify([1, 2])) {
        failures.push('`allIds` 还没有保留原始顺序。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'data-layer-02-build-query-key',
    track: '数据层',
    title: '数据层 2/5：构建稳定 query key',
    file: 'exercises/35-data-layer/02-buildQueryKey.ts',
    concept: '数据层里 query key 是否稳定，直接影响缓存命中、去重和失效策略。',
    instructions: [
      '返回数组 query key。',
      '第一个元素是 scope。',
      '第二个元素是规范化后的 filters 对象。',
    ],
    async validate(_, exercise) {
      const { buildQueryKey } = await importExerciseModule(exercise.file)
      const result = buildQueryKey('issues', { tag: 'bug', page: 2, showClosed: false })
      const failures = []

      if (!Array.isArray(result) || result.length !== 2) {
        failures.push('query key 应该是长度为 2 的数组。')
      }
      if (result[0] !== 'issues') {
        failures.push('query key 的第一个元素应该是 scope。')
      }
      if (JSON.stringify(result[1]) !== JSON.stringify({ page: 2, showClosed: false, tag: 'bug' })) {
        failures.push('filters 还没有规范化成稳定对象。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'data-layer-03-merge-pages',
    track: '数据层',
    title: '数据层 3/5：合并分页结果',
    file: 'exercises/35-data-layer/03-mergePaginatedPages.ts',
    concept: '无限滚动和分页缓存很容易出重复项，这题专门练稳定合并。',
    instructions: [
      '合并 previous 和 incoming。',
      '按 id 去重。',
      '保留首次出现顺序。',
    ],
    async validate(_, exercise) {
      const { mergePaginatedPages } = await importExerciseModule(exercise.file)
      const result = mergePaginatedPages(
        [
          { id: 1, title: 'A' },
          { id: 2, title: 'B' },
        ],
        [
          { id: 2, title: 'B2' },
          { id: 3, title: 'C' },
        ],
      )
      return JSON.stringify(result.map((item) => item.id)) === JSON.stringify([1, 2, 3])
        ? []
        : ['`mergePaginatedPages` 还没有正确去重并稳定合并分页结果。']
    },
  }),
  moduleExercise({
    slug: 'data-layer-04-optimistic-todo',
    track: '数据层',
    title: '数据层 4/5：乐观更新',
    file: 'exercises/35-data-layer/04-applyOptimisticTodo.ts',
    concept: '乐观更新是高级前端非常常见的交互优化点，核心是不可变和可回滚。',
    instructions: [
      '返回新数组。',
      '同 id 则替换。',
      '没有同 id 时追加。',
    ],
    async validate(_, exercise) {
      const { applyOptimisticTodo } = await importExerciseModule(exercise.file)
      const source = [{ id: 1, title: 'Draft', done: false }]
      const replaced = applyOptimisticTodo(source, { id: 1, title: 'Draft', done: true })
      const appended = applyOptimisticTodo(source, { id: 2, title: 'Ship', done: false })
      const failures = []

      if (replaced === source || appended === source) {
        failures.push('乐观更新题需要返回新数组。')
      }
      if (replaced[0]?.done !== true) {
        failures.push('同 id 的 todo 还没有被正确替换。')
      }
      if (JSON.stringify(appended.map((item) => item.id)) !== JSON.stringify([1, 2])) {
        failures.push('缺失项还没有被正确追加。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'data-layer-05-refetch-on-focus',
    track: '数据层',
    title: '数据层 5/5：窗口聚焦时是否重取',
    file: 'exercises/35-data-layer/05-shouldRefetchOnWindowFocus.ts',
    concept: '缓存策略不只是“要不要拉数据”，还包括什么时候该自动重取。',
    instructions: [
      '禁用时返回 false。',
      '启用时，仅在 `now >= staleAt` 时返回 true。',
    ],
    async validate(_, exercise) {
      const { shouldRefetchOnWindowFocus } = await importExerciseModule(exercise.file)
      return (
        shouldRefetchOnWindowFocus(100, 120, true) === true &&
        shouldRefetchOnWindowFocus(100, 80, true) === false &&
        shouldRefetchOnWindowFocus(100, 120, false) === false
      )
        ? []
        : ['`shouldRefetchOnWindowFocus` 判断还不对。']
    },
  }),
  moduleExercise({
    slug: 'security-01-sanitize-html',
    track: '安全',
    title: '安全 1/4：基础 HTML 清洗策略',
    file: 'exercises/36-security/01-sanitizeHtmlPolicy.ts',
    concept: '高级前端要对 XSS 敏感，哪怕不自己实现完整 sanitizer，也要理解最小策略。',
    instructions: [
      '去掉 `<script>` 块。',
      '去掉内联 on* 事件处理器。',
    ],
    async validate(_, exercise) {
      const { sanitizeHtmlPolicy } = await importExerciseModule(exercise.file)
      const result = sanitizeHtmlPolicy('<div onclick="alert(1)">ok</div><script>alert(2)</script>')
      const failures = []

      if (result.includes('<script') || result.includes('</script>')) {
        failures.push('`<script>` 块还没有被移除。')
      }
      if (/onclick\s*=/.test(result)) {
        failures.push('内联事件处理器还没有被移除。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'security-02-csrf-headers',
    track: '安全',
    title: '安全 2/4：构造 CSRF 头',
    file: 'exercises/36-security/02-buildCsrfHeaders.ts',
    concept: '表单和突变请求里，CSRF token 拼接是前端很常见的一层安全封装。',
    instructions: [
      'token 缺失时返回原对象。',
      '有 token 时返回新对象并带上 `x-csrf-token`。',
    ],
    async validate(_, exercise) {
      const { buildCsrfHeaders } = await importExerciseModule(exercise.file)
      const base = { Accept: 'application/json' }
      const same = buildCsrfHeaders(base, null)
      const next = buildCsrfHeaders(base, 'csrf-1')
      const failures = []

      if (same !== base) {
        failures.push('csrf token 缺失时应该直接返回原 headers。')
      }
      if (next === base) {
        failures.push('有 csrf token 时应该返回新对象。')
      }
      if (next['x-csrf-token'] !== 'csrf-1') {
        failures.push('`x-csrf-token` 还没有正确写入。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'security-03-validate-redirect',
    track: '安全',
    title: '安全 3/4：校验重定向地址',
    file: 'exercises/36-security/03-validateRedirectUrl.ts',
    concept: '开放重定向是很常见的安全问题，前端也常常需要先做一层兜底。',
    instructions: [
      '允许同源绝对地址。',
      '允许相对地址。',
      '其他情况回退到站点根路径。',
    ],
    async validate(_, exercise) {
      const { validateRedirectUrl } = await importExerciseModule(exercise.file)
      const origin = 'https://app.example.com'
      const sameOrigin = validateRedirectUrl('https://app.example.com/settings', origin)
      const relative = validateRedirectUrl('/dashboard', origin)
      const external = validateRedirectUrl('https://evil.example.com/phish', origin)
      const failures = []

      if (sameOrigin !== 'https://app.example.com/settings') {
        failures.push('同源绝对地址应该被允许。')
      }
      if (relative !== 'https://app.example.com/dashboard') {
        failures.push('相对地址应该被解析成同源完整地址。')
      }
      if (external !== 'https://app.example.com/') {
        failures.push('跨域地址应该回退到根路径。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'security-04-mask-token',
    track: '安全',
    title: '安全 4/4：脱敏敏感 token',
    file: 'exercises/36-security/04-maskToken.ts',
    concept: '调试日志和监控上报里，经常需要保留少量信息同时避免直接泄露敏感值。',
    instructions: [
      '保留前 4 位和后 4 位。',
      '中间用 `...` 代替。',
    ],
    async validate(_, exercise) {
      const { maskToken } = await importExerciseModule(exercise.file)
      return maskToken('abcd1234efgh5678') === 'abcd...5678'
        ? []
        : ['`maskToken` 还没有按前 4 位 + ... + 后 4 位脱敏。']
    },
  }),
  moduleExercise({
    slug: 'obs-01-build-error-event',
    track: '观测',
    title: '观测 1/4：标准化错误事件',
    file: 'exercises/37-observability/01-buildErrorEvent.ts',
    concept: '高级前端不仅要处理错误，还要把错误变成监控系统能消费的稳定事件。',
    instructions: [
      '返回 `{ message, route, userId, level }`。',
      'level 固定为 `error`。',
    ],
    async validate(_, exercise) {
      const { buildErrorEvent } = await importExerciseModule(exercise.file)
      const result = buildErrorEvent(new Error('network failed'), { route: '/issues', userId: 'u-1' })
      return (
        result.message === 'network failed' &&
        result.route === '/issues' &&
        result.userId === 'u-1' &&
        result.level === 'error'
      )
        ? []
        : ['`buildErrorEvent` 还没有正确标准化错误事件。']
    },
  }),
  moduleExercise({
    slug: 'obs-02-measure-request-duration',
    track: '观测',
    title: '观测 2/4：请求耗时指标',
    file: 'exercises/37-observability/02-measureRequestDuration.ts',
    concept: '请求耗时和成功率，是前端最基础也最有价值的两类网络指标。',
    instructions: [
      '返回 `durationMs`。',
      '200-299 视为 `ok: true`。',
    ],
    async validate(_, exercise) {
      const { measureRequestDuration } = await importExerciseModule(exercise.file)
      const ok = measureRequestDuration(100, 268, 204)
      const fail = measureRequestDuration(0, 50, 500)
      return ok.durationMs === 168 && ok.ok === true && fail.ok === false
        ? []
        : ['`measureRequestDuration` 还没有正确计算耗时或 ok 状态。']
    },
  }),
  moduleExercise({
    slug: 'obs-03-should-sample-trace',
    track: '观测',
    title: '观测 3/4：采样追踪',
    file: 'exercises/37-observability/03-shouldSampleTrace.ts',
    concept: '追踪不是全量开，采样是否稳定和可复现非常关键。',
    instructions: [
      'sampleRate=0 时返回 false。',
      'sampleRate=1 时返回 true。',
      '同一个 traceId 的判断结果要稳定。',
    ],
    async validate(_, exercise) {
      const { shouldSampleTrace } = await importExerciseModule(exercise.file)
      const a = shouldSampleTrace('trace-1', 0.2)
      const b = shouldSampleTrace('trace-1', 0.2)
      return (
        shouldSampleTrace('trace-1', 0) === false &&
        shouldSampleTrace('trace-1', 1) === true &&
        a === b
      )
        ? []
        : ['`shouldSampleTrace` 还没有满足 0/1 边界和稳定采样要求。']
    },
  }),
  moduleExercise({
    slug: 'obs-04-build-web-vital-payload',
    track: '观测',
    title: '观测 4/4：构造 Web Vitals 载荷',
    file: 'exercises/37-observability/04-buildWebVitalPayload.ts',
    concept: '性能指标不只是看本地控制台，还要能稳定上报到后端和监控平台。',
    instructions: [
      '返回 `{ metric, value, rating, route }`。',
    ],
    async validate(_, exercise) {
      const { buildWebVitalPayload } = await importExerciseModule(exercise.file)
      const result = buildWebVitalPayload(
        { name: 'LCP', value: 2480, rating: 'needs-improvement' },
        '/dashboard',
      )
      return (
        result.metric === 'LCP' &&
        result.value === 2480 &&
        result.rating === 'needs-improvement' &&
        result.route === '/dashboard'
      )
        ? []
        : ['`buildWebVitalPayload` 还没有正确构造上报载荷。']
    },
  }),
  moduleExercise({
    slug: 'bugfix-01-guard-latest-request',
    track: '修复与重构',
    title: '修复与重构 1/5：避免旧请求覆盖新请求',
    file: 'exercises/38-bugfix-refactor/01-guardLatestRequest.ts',
    concept: '竞态条件是高级前端的高频 bug，这题专门练“只接纳最新请求结果”。',
    instructions: [
      '只有 requestId 匹配 `latestRequestId` 时才更新 data。',
      '否则返回原 state。',
    ],
    async validate(_, exercise) {
      const { guardLatestRequest } = await importExerciseModule(exercise.file)
      const state = { latestRequestId: 'req-2', data: { id: 1 } }
      const ignored = guardLatestRequest(state, 'req-1', { id: 9 })
      const accepted = guardLatestRequest(state, 'req-2', { id: 2 })
      const failures = []

      if (ignored !== state) {
        failures.push('旧请求结果应该直接返回原 state。')
      }
      if (accepted === state || accepted.data?.id !== 2) {
        failures.push('最新请求结果还没有被正确接纳。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'bugfix-02-clean-filters',
    track: '修复与重构',
    title: '修复与重构 2/5：清理无效筛选条件',
    file: 'exercises/38-bugfix-refactor/02-cleanFilters.ts',
    concept: '请求参数里混进空值，是后台列表和搜索页里非常常见的一类脏 bug。',
    instructions: [
      '移除 null、undefined 和空字符串。',
      '返回新对象。',
    ],
    async validate(_, exercise) {
      const { cleanFilters } = await importExerciseModule(exercise.file)
      const source = { q: 'bug', owner: '', tag: undefined, status: null, sort: 'desc' }
      const result = cleanFilters(source)
      const failures = []

      if (result === source) {
        failures.push('`cleanFilters` 需要返回新对象。')
      }
      if (JSON.stringify(result) !== JSON.stringify({ q: 'bug', sort: 'desc' })) {
        failures.push('无效筛选条件还没有被正确移除。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'bugfix-03-dashboard-view-model',
    track: '修复与重构',
    title: '修复与重构 3/5：抽离页面 ViewModel',
    file: 'exercises/38-bugfix-refactor/03-buildDashboardViewModel.ts',
    concept: '高级前端经常要把页面里的“混杂计算”抽成可复用、可测的 view model 层。',
    instructions: [
      '返回 `{ issueSummary, memberOptions }`。',
      'issueSummary 形如 `resolved/total`。',
      'memberOptions 形如 `{ label, value }`。',
    ],
    async validate(_, exercise) {
      const { buildDashboardViewModel } = await importExerciseModule(exercise.file)
      const result = buildDashboardViewModel({
        summary: { totalIssues: 12, resolvedIssues: 8 },
        members: [
          { id: 1, name: 'Ada' },
          { id: 2, name: 'Linus' },
        ],
      })
      const failures = []

      if (result.issueSummary !== '8/12') {
        failures.push('`issueSummary` 还没有正确格式化。')
      }
      if (JSON.stringify(result.memberOptions) !== JSON.stringify([
        { label: 'Ada', value: 1 },
        { label: 'Linus', value: 2 },
      ])) {
        failures.push('`memberOptions` 还没有正确映射。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'bugfix-04-stabilize-modal-state',
    track: '修复与重构',
    title: '修复与重构 4/5：稳定弹窗状态',
    file: 'exercises/38-bugfix-refactor/04-stabilizeModalState.ts',
    concept: '弹窗 open 和 activeId 不一致，是后台和工具页里非常典型的状态 bug。',
    instructions: [
      'open action 要同时打开并写入 activeId。',
      'close action 要同时关闭并清空 activeId。',
    ],
    async validate(_, exercise) {
      const { stabilizeModalState } = await importExerciseModule(exercise.file)
      const opened = stabilizeModalState({ open: false, activeId: null }, { type: 'open', id: 'task-1' })
      const closed = stabilizeModalState({ open: true, activeId: 'task-1' }, { type: 'close' })
      return (
        opened.open === true &&
        opened.activeId === 'task-1' &&
        closed.open === false &&
        closed.activeId === null
      )
        ? []
        : ['`stabilizeModalState` 还没有正确维护 open 和 activeId。']
    },
  }),
  moduleExercise({
    slug: 'bugfix-05-toggle-selection',
    track: '修复与重构',
    title: '修复与重构 5/5：重构多选状态切换',
    file: 'exercises/38-bugfix-refactor/05-toggleSelection.ts',
    concept: '多选状态切换看似简单，但非常考验不可变更新和顺序稳定性。',
    instructions: [
      '已存在则移除。',
      '不存在则追加。',
      '返回新数组并保留稳定顺序。',
    ],
    async validate(_, exercise) {
      const { toggleSelection } = await importExerciseModule(exercise.file)
      const source = [1, 3]
      const added = toggleSelection(source, 2)
      const removed = toggleSelection(source, 3)
      const failures = []

      if (added === source || removed === source) {
        failures.push('`toggleSelection` 需要返回新数组。')
      }
      if (JSON.stringify(added) !== JSON.stringify([1, 3, 2])) {
        failures.push('追加选择时顺序还不对。')
      }
      if (JSON.stringify(removed) !== JSON.stringify([1])) {
        failures.push('取消选择时结果还不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'vue-query-01-list-query',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 1/7：基础列表查询',
    file: 'exercises/39-vue-query/01-buildIssueListQuery.ts',
    concept: '先把最基础的列表查询建起来，掌握 queryKey、queryFn 和 queryOptions 的最小形状。',
    instructions: [
      '返回 `queryOptions(...)`。',
      'queryKey 为 `["issues", filters]`。',
      'queryFn 返回 `{ items: [], total: 0 }`。',
    ],
    async validate(_, exercise) {
      const { buildIssueListQuery } = await importExerciseModule(exercise.file)
      const query = buildIssueListQuery({ status: 'open', page: 2 })
      const data = await query.queryFn()
      const failures = []

      if (JSON.stringify(query.queryKey) !== JSON.stringify(['issues', { status: 'open', page: 2 }])) {
        failures.push('queryKey 还没有正确包含 `issues` 和 filters。')
      }
      if (JSON.stringify(data) !== JSON.stringify({ items: [], total: 0 })) {
        failures.push('queryFn 还没有返回 `{ items: [], total: 0 }`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'vue-query-02-detail-query',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 2/7：详情查询 + enabled + select',
    file: 'exercises/39-vue-query/02-buildIssueDetailQuery.ts',
    concept: '很多详情页都要同时处理空 id、真实查询和 select 映射，这题就是最典型的实际 case。',
    instructions: [
      'queryKey 为 `["issue", issueId]`。',
      'enabled 为 `Boolean(issueId)`。',
      'select 映射成 `{ id, title, commentCount }`。',
    ],
    async validate(_, exercise) {
      const { buildIssueDetailQuery } = await importExerciseModule(exercise.file)
      const fetchIssue = async (issueId) => ({ id: issueId, title: 'Fix auth', comments: 3 })
      const query = buildIssueDetailQuery(9, fetchIssue)
      const disabledQuery = buildIssueDetailQuery(null, fetchIssue)
      const mapped = query.select({ id: 9, title: 'Fix auth', comments: 3 })
      const data = await query.queryFn()
      const failures = []

      if (JSON.stringify(query.queryKey) !== JSON.stringify(['issue', 9])) {
        failures.push('详情 queryKey 还没有正确写成 `["issue", issueId]`。')
      }
      if (query.enabled !== true || disabledQuery.enabled !== false) {
        failures.push('enabled 还没有正确跟随 issueId。')
      }
      if (mapped.commentCount !== 3 || mapped.title !== 'Fix auth') {
        failures.push('select 还没有正确映射详情数据。')
      }
      if (data.id !== 9) {
        failures.push('queryFn 还没有正确调用 fetchIssue。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'vue-query-03-search-query',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 3/7：搜索查询 + placeholderData',
    file: 'exercises/39-vue-query/03-buildSearchQuery.ts',
    concept: '搜索页很常见的组合是：trim keyword、空值不查、保留上一页数据避免闪烁。',
    instructions: [
      '先 trim keyword。',
      '只有长度 >= 2 才 enabled。',
      'placeholderData 使用 `keepPreviousData`。',
    ],
    async validate(_, exercise) {
      const { keepPreviousData } = await import('@tanstack/vue-query')
      const { buildSearchQuery } = await importExerciseModule(exercise.file)
      const query = buildSearchQuery('  bug  ', async (keyword) => [{ id: 1, title: keyword }])
      const disabledQuery = buildSearchQuery(' a ', async () => [])
      const result = await query.queryFn()
      const failures = []

      if (JSON.stringify(query.queryKey) !== JSON.stringify(['issue-search', 'bug'])) {
        failures.push('搜索 queryKey 还没有使用 trim 后的 keyword。')
      }
      if (query.enabled !== true || disabledQuery.enabled !== false) {
        failures.push('enabled 还没有正确按最小搜索长度控制。')
      }
      if (query.placeholderData !== keepPreviousData) {
        failures.push('placeholderData 还没有使用 `keepPreviousData`。')
      }
      if (result[0]?.title !== 'bug') {
        failures.push('queryFn 还没有用 trim 后的 keyword 调用搜索函数。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'vue-query-04-invalidate-list',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 4/7：失效列表缓存',
    file: 'exercises/39-vue-query/04-buildInvalidateIssueLists.ts',
    concept: '突变成功后失效列表缓存，是 TanStack Query 最常见的一步操作。',
    instructions: [
      '返回适合 `invalidateQueries` 的对象。',
      'queryKey 为 `["issues"]`。',
    ],
    async validate(_, exercise) {
      const { buildInvalidateIssueLists } = await importExerciseModule(exercise.file)
      const result = buildInvalidateIssueLists()
      return JSON.stringify(result) === JSON.stringify({ queryKey: ['issues'] })
        ? []
        : ['`buildInvalidateIssueLists` 还没有返回 `{ queryKey: ["issues"] }`。']
    },
  }),
  moduleExercise({
    slug: 'vue-query-05-optimistic-update',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 5/7：乐观更新列表缓存',
    file: 'exercises/39-vue-query/05-applyIssueOptimisticUpdate.ts',
    concept: '这题专门对应真实突变场景：在列表缓存里先打补丁，再等服务端确认。',
    instructions: [
      '返回新数组。',
      '只更新匹配 issue 的 status。',
    ],
    async validate(_, exercise) {
      const { applyIssueOptimisticUpdate } = await importExerciseModule(exercise.file)
      const source = [
        { id: 1, title: 'A', status: 'open' },
        { id: 2, title: 'B', status: 'open' },
      ]
      const result = applyIssueOptimisticUpdate(source, { id: 2, status: 'closed' })
      const failures = []

      if (result === source) {
        failures.push('乐观更新题需要返回新数组。')
      }
      if (result[1]?.status !== 'closed' || result[0]?.status !== 'open') {
        failures.push('还没有只更新匹配 issue 的 status。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'vue-query-06-toggle-mutation',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 6/7：基础 mutation options',
    file: 'exercises/39-vue-query/06-buildToggleIssueMutation.ts',
    concept: '很多实际业务都会把 mutation options 抽成小工厂函数，方便复用和测试。',
    instructions: [
      'mutationKey 为 `["toggle-issue", issueId]`。',
      'mutationFn 接收 nextStatus 并返回 `{ id, status }`。',
    ],
    async validate(_, exercise) {
      const { buildToggleIssueMutation } = await importExerciseModule(exercise.file)
      const options = buildToggleIssueMutation(7)
      const result = await options.mutationFn('closed')
      const failures = []

      if (JSON.stringify(options.mutationKey) !== JSON.stringify(['toggle-issue', 7])) {
        failures.push('mutationKey 还没有正确包含 issueId。')
      }
      if (result.id !== 7 || result.status !== 'closed') {
        failures.push('mutationFn 还没有正确返回 `{ id, status }`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'vue-query-07-infinite-query',
    track: 'Vue Query / TanStack Query',
    title: 'Vue Query / TanStack Query 7/7：无限查询',
    file: 'exercises/39-vue-query/07-buildIssuesInfiniteQuery.ts',
    concept: '分页流和无限滚动是 TanStack Query 的另一类高频场景，这题练最关键的 pageParam 结构。',
    instructions: [
      '返回 `infiniteQueryOptions(...)`。',
      'queryKey 为 `["issues", "infinite"]`。',
      'initialPageParam 为 1。',
      'getNextPageParam 返回 `lastPage.nextPage`。',
    ],
    async validate(_, exercise) {
      const { buildIssuesInfiniteQuery } = await importExerciseModule(exercise.file)
      const query = buildIssuesInfiniteQuery(async (page) => ({ items: [{ id: page }], nextPage: page + 1 }))
      const page = await query.queryFn({ pageParam: 3 })
      const failures = []

      if (JSON.stringify(query.queryKey) !== JSON.stringify(['issues', 'infinite'])) {
        failures.push('无限查询的 queryKey 还不对。')
      }
      if (query.initialPageParam !== 1) {
        failures.push('`initialPageParam` 应该是 1。')
      }
      if (query.getNextPageParam({ items: [], nextPage: 5 }) !== 5) {
        failures.push('`getNextPageParam` 还没有返回 `lastPage.nextPage`。')
      }
      if (page.items[0]?.id !== 3) {
        failures.push('queryFn 还没有正确使用 `pageParam`。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'design-01-color-tokens',
    track: '设计系统',
    title: '设计系统 1/6：定义颜色 tokens',
    file: 'exercises/40-design-system/01-createColorTokens.ts',
    concept: '设计系统第一步不是组件，而是先把 token 稳定下来。',
    instructions: [
      '返回 `bg`、`fg`、`primary`、`danger` 四个 token。',
      '值使用 CSS 变量引用。',
    ],
    async validate(_, exercise) {
      const { createColorTokens } = await importExerciseModule(exercise.file)
      const result = createColorTokens()
      const failures = []

      if (JSON.stringify(Object.keys(result)) !== JSON.stringify(['bg', 'fg', 'primary', 'danger'])) {
        failures.push('颜色 tokens 还没有补齐 `bg/fg/primary/danger`。')
      }
      if (result.bg !== 'var(--color-bg)' || result.primary !== 'var(--color-primary)') {
        failures.push('token 值还没有使用 CSS 变量引用。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'design-02-theme-vars',
    track: '设计系统',
    title: '设计系统 2/6：主题变量映射',
    file: 'exercises/40-design-system/02-buildThemeVars.ts',
    concept: '主题切换本质上就是 token 到 CSS variables 的一层映射。',
    instructions: [
      '支持 `light` 和 `dark`。',
      '至少返回 `--color-bg` 和 `--color-fg`。',
    ],
    async validate(_, exercise) {
      const { buildThemeVars } = await importExerciseModule(exercise.file)
      const light = buildThemeVars('light')
      const dark = buildThemeVars('dark')
      const failures = []

      if (!light['--color-bg'] || !light['--color-fg']) {
        failures.push('light 主题还没有返回基础颜色变量。')
      }
      if (!dark['--color-bg'] || !dark['--color-fg']) {
        failures.push('dark 主题还没有返回基础颜色变量。')
      }
      if (light['--color-bg'] === dark['--color-bg']) {
        failures.push('light 和 dark 的背景变量至少应该有区别。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'design-03-button-variants',
    track: '设计系统',
    title: '设计系统 3/6：按钮变体类名',
    file: 'exercises/40-design-system/03-buildButtonVariantClasses.ts',
    concept: '组件变体不是“写死几个 class”，而是把基础类、variant、size 组合稳定化。',
    instructions: [
      '始终包含基础类。',
      '按 variant 切换样式。',
      '按 size 切换尺寸类。',
    ],
    async validate(_, exercise) {
      const { buildButtonVariantClasses } = await importExerciseModule(exercise.file)
      const result = buildButtonVariantClasses('primary', 'lg')
      const failures = []

      if (!result.includes('inline-flex') || !result.includes('rounded-md')) {
        failures.push('按钮类名还没有包含基础结构类。')
      }
      if (!result.includes('bg-primary') || !result.includes('h-11')) {
        failures.push('variant 或 size 的类名还没有正确组合。')
      }

      return failures
    },
  }),
  regexExercise({
    slug: 'design-04-base-text-primitive',
    track: '设计系统',
    title: '设计系统 4/6：无样式文本基础组件',
    file: 'exercises/40-design-system/04-BaseTextPrimitive.vue',
    concept: '无样式基础组件是设计系统里很关键的一层，它负责语义和接口，不强绑视觉。',
    instructions: [
      '定义 `as` prop：`p | span | label`。',
      '定义 `tone` prop：`default | muted`。',
      '使用 `<component :is=\"...\">` 渲染。',
    ],
    checks: [
      [/as:\s*['"]p['"]\s*\|\s*['"]span['"]\s*\|\s*['"]label['"]|type:\s*PropType<\s*'p'\s*\|\s*'span'\s*\|\s*'label'\s*>/, '还没有定义 `as` prop。'],
      [/tone:\s*['"]default['"]\s*\|\s*['"]muted['"]|type:\s*PropType<\s*'default'\s*\|\s*'muted'\s*>/, '还没有定义 `tone` prop。'],
      [/<component[\s\S]*:is=/s, '还没有使用 `<component :is=\"...\">`。'],
    ],
  }),
  moduleExercise({
    slug: 'design-05-surface-classes',
    track: '设计系统',
    title: '设计系统 5/6：Surface 语义层',
    file: 'exercises/40-design-system/05-buildSurfaceClasses.ts',
    concept: '设计系统常会抽出 surface/card/panel 这种语义层，而不是每次都从零拼样式。',
    instructions: [
      '始终包含基础 surface 类。',
      'raised 增加阴影。',
      'interactive 增加 hover 和 transition。',
    ],
    async validate(_, exercise) {
      const { buildSurfaceClasses } = await importExerciseModule(exercise.file)
      const result = buildSurfaceClasses('raised', true)
      const failures = []

      if (!result.includes('rounded-xl') || !result.includes('border')) {
        failures.push('surface 还没有包含基础结构类。')
      }
      if (!result.includes('shadow')) {
        failures.push('raised surface 还没有增加阴影。')
      }
      if (!result.includes('hover:') || !result.includes('transition')) {
        failures.push('interactive surface 还没有增加交互态类。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'design-06-component-states',
    track: '设计系统',
    title: '设计系统 6/6：统一组件状态输出',
    file: 'exercises/40-design-system/06-buildComponentStates.ts',
    concept: '设计系统里 disabled/loading/invalid 最怕各写各的，统一状态输出能大幅减少分裂。',
    instructions: [
      '返回 `{ ariaDisabled, dataState, dataInvalid }`。',
      'loading 优先级高于默认态。',
    ],
    async validate(_, exercise) {
      const { buildComponentStates } = await importExerciseModule(exercise.file)
      const loading = buildComponentStates({ disabled: false, loading: true, invalid: true })
      const idle = buildComponentStates({ disabled: true, loading: false, invalid: false })
      return (
        loading.dataState === 'loading' &&
        loading.dataInvalid === 'true' &&
        idle.ariaDisabled === 'true'
      )
        ? []
        : ['`buildComponentStates` 还没有正确统一组件状态输出。']
    },
  }),
  moduleExercise({
    slug: 'complex-01-reorder-drag',
    track: '复杂交互',
    title: '复杂交互 1/6：拖拽重排',
    file: 'exercises/41-complex-interactions/01-reorderByDrag.ts',
    concept: '拖拽的难点不在手势，而在稳定地重排数据且不污染原数组。',
    instructions: [
      '返回新数组。',
      '把 fromIndex 元素移动到 toIndex。',
    ],
    async validate(_, exercise) {
      const { reorderByDrag } = await importExerciseModule(exercise.file)
      const source = ['A', 'B', 'C', 'D']
      const result = reorderByDrag(source, 1, 3)
      const failures = []

      if (result === source) {
        failures.push('拖拽重排题需要返回新数组。')
      }
      if (JSON.stringify(result) !== JSON.stringify(['A', 'C', 'D', 'B'])) {
        failures.push('拖拽重排结果还不对。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'complex-02-virtual-window',
    track: '复杂交互',
    title: '复杂交互 2/6：虚拟列表窗口计算',
    file: 'exercises/41-complex-interactions/02-buildVirtualWindow.ts',
    concept: '虚拟列表核心不是 UI，而是先把可见窗口和 overscan 算准。',
    instructions: [
      '返回 `{ start, end }`。',
      '正确处理 overscan 和边界裁剪。',
    ],
    async validate(_, exercise) {
      const { buildVirtualWindow } = await importExerciseModule(exercise.file)
      const result = buildVirtualWindow({
        itemHeight: 40,
        viewportHeight: 120,
        scrollTop: 80,
        total: 20,
        overscan: 1,
      })
      return result.start === 1 && result.end === 6
        ? []
        : ['`buildVirtualWindow` 还没有正确计算虚拟窗口。']
    },
  }),
  moduleExercise({
    slug: 'complex-03-chart-series',
    track: '复杂交互',
    title: '复杂交互 3/6：图表序列映射',
    file: 'exercises/41-complex-interactions/03-buildChartSeries.ts',
    concept: '图表常见工作不是写图表库，而是把业务数据稳定映射成 series 结构。',
    instructions: [
      '返回 open 和 closed 两条 series。',
      'data 里的每项形如 `{ x, y }`。',
    ],
    async validate(_, exercise) {
      const { buildChartSeries } = await importExerciseModule(exercise.file)
      const result = buildChartSeries([{ date: '2026-04-19', open: 3, closed: 5 }])
      const failures = []

      if (result.length !== 2 || result[0]?.name !== 'open' || result[1]?.name !== 'closed') {
        failures.push('图表序列还没有正确拆成 open/closed 两条。')
      }
      if (result[0]?.data?.[0]?.x !== '2026-04-19' || result[1]?.data?.[0]?.y !== 5) {
        failures.push('图表 data 点还没有正确映射。')
      }

      return failures
    },
  }),
  moduleExercise({
    slug: 'complex-04-command-palette',
    track: '复杂交互',
    title: '复杂交互 4/6：命令面板过滤',
    file: 'exercises/41-complex-interactions/04-filterCommandPalette.ts',
    concept: '命令面板是工具型应用的高频交互，过滤逻辑通常比 UI 更值得先练。',
    instructions: [
      'trim 并小写 query。',
      '匹配 title 和 keywords。',
      '保留原始顺序。',
    ],
    async validate(_, exercise) {
      const { filterCommandPalette } = await importExerciseModule(exercise.file)
      const items = [
        { id: 'a', title: 'Open Settings', keywords: ['preferences'] },
        { id: 'b', title: 'Create Issue', keywords: ['bug', 'ticket'] },
      ]
      const result = filterCommandPalette(items, '  BUG ')
      return JSON.stringify(result.map((item) => item.id)) === JSON.stringify(['b'])
        ? []
        : ['`filterCommandPalette` 还没有正确按标题和关键字过滤。']
    },
  }),
  moduleExercise({
    slug: 'complex-05-shortcut-label',
    track: '复杂交互',
    title: '复杂交互 5/6：快捷键标签',
    file: 'exercises/41-complex-interactions/05-buildShortcutLabel.ts',
    concept: '快捷键系统的第一步通常就是把平台差异渲染成统一可读标签。',
    instructions: [
      'mac: meta -> Cmd, alt -> Opt。',
      'windows: meta -> Win, alt -> Alt。',
      '用 `+` 连接。',
    ],
    async validate(_, exercise) {
      const { buildShortcutLabel } = await importExerciseModule(exercise.file)
      const mac = buildShortcutLabel(['meta', 'shift', 'k'], 'mac')
      const win = buildShortcutLabel(['meta', 'alt', 'p'], 'windows')
      return mac === 'Cmd+shift+k' && win === 'Win+Alt+p'
        ? []
        : ['`buildShortcutLabel` 还没有正确处理平台差异。']
    },
  }),
  moduleExercise({
    slug: 'complex-06-move-active-index',
    track: '复杂交互',
    title: '复杂交互 6/6：键盘导航游标',
    file: 'exercises/41-complex-interactions/06-moveActiveIndex.ts',
    concept: '列表、菜单、命令面板这类交互里，active index 的循环移动是很核心的基础能力。',
    instructions: [
      '支持 up/down。',
      '支持首尾循环。',
      'total <= 0 时返回 -1。',
    ],
    async validate(_, exercise) {
      const { moveActiveIndex } = await importExerciseModule(exercise.file)
      return (
        moveActiveIndex(0, 'up', 4) === 3 &&
        moveActiveIndex(3, 'down', 4) === 0 &&
        moveActiveIndex(1, 'down', 0) === -1
      )
        ? []
        : ['`moveActiveIndex` 还没有正确处理循环移动和空列表。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-01-foundation',
    track: '阶段 1 Checkpoint',
    title: '阶段 1 Checkpoint：语言与运行时基础整合',
    file: 'exercises/42-checkpoints/01-phase1-foundationCheckpoint.ts',
    concept: '把 JavaScript、TypeScript、Node.js 的基础能力收束成一个最小客户端上下文。',
    instructions: ['返回 `{ baseUrl, port, queryString, authHeader }`。', 'queryString 要包含 status 和 page。'],
    async validate(_, exercise) {
      const { buildFoundationCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildFoundationCheckpoint({
        apiBaseUrl: 'https://api.example.com',
        port: 4173,
        token: 'abc',
        filters: { status: 'open', page: 2 },
      })
      return (
        result.baseUrl === 'https://api.example.com' &&
        result.port === 4173 &&
        result.queryString === 'status=open&page=2' &&
        result.authHeader === 'Bearer abc'
      )
        ? []
        : ['阶段 1 checkpoint 还没有把 baseUrl、port、queryString、authHeader 串起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-02-style',
    track: '阶段 2 Checkpoint',
    title: '阶段 2 Checkpoint：样式体系整合',
    file: 'exercises/42-checkpoints/02-phase2-styleCheckpoint.ts',
    concept: '把 token、类名和动效三层合起来，才算真正建立样式体系直觉。',
    instructions: ['返回 `{ tokens, classes, motion }`。', 'active=true 时 classes 要有 active 表达。'],
    async validate(_, exercise) {
      const { buildStyleCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildStyleCheckpoint('dark', true)
      return (
        result.tokens.bg !== undefined &&
        result.classes.includes('active') &&
        result.motion.length > 0
      )
        ? []
        : ['阶段 2 checkpoint 需要同时输出 tokens、classes 和 motion。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-03-vue-core',
    track: '阶段 3 Checkpoint',
    title: '阶段 3 Checkpoint：Vue 核心概念整合',
    file: 'exercises/42-checkpoints/03-phase3-vueCoreCheckpoint.ts',
    concept: 'Vue 核心不只是单点 API，而是状态、事件和视图状态的组合。',
    instructions: ['返回 `{ filters, canRetry, viewState, events }`。', 'error 存在时 viewState 应为 error。'],
    async validate(_, exercise) {
      const { buildVueCoreCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildVueCoreCheckpoint({
        query: 'bug',
        selectedTag: 'backend',
        loading: false,
        error: 'timeout',
      })
      return (
        result.filters.query === 'bug' &&
        result.filters.selectedTag === 'backend' &&
        result.canRetry === true &&
        result.viewState === 'error' &&
        Array.isArray(result.events) &&
        result.events.length >= 2
      )
        ? []
        : ['阶段 3 checkpoint 还没有把 filters、视图状态和事件模型整合起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-04-ui-ecosystem',
    track: '阶段 4 Checkpoint',
    title: '阶段 4 Checkpoint：组件生态整合',
    file: 'exercises/42-checkpoints/04-phase4-uiEcosystemCheckpoint.ts',
    concept: '组件生态阶段最重要的是知道什么交给 headless primitive，什么交给组件组合。',
    instructions: ['返回 dialog、tabs、select、button 四项。'],
    async validate(_, exercise) {
      const { buildUiEcosystemCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildUiEcosystemCheckpoint()
      return (
        result.dialog.length > 0 &&
        result.tabs.length > 0 &&
        result.select.length > 0 &&
        result.button.length > 0
      )
        ? []
        : ['阶段 4 checkpoint 还没有说明 dialog/tabs/select/button 的生态组合。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-05-nuxt',
    track: '阶段 5 Checkpoint',
    title: '阶段 5 Checkpoint：Nuxt 页面链路整合',
    file: 'exercises/42-checkpoints/05-phase5-nuxtCheckpoint.ts',
    concept: 'Nuxt 阶段最关键的是服务端接口、composable 和页面三层打通。',
    instructions: ['返回 route、asyncDataKey、serverHandler、filtersComposable。'],
    async validate(_, exercise) {
      const { buildNuxtCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildNuxtCheckpoint()
      return (
        result.route === '/todos' &&
        result.asyncDataKey.length > 0 &&
        result.serverHandler.length > 0 &&
        result.filtersComposable.length > 0
      )
        ? []
        : ['阶段 5 checkpoint 还没有把 Nuxt 页面三层链路串起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-06-platform',
    track: '阶段 6 Checkpoint',
    title: '阶段 6 Checkpoint：平台能力整合',
    file: 'exercises/42-checkpoints/06-phase6-platformCheckpoint.ts',
    concept: '平台能力阶段的关键，是离线、刷新和计算策略的整体判断。',
    instructions: ['返回 offlineReady、computeStrategy、refreshPrompt。'],
    async validate(_, exercise) {
      const { buildPlatformCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildPlatformCheckpoint({ hasServiceWorker: true, hasWasm: true })
      return (
        result.offlineReady === true &&
        result.computeStrategy.length > 0 &&
        result.refreshPrompt === true
      )
        ? []
        : ['阶段 6 checkpoint 还没有正确归纳平台能力判断。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-07-network',
    track: '阶段 7 Checkpoint',
    title: '阶段 7 Checkpoint：浏览器与网络整合',
    file: 'exercises/42-checkpoints/07-phase7-networkCheckpoint.ts',
    concept: '网络阶段真正重要的是把 method、headers、cache 三件事连起来看。',
    instructions: ['返回 willPreflight、cachePolicy、requestMode。'],
    async validate(_, exercise) {
      const { buildNetworkCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildNetworkCheckpoint({
        method: 'POST',
        hasCustomHeader: true,
        cacheControl: 'max-age=60',
      })
      return (
        result.willPreflight === true &&
        result.cachePolicy.length > 0 &&
        result.requestMode.length > 0
      )
        ? []
        : ['阶段 7 checkpoint 还没有把预检、缓存和请求模式连起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-08-testing',
    track: '阶段 8 Checkpoint',
    title: '阶段 8 Checkpoint：测试金字塔整合',
    file: 'exercises/42-checkpoints/08-phase8-testingCheckpoint.ts',
    concept: '测试阶段要形成“单测、组件测、E2E 各管什么”的系统感。',
    instructions: ['返回 unit、component、e2e 三组测试项。'],
    async validate(_, exercise) {
      const { buildTestingCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildTestingCheckpoint()
      return (
        result.unit.length > 0 &&
        result.component.length > 0 &&
        result.e2e.length > 0
      )
        ? []
        : ['阶段 8 checkpoint 需要同时覆盖 unit、component、e2e。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-09-auth-perf',
    track: '阶段 9 Checkpoint',
    title: '阶段 9 Checkpoint：性能与认证整合',
    file: 'exercises/42-checkpoints/09-phase9-authPerfCheckpoint.ts',
    concept: '性能和认证常常同时出现在真实产品的请求与资源策略里。',
    instructions: ['返回 imageLoading、authHeader、access、preconnect。'],
    async validate(_, exercise) {
      const { buildAuthPerfCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildAuthPerfCheckpoint()
      return (
        result.imageLoading.length > 0 &&
        result.authHeader.startsWith('Bearer ') &&
        typeof result.access === 'boolean' &&
        typeof result.preconnect === 'boolean'
      )
        ? []
        : ['阶段 9 checkpoint 还没有把性能与认证策略整合起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-10-ssr-admin',
    track: '阶段 10 Checkpoint',
    title: '阶段 10 Checkpoint：SSR 与后台实战整合',
    file: 'exercises/42-checkpoints/10-phase10-ssrAdminCheckpoint.ts',
    concept: '这一阶段的关键是渲染策略、数据获取和后台列表模型一起考虑。',
    instructions: ['返回 renderStrategy、asyncData、filters、pagination。'],
    async validate(_, exercise) {
      const { buildSsrAdminCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildSsrAdminCheckpoint()
      return (
        ['ssr', 'csr', 'ssg'].includes(result.renderStrategy) &&
        typeof result.asyncData.server === 'boolean' &&
        result.filters.length > 0 &&
        result.pagination.length > 0
      )
        ? []
        : ['阶段 10 checkpoint 还没有把 SSR 和后台页模型串起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-11-dom-a11y',
    track: '阶段 11 Checkpoint',
    title: '阶段 11 Checkpoint：DOM / A11y / 存储 / 上传整合',
    file: 'exercises/42-checkpoints/11-phase11-domA11yCheckpoint.ts',
    concept: '这一阶段练的是输入、反馈、可访问性和本地状态的整体体验。',
    instructions: ['返回 shortcut、aria、storageKey、uploadState。'],
    async validate(_, exercise) {
      const { buildDomA11yCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildDomA11yCheckpoint()
      return (
        result.shortcut.length > 0 &&
        Object.keys(result.aria).length > 0 &&
        result.storageKey.includes(':') &&
        result.uploadState.length > 0
      )
        ? []
        : ['阶段 11 checkpoint 还没有把交互、语义、存储和上传状态整合起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-12-realtime',
    track: '阶段 12 Checkpoint',
    title: '阶段 12 Checkpoint：实时通信与协同整合',
    file: 'exercises/42-checkpoints/12-phase12-realtimeCheckpoint.ts',
    concept: '实时阶段的系统感，来自 SSE、WebSocket、房间和重连策略的统一建模。',
    instructions: ['返回 sseUrl、socketEnvelope、reconnect、room。'],
    async validate(_, exercise) {
      const { buildRealtimeCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildRealtimeCheckpoint()
      return (
        result.sseUrl.length > 0 &&
        typeof result.socketEnvelope === 'object' &&
        typeof result.reconnect === 'boolean' &&
        result.room.length > 0
      )
        ? []
        : ['阶段 12 checkpoint 还没有把实时连接和协同房间整合起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-13-data-security',
    track: '阶段 13 Checkpoint',
    title: '阶段 13 Checkpoint：数据层与安全整合',
    file: 'exercises/42-checkpoints/13-phase13-dataSecurityCheckpoint.ts',
    concept: '高级前端开始要同时思考缓存结构和安全边界，而不是分开看。',
    instructions: ['返回 queryKey、optimistic、csrfHeader、redirect。'],
    async validate(_, exercise) {
      const { buildDataSecurityCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildDataSecurityCheckpoint()
      return (
        Array.isArray(result.queryKey) &&
        typeof result.optimistic === 'boolean' &&
        result.csrfHeader.length > 0 &&
        result.redirect.length > 0
      )
        ? []
        : ['阶段 13 checkpoint 还没有把数据层和安全边界整合起来。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-14-ops',
    track: '阶段 14 Checkpoint',
    title: '阶段 14 Checkpoint：观测与修复重构整合',
    file: 'exercises/42-checkpoints/14-phase14-opsCheckpoint.ts',
    concept: '观测和修复能力，决定你能不能接住真实线上系统。',
    instructions: ['返回 errorEvent、traceSampled、raceGuarded、selectionStable。'],
    async validate(_, exercise) {
      const { buildOpsCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildOpsCheckpoint()
      return (
        result.errorEvent === true &&
        typeof result.traceSampled === 'boolean' &&
        result.raceGuarded === true &&
        result.selectionStable === true
      )
        ? []
        : ['阶段 14 checkpoint 还没有体现观测与修复的核心能力。']
    },
  }),
  moduleExercise({
    slug: 'checkpoint-15-advanced-frontend',
    track: '阶段 15 Checkpoint',
    title: '阶段 15 Checkpoint：高级前端专题整合',
    file: 'exercises/42-checkpoints/15-phase15-advancedFrontendCheckpoint.ts',
    concept: '这一阶段是把 Vue Query、设计系统和复杂交互收束成一套产品能力。',
    instructions: ['返回 queryLayer、designSystem、interactions 三组清单。'],
    async validate(_, exercise) {
      const { buildAdvancedFrontendCheckpoint } = await importExerciseModule(exercise.file)
      const result = buildAdvancedFrontendCheckpoint()
      return (
        result.queryLayer.length > 0 &&
        result.designSystem.length > 0 &&
        result.interactions.length > 0
      )
        ? []
        : ['阶段 15 checkpoint 还没有把高级前端专题整合起来。']
    },
  }),
  moduleExercise({
    slug: 'integration-01-foundation-ui',
    track: '集成挑战（阶段 1-4）',
    title: '集成挑战 1/4：从语言基础到 UI 生态',
    file: 'exercises/43-integration-challenges/01-foundation-to-uiIntegration.ts',
    concept: '把基础语言、样式体系、Vue 核心和 UI 生态连成一个可落地模块。',
    instructions: ['返回 filters、routes、ui、state 四组内容。'],
    async validate(_, exercise) {
      const { buildFoundationToUiIntegration } = await importExerciseModule(exercise.file)
      const result = buildFoundationToUiIntegration()
      return (
        result.filters.length > 0 &&
        result.routes.length > 0 &&
        result.ui.length > 0 &&
        result.state.length > 0
      )
        ? []
        : ['第一组集成挑战还没有形成完整的基础到 UI 方案。']
    },
  }),
  moduleExercise({
    slug: 'integration-02-nuxt-quality',
    track: '集成挑战（阶段 5-8）',
    title: '集成挑战 2/4：从 Nuxt 到质量保障',
    file: 'exercises/43-integration-challenges/02-nuxt-to-qualityIntegration.ts',
    concept: '这一组集成的是 Nuxt 页面、平台能力、网络策略和测试质量。',
    instructions: ['返回 nuxt、platform、network、tests 四组内容。'],
    async validate(_, exercise) {
      const { buildNuxtToQualityIntegration } = await importExerciseModule(exercise.file)
      const result = buildNuxtToQualityIntegration()
      return (
        result.nuxt.length > 0 &&
        result.platform.length > 0 &&
        result.network.length > 0 &&
        result.tests.length > 0
      )
        ? []
        : ['第二组集成挑战还没有把 Nuxt 到质量保障串起来。']
    },
  }),
  moduleExercise({
    slug: 'integration-03-runtime-realtime',
    track: '集成挑战（阶段 9-12）',
    title: '集成挑战 3/4：从产品运行时到实时系统',
    file: 'exercises/43-integration-challenges/03-runtime-to-realtimeIntegration.ts',
    concept: '这里要把性能、认证、SSR、可访问性和实时能力一起考虑。',
    instructions: ['返回 auth、ssr、a11y、realtime 四组内容。'],
    async validate(_, exercise) {
      const { buildRuntimeToRealtimeIntegration } = await importExerciseModule(exercise.file)
      const result = buildRuntimeToRealtimeIntegration()
      return (
        result.auth.length > 0 &&
        result.ssr.length > 0 &&
        result.a11y.length > 0 &&
        result.realtime.length > 0
      )
        ? []
        : ['第三组集成挑战还没有把产品运行时和实时系统整合起来。']
    },
  }),
  moduleExercise({
    slug: 'integration-04-advanced-systems',
    track: '集成挑战（阶段 13-15）',
    title: '集成挑战 4/4：高级前端系统整合',
    file: 'exercises/43-integration-challenges/04-advancedSystemsIntegration.ts',
    concept: '这一组真正把高级前端的系统能力拉到一起：数据层、安全、观测、设计系统、复杂交互。',
    instructions: ['返回 dataLayer、security、observability、designSystem、interactions。'],
    async validate(_, exercise) {
      const { buildAdvancedSystemsIntegration } = await importExerciseModule(exercise.file)
      const result = buildAdvancedSystemsIntegration()
      return (
        result.dataLayer.length > 0 &&
        result.security.length > 0 &&
        result.observability.length > 0 &&
        result.designSystem.length > 0 &&
        result.interactions.length > 0
      )
        ? []
        : ['第四组集成挑战还没有形成高级前端系统方案。']
    },
  }),
  moduleExercise({
    slug: 'capstone-01-admin-dashboard',
    track: 'Capstone',
    title: 'Capstone 1/2：管理后台项目',
    file: 'exercises/44-capstones/01-admin-dashboard/projectManifest.ts',
    concept: '把题库里的列表、筛选、表单、权限、测试、观测能力真正收束成一个后台项目蓝图。',
    instructions: ['返回 routes、dataModules、uiModules、qualityGates。', '每组至少列出两个以上模块。'],
    async validate(_, exercise) {
      const { buildAdminDashboardCapstone } = await importExerciseModule(exercise.file)
      const result = buildAdminDashboardCapstone()
      return (
        result.routes.length >= 2 &&
        result.dataModules.length >= 2 &&
        result.uiModules.length >= 2 &&
        result.qualityGates.length >= 2
      )
        ? []
        : ['管理后台 capstone 还没有形成完整的 routes / data / ui / quality blueprint。']
    },
  }),
  moduleExercise({
    slug: 'capstone-02-collab-todo',
    track: 'Capstone',
    title: 'Capstone 2/2：Nuxt + Vue Query + Yjs 协作 Todo',
    file: 'exercises/44-capstones/02-collab-todo/projectManifest.ts',
    concept: '这是最终的 full stack 小产品，把 Nuxt、Vue Query、WebSocket、Yjs、设计系统和复杂交互拉到一个项目里。',
    instructions: ['返回 routes、queryLayer、collaboration、designSystem、releaseChecklist。', '每组至少列出两个以上模块。'],
    async validate(_, exercise) {
      const { buildCollabTodoCapstone } = await importExerciseModule(exercise.file)
      const result = buildCollabTodoCapstone()
      return (
        result.routes.length >= 2 &&
        result.queryLayer.length >= 2 &&
        result.collaboration.length >= 2 &&
        result.designSystem.length >= 2 &&
        result.releaseChecklist.length >= 2
      )
        ? []
        : ['协作 Todo capstone 还没有形成完整的项目蓝图。']
    },
  }),
]

const phaseOrder = [
  '阶段 1：JavaScript / TypeScript / Node.js 基础',
  '阶段 2：CSS / Sass / Tailwind 样式基础',
  '阶段 3：Vue 核心概念',
  '阶段 4：组件生态（Reka UI / shadcn）',
  '阶段 5：框架实战（Nuxt）',
  '阶段 6：平台能力（Service Worker / WASM）',
  '阶段 7：浏览器与网络',
  '阶段 8：测试与质量',
  '阶段 9：性能与认证',
  '阶段 10：Nuxt SSR 与后台实战',
  '阶段 11：DOM / A11y / 存储 / 上传',
  '阶段 12：实时通信与协同',
  '阶段 13：高级前端（数据层 / 安全）',
  '阶段 14：高级前端（观测 / 修复重构）',
  '阶段 15：高级前端（Vue Query / 设计系统 / 复杂交互）',
  '阶段 16：集成挑战（阶段 1-4）',
  '阶段 17：集成挑战（阶段 5-8）',
  '阶段 18：集成挑战（阶段 9-12）',
  '阶段 19：集成挑战（阶段 13-15）',
  '阶段 20：项目实战与 Capstone',
]

const trackOrder = [
  'JavaScript',
  'TypeScript',
  'Node.js',
  '阶段 1 Checkpoint',
  'CSS、动画',
  'Sass',
  'TailwindCSS',
  '阶段 2 Checkpoint',
  '组件拆分',
  '单向数据流',
  'Composables',
  '生命周期',
  '状态管理',
  '表单',
  '异步数据获取',
  '错误处理与加载态',
  '路由',
  '阶段 3 Checkpoint',
  'Reka UI',
  'shadcn/vue',
  '阶段 4 Checkpoint',
  'Nuxt Todo',
  '阶段 5 Checkpoint',
  'Service Worker',
  'WASM',
  '阶段 6 Checkpoint',
  '浏览器与网络',
  '阶段 7 Checkpoint',
  '测试',
  '阶段 8 Checkpoint',
  '性能',
  '认证',
  '阶段 9 Checkpoint',
  'Nuxt SSR',
  '阶段 10 Checkpoint',
  'DOM 与事件',
  '可访问性',
  '浏览器存储',
  '文件上传',
  '阶段 11 Checkpoint',
  'SSE / WebSocket',
  '阶段 12 Checkpoint',
  '数据层',
  'Vue Query / TanStack Query',
  '安全',
  '阶段 13 Checkpoint',
  '观测',
  '修复与重构',
  '阶段 14 Checkpoint',
  '设计系统',
  '复杂交互',
  '阶段 15 Checkpoint',
  '集成挑战（阶段 1-4）',
  '集成挑战（阶段 5-8）',
  '集成挑战（阶段 9-12）',
  '集成挑战（阶段 13-15）',
  '完整后台实战',
  '协同编辑（Yjs）',
  'Capstone',
]

const trackPhaseMap = {
  JavaScript: '阶段 1：JavaScript / TypeScript / Node.js 基础',
  TypeScript: '阶段 1：JavaScript / TypeScript / Node.js 基础',
  'Node.js': '阶段 1：JavaScript / TypeScript / Node.js 基础',
  '阶段 1 Checkpoint': '阶段 1：JavaScript / TypeScript / Node.js 基础',
  'CSS、动画': '阶段 2：CSS / Sass / Tailwind 样式基础',
  Sass: '阶段 2：CSS / Sass / Tailwind 样式基础',
  TailwindCSS: '阶段 2：CSS / Sass / Tailwind 样式基础',
  '阶段 2 Checkpoint': '阶段 2：CSS / Sass / Tailwind 样式基础',
  组件拆分: '阶段 3：Vue 核心概念',
  单向数据流: '阶段 3：Vue 核心概念',
  Composables: '阶段 3：Vue 核心概念',
  生命周期: '阶段 3：Vue 核心概念',
  状态管理: '阶段 3：Vue 核心概念',
  表单: '阶段 3：Vue 核心概念',
  异步数据获取: '阶段 3：Vue 核心概念',
  错误处理与加载态: '阶段 3：Vue 核心概念',
  路由: '阶段 3：Vue 核心概念',
  '阶段 3 Checkpoint': '阶段 3：Vue 核心概念',
  'Reka UI': '阶段 4：组件生态（Reka UI / shadcn）',
  'shadcn/vue': '阶段 4：组件生态（Reka UI / shadcn）',
  '阶段 4 Checkpoint': '阶段 4：组件生态（Reka UI / shadcn）',
  'Nuxt Todo': '阶段 5：框架实战（Nuxt）',
  '阶段 5 Checkpoint': '阶段 5：框架实战（Nuxt）',
  'Service Worker': '阶段 6：平台能力（Service Worker / WASM）',
  WASM: '阶段 6：平台能力（Service Worker / WASM）',
  '阶段 6 Checkpoint': '阶段 6：平台能力（Service Worker / WASM）',
  '浏览器与网络': '阶段 7：浏览器与网络',
  '阶段 7 Checkpoint': '阶段 7：浏览器与网络',
  测试: '阶段 8：测试与质量',
  '阶段 8 Checkpoint': '阶段 8：测试与质量',
  性能: '阶段 9：性能与认证',
  认证: '阶段 9：性能与认证',
  '阶段 9 Checkpoint': '阶段 9：性能与认证',
  'Nuxt SSR': '阶段 10：Nuxt SSR 与后台实战',
  '阶段 10 Checkpoint': '阶段 10：Nuxt SSR 与后台实战',
  'DOM 与事件': '阶段 11：DOM / A11y / 存储 / 上传',
  '可访问性': '阶段 11：DOM / A11y / 存储 / 上传',
  '浏览器存储': '阶段 11：DOM / A11y / 存储 / 上传',
  '文件上传': '阶段 11：DOM / A11y / 存储 / 上传',
  '阶段 11 Checkpoint': '阶段 11：DOM / A11y / 存储 / 上传',
  'SSE / WebSocket': '阶段 12：实时通信与协同',
  '阶段 12 Checkpoint': '阶段 12：实时通信与协同',
  '数据层': '阶段 13：高级前端（数据层 / 安全）',
  'Vue Query / TanStack Query': '阶段 15：高级前端（Vue Query / 设计系统 / 复杂交互）',
  '安全': '阶段 13：高级前端（数据层 / 安全）',
  '阶段 13 Checkpoint': '阶段 13：高级前端（数据层 / 安全）',
  '观测': '阶段 14：高级前端（观测 / 修复重构）',
  '修复与重构': '阶段 14：高级前端（观测 / 修复重构）',
  '阶段 14 Checkpoint': '阶段 14：高级前端（观测 / 修复重构）',
  '设计系统': '阶段 15：高级前端（Vue Query / 设计系统 / 复杂交互）',
  '复杂交互': '阶段 15：高级前端（Vue Query / 设计系统 / 复杂交互）',
  '阶段 15 Checkpoint': '阶段 15：高级前端（Vue Query / 设计系统 / 复杂交互）',
  '集成挑战（阶段 1-4）': '阶段 16：集成挑战（阶段 1-4）',
  '集成挑战（阶段 5-8）': '阶段 17：集成挑战（阶段 5-8）',
  '集成挑战（阶段 9-12）': '阶段 18：集成挑战（阶段 9-12）',
  '集成挑战（阶段 13-15）': '阶段 19：集成挑战（阶段 13-15）',
  '完整后台实战': '阶段 20：项目实战与 Capstone',
  '协同编辑（Yjs）': '阶段 20：项目实战与 Capstone',
  Capstone: '阶段 20：项目实战与 Capstone',
}

const allExercises = exerciseCatalog
  .map((exercise, index) => ({ ...exercise, __index: index }))
  .sort((left, right) => {
    const leftPhase = phaseOrder.indexOf(trackPhaseMap[left.track] ?? phaseOrder[phaseOrder.length - 1])
    const rightPhase = phaseOrder.indexOf(trackPhaseMap[right.track] ?? phaseOrder[phaseOrder.length - 1])

    if (leftPhase !== rightPhase) {
      return leftPhase - rightPhase
    }

    const leftTrack = trackOrder.indexOf(left.track)
    const rightTrack = trackOrder.indexOf(right.track)

    if (leftTrack !== rightTrack) {
      return leftTrack - rightTrack
    }

    return left.__index - right.__index
  })
  .map(({ __index, ...exercise }) => exercise)

const liteExerciseSlugs = [
  'js-01-destructure-profile',
  'js-02-filter-done',
  'js-03-map-titles',
  'js-05-merge-filters',
  'js-06-primary-email',
  'ts-02-pluck',
  'ts-03-format-result',
  'node-02-read-json-file',
  'css-01-dashboard-grid',
  'css-03-fix-dashboard-grid',
  'css-04-fix-form-alignment',
  'css-07-fix-modal-layer',
  'tailwind-01-card-classes',
  'components-01-user-badge',
  'components-02-section-shell',
  'dataflow-01-filter-panel',
  'lifecycle-01-basic-hooks',
  'state-01-local-panel',
  'state-02-pinia-store',
  'forms-02-validate-profile-form',
  'async-01-load-users',
  'errors-01-async-view',
  'routing-02-build-location',
  'reka-01-select',
  'shadcn-04-dialog',
  'nuxt-03-page',
  'testing-02-load-users-spec',
  'auth-03-attach-bearer',
  'realtime-02-reduce-sse-stream',
  'collab-02-create-y-todo-record',
]

const liteSlugSet = new Set(liteExerciseSlugs)

const profiles = {
  full: {
    id: 'full',
    title: '完整题库',
    description: '完整 185 题系统路线。',
    exercises: allExercises,
  },
  lite: {
    id: 'lite',
    title: '高价值 30 题',
    description: '只保留最值得先做的 30 题，适合先打通核心链路。',
    exercises: allExercises.filter((exercise) => liteSlugSet.has(exercise.slug)),
  },
}

const profileArg = process.argv[2]
const activeProfile =
  profileArg && Object.hasOwn(profiles, profileArg)
    ? profiles[profileArg]
    : profiles.full
const exercises = activeProfile.exercises
const trackTotals = exercises.reduce((accumulator, exercise) => {
  accumulator[exercise.track] = (accumulator[exercise.track] ?? 0) + 1
  return accumulator
}, {})

async function run(currentCommand) {
  switch (currentCommand) {
    case 'learn':
      await startLearnWatch()
      break
    case 'learn-once':
      printCurrentExercise()
      break
    case 'status':
      printStatus()
      break
    case 'check':
      await checkCurrentExercise()
      break
    case 'clue':
      printClue()
      break
    case 'hint':
      printClue()
      break
    case 'ai-hint':
      await printAiHint()
      break
    case 'why':
      printClue()
      break
    case 'next':
      moveToNextExercise()
      break
    case 'reset':
      resetProgress()
      break
    default:
      console.error(`Unknown command: ${currentCommand}`)
      process.exitCode = 1
  }
}

function regexExercise(exercise) {
  return {
    ...exercise,
    async validate(text) {
      return runRegexChecks(text, exercise.checks)
    },
  }
}

function moduleExercise(exercise) {
  return exercise
}

function ensureStateDir() {
  fs.mkdirSync(stateDir, { recursive: true })
}

function normalizeExerciseStats(rawStats) {
  return {
    saveCount: Math.max(0, Number(rawStats?.saveCount ?? 0)),
    attemptCount: Math.max(0, Number(rawStats?.attemptCount ?? 0)),
  }
}

function normalizeStatsMap(rawStats) {
  if (!rawStats || typeof rawStats !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(rawStats).map(([slug, stats]) => [slug, normalizeExerciseStats(stats)]),
  )
}

function normalizeProgress(rawProgress) {
  return {
    current: Math.min(rawProgress.current ?? 0, exercises.length - 1),
    completed: Array.isArray(rawProgress.completed)
      ? rawProgress.completed.filter((index) => Number.isInteger(index) && index >= 0 && index < exercises.length)
      : [],
    stats: normalizeStatsMap(rawProgress.stats),
  }
}

function loadStateFile() {
  if (!fs.existsSync(progressFile)) {
    return { version: 1, projects: {} }
  }

  const parsed = JSON.parse(fs.readFileSync(progressFile, 'utf8'))
  return {
    version: parsed.version ?? 1,
    projects: parsed.projects && typeof parsed.projects === 'object' ? parsed.projects : {},
  }
}

function loadProgress() {
  const state = loadStateFile()
  const savedProject = state.projects[progressProjectKey]

  if (savedProject) {
    return normalizeProgress(savedProject)
  }

  if (activeProfile.id === 'full' && state.projects[rootDir]) {
    const migrated = normalizeProgress(state.projects[rootDir])
    saveProgress(migrated)
    return migrated
  }

  if (fs.existsSync(legacyProgressFile)) {
    const migrated = normalizeProgress(JSON.parse(fs.readFileSync(legacyProgressFile, 'utf8')))
    saveProgress(migrated)
    return migrated
  }

  const initialProgress = { current: 0, completed: [] }
  saveProgress(initialProgress)
  return initialProgress
}

function saveProgress(progress) {
  ensureStateDir()
  const state = loadStateFile()
  state.projects[progressProjectKey] = {
    ...normalizeProgress(progress),
    updatedAt: new Date().toISOString(),
  }
  fs.writeFileSync(progressFile, JSON.stringify(state, null, 2) + '\n')
}

function getCurrentExercise() {
  const progress = loadProgress()
  return {
    progress,
    index: progress.current ?? 0,
    exercise: exercises[progress.current ?? 0],
  }
}

function getExerciseStats(progress, exercise) {
  return normalizeExerciseStats(progress?.stats?.[exercise.slug])
}

function bumpExerciseStat(progress, exerciseSlug, key) {
  const nextProgress = {
    ...progress,
    stats: {
      ...(progress.stats ?? {}),
    },
  }
  const currentStats = normalizeExerciseStats(nextProgress.stats[exerciseSlug])
  nextProgress.stats[exerciseSlug] = {
    ...currentStats,
    [key]: currentStats[key] + 1,
  }
  return nextProgress
}

function printCurrentExercise() {
  const { progress, index, exercise } = getCurrentExercise()

  if (!exercise) {
    console.log('所有练习都完成了。可以开始自己加题了。')
    return
  }

  const positionInTrack = getTrackPosition(index, exercise.track)
  const stats = getExerciseStats(progress, exercise)
  console.log(`\nvue-lings`)
  console.log(`当前模式: ${activeProfile.title}`)
  console.log(`当前进度: ${index + 1}/${exercises.length}`)
  console.log(`当前题目: ${exercise.title}`)
  console.log(`当前阶段: ${trackPhaseMap[exercise.track]}`)
  console.log(`所属主题: ${exercise.track} (${positionInTrack}/${trackTotals[exercise.track]})`)
  console.log(`目标文件: ${exercise.file}`)
  console.log(`核心目标: ${exercise.concept}`)
  console.log(`统计: 已保存 ${stats.saveCount} 次 / 已尝试 ${stats.attemptCount} 次`)
  console.log(``)
  console.log(`要做的事:`)
  for (const item of exercise.instructions) {
    console.log(`- ${item}`)
  }
  console.log(``)
  console.log(`完成后运行:`)
  console.log(`- ${getCommandLabel('check')}`)
  console.log(`- ${getCommandLabel('clue')}`)
  console.log(`- ${getCommandLabel('hint')}`)
  console.log(`- ${getCommandLabel('ai-hint')}`)
  console.log(`- 保存当前文件后，${getCommandLabel('learn')} 会自动检查`)
  if (progress.completed.includes(index)) {
    console.log(`- 这一题在当前进度里已标记通过，可以执行 ${getCommandLabel('next')}`)
  }
  console.log(``)
}

const trackHintMap = {
  JavaScript: {
    focus: '先把数据变换写成最小、纯净、可读的表达式。',
    apis: ['destructuring', 'find', 'some', 'every', 'sort', 'Set', 'flatMap', 'reduce', 'URLSearchParams', 'Promise.all'],
    pitfalls: ['不要修改输入数据。', '排序题先确认是否需要返回新数组。', '先写返回值形状，再考虑实现细节。'],
  },
  TypeScript: {
    focus: '先想类型关系，再写函数体。',
    apis: ['Record', 'keyof', 'Pick', 'Partial', 'Omit', 'ReadonlyArray', 'satisfies', 'Extract', 'Awaited', 'as const'],
    pitfalls: ['如果类型已经表达清楚，函数实现通常会更短。', '很多题先把类型别名写对，再回头补实现。'],
  },
  'Node.js': {
    focus: '先把输入输出边界想清楚，再决定用 path、fs、env、Buffer 还是 URL。',
    apis: ['path.join', 'fs/promises', 'process.env', 'Buffer', 'URL', 'URLSearchParams', 'EventEmitter', 'appendFile'],
    pitfalls: ['文件题注意 utf8、缩进和结尾换行。', '环境变量和 URL 题优先保证兜底逻辑稳定。'],
  },
  'CSS、动画': {
    focus: '优先看布局模型、层级和状态，而不是先调颜色。',
    apis: ['grid', 'flex', 'media query', 'transition', 'transform', 'z-index'],
    pitfalls: ['很多题先修容器，再修子元素。', '弹层题优先检查 position 和 z-index。'],
  },
  Sass: {
    focus: '把变量、mixin、嵌套三件事练熟。',
    apis: ['variables', 'mixin', '&:hover', 'nesting'],
    pitfalls: ['先改 token，再看组件样式有没有真正消费 token。'],
  },
  TailwindCSS: {
    focus: '把类名按基础结构类和状态类分开思考。',
    apis: ['utility classes', 'state classes', 'conditional classes'],
    pitfalls: ['先保证基础类始终存在，再加 selected/online 之类的分支类。'],
  },
  组件拆分: {
    focus: '先问“数据归谁管、事件往哪抛、结构哪里复用”。',
    apis: ['defineProps', 'defineEmits', 'slot'],
    pitfalls: ['子组件负责展示和发请求，不要自己接管父级状态。'],
  },
  单向数据流: {
    focus: '子组件消费 props，通过 emit 请求更新。',
    apis: ['props', 'emit', 'v-model style events', 'immutable update'],
    pitfalls: ['不要直接改传入数据。', '先确认事件名和参数形状。'],
  },
  Composables: {
    focus: '把可复用状态和逻辑收进函数返回值里。',
    apis: ['ref', 'computed', 'composable return shape'],
    pitfalls: ['先想暴露哪些 state 和 action。'],
  },
  生命周期: {
    focus: '副作用什么时候开始、什么时候清理，比背钩子名更重要。',
    apis: ['onMounted', 'onUnmounted', 'watch'],
    pitfalls: ['定时器、监听器、连接都要在卸载时清理。'],
  },
  状态管理: {
    focus: '先定义最小 state，再加 getter 和 action。',
    apis: ['Pinia', 'state', 'getter', 'action'],
    pitfalls: ['共享状态题先看哪些值应该集中存。'],
  },
  表单: {
    focus: '先立稳定表单模型，再做校验和提交。',
    apis: ['form model', 'validation', 'error object'],
    pitfalls: ['错误对象通常和表单字段一一对应。'],
  },
  异步数据获取: {
    focus: '把接口返回统一成页面容易消费的结构。',
    apis: ['try/catch', 'async/await', 'mapping'],
    pitfalls: ['成功和失败分支都要返回稳定形状。'],
  },
  '错误处理与加载态': {
    focus: '把 idle / loading / success / error 当成一等状态。',
    apis: ['state machine', 'error normalization'],
    pitfalls: ['错误分支优先保证可展示文案。'],
  },
  路由: {
    focus: '先分清 params 是资源身份，query 是页面状态。',
    apis: ['routes', 'redirect', 'params', 'query'],
    pitfalls: ['路由题先看 name、path、params、query 是否都齐了。'],
  },
  'Reka UI': {
    focus: '按原语结构一层层搭：Root、Trigger、Content、Item。',
    apis: ['headless primitives', 'v-model', 'controlled open'],
    pitfalls: ['先补完整结构，再补样式或文案。'],
  },
  'shadcn/vue': {
    focus: 'shadcn 更像组件组合，不是单一黑盒组件。',
    apis: ['Button', 'Card', 'Dialog', 'Tabs', 'Select', 'Sheet'],
    pitfalls: ['先确认导入路径，再确认组合层级。'],
  },
  'Nuxt Todo': {
    focus: '把接口、composable、页面三层串起来。',
    apis: ['defineEventHandler', 'useAsyncData', 'composable'],
    pitfalls: ['先让数据通，再补 pending / error / list。'],
  },
  'Service Worker': {
    focus: '先搞清有没有 service worker，再谈更新流程。',
    apis: ['register', 'installed', 'controller'],
    pitfalls: ['更新提示依赖 installed + hasController。'],
  },
  WASM: {
    focus: '先做能力检测，再理解 exports 的调用边界。',
    apis: ['WebAssembly', 'instantiate', 'exports'],
    pitfalls: ['缺导出时记得走错误分支。'],
  },
  '浏览器与网络': {
    focus: '把浏览器发请求时真正关心的 method、header、cache、cors 想清楚。',
    apis: ['RequestInit', 'CORS', 'preflight', 'Cache-Control'],
    pitfalls: ['先看是否简单请求，再看是否会预检。'],
  },
  测试: {
    focus: '先写最小断言，再补成功/失败分支。',
    apis: ['describe', 'it', 'expect', 'vi.fn'],
    pitfalls: ['题目通常要求覆盖至少两个分支。'],
  },
  性能: {
    focus: '优先做资源加载策略和窗口化这种高频判断题。',
    apis: ['lazy/eager', 'windowing', 'preconnect'],
    pitfalls: ['不是所有资源都值得 eager 或 preconnect。'],
  },
  认证: {
    focus: '前端认证题先看 cookie、token、权限判断。',
    apis: ['cookie options', 'Bearer token', 'role guard'],
    pitfalls: ['先保证安全默认值，再考虑业务分支。'],
  },
  'Nuxt SSR': {
    focus: '先判断渲染策略，再看 useAsyncData 选项。',
    apis: ['ssr', 'csr', 'ssg', 'useAsyncData'],
    pitfalls: ['SEO、个性化、实时性是三个常见判断维度。'],
  },
  '完整后台实战': {
    focus: '后台题先看列表、筛选、排序、分页这些高频动作。',
    apis: ['filter', 'sort', 'pagination'],
    pitfalls: ['很多题要求不可变返回新数组或新状态。'],
  },
  'DOM 与事件': {
    focus: '事件题先看触发条件，再看副作用。',
    apis: ['keydown', 'preventDefault', 'closest'],
    pitfalls: ['Enter、outside click、快捷键都是高频题型。'],
  },
  可访问性: {
    focus: '先补 role、aria 和键盘可操作性。',
    apis: ['aria-describedby', 'aria-invalid', 'role=dialog'],
    pitfalls: ['不要只顾视觉状态，表单和弹层都要有语义。'],
  },
  '浏览器存储': {
    focus: '存储题先保住读取安全性和 key 规则。',
    apis: ['localStorage', 'JSON.parse', 'key normalization'],
    pitfalls: ['坏数据和空值都要能兜住。'],
  },
  '文件上传': {
    focus: '先做类型/大小校验，再看预览和进度状态。',
    apis: ['file validation', 'createObjectURL', 'upload state'],
    pitfalls: ['上传 UI 最怕状态不稳定。'],
  },
  'SSE / WebSocket': {
    focus: '先分清单向流式和双向会话，再看状态收敛。',
    apis: ['EventSource', 'WebSocket', 'message envelope', 'reconnect'],
    pitfalls: ['SSE 适合流式 token。', 'WebSocket 适合双向消息、presence、协同。'],
  },
  '协同编辑（Yjs）': {
    focus: '先统一共享文档的数据形状，再考虑多人同步体验。',
    apis: ['room', 'Y.Doc', 'awareness', 'shared record'],
    pitfalls: ['协同题通常先规范 room、todo record、awareness user。'],
  },
  '数据层': {
    focus: '先想数据形状、缓存边界和不可变更新，再写界面。',
    apis: ['normalized entities', 'query key', 'pagination merge', 'optimistic update', 'stale state'],
    pitfalls: ['数据层题很多都是“保持稳定形状”和“别破坏已有缓存”。'],
  },
  'Vue Query / TanStack Query': {
    focus: '先把 queryKey、enabled、select、invalidate、mutation 这些高频骨架练稳。',
    apis: ['queryOptions', 'infiniteQueryOptions', 'keepPreviousData', 'invalidateQueries', 'optimistic update'],
    pitfalls: ['queryKey 要稳定。', '先把缓存边界想清楚，再写 mutation。'],
  },
  '安全': {
    focus: '先做最小安全边界，再考虑业务细节和用户体验。',
    apis: ['sanitize policy', 'csrf header', 'redirect validation', 'token masking'],
    pitfalls: ['安全题优先防默认不安全。', '重定向和日志最容易漏掉边界。'],
  },
  '观测': {
    focus: '把错误、耗时、性能指标都变成稳定结构，而不是散落 console。',
    apis: ['error event', 'duration metric', 'sampling', 'web vitals payload'],
    pitfalls: ['观测题常见问题是结构不稳定，导致后端难以聚合。'],
  },
  '修复与重构': {
    focus: '先把 bug 的不变量找出来，再收敛成更稳定的状态或 view model。',
    apis: ['race guard', 'immutable cleanup', 'view model', 'state reducer', 'selection toggle'],
    pitfalls: ['重构题优先保行为稳定。', '很多 bug 来自旧状态覆盖新状态。'],
  },
  '设计系统': {
    focus: '先把 token、theme、variant 和 primitive 的边界分清楚，再谈视觉细节。',
    apis: ['design tokens', 'theme vars', 'variant classes', 'primitive component', 'data-state'],
    pitfalls: ['设计系统题先稳接口，再补样式。', '别把语义层和视觉层混在一起。'],
  },
  '复杂交互': {
    focus: '复杂交互先拆成稳定的数据变换和导航规则，再挂 UI。',
    apis: ['reorder', 'virtual window', 'chart series', 'command palette', 'shortcut label', 'active index'],
    pitfalls: ['很多复杂交互题真正难的是边界和顺序稳定性。'],
  },
  '阶段 1 Checkpoint': {
    focus: '回头用一个小对象把语言和运行时基础串起来。',
    apis: ['query string', 'env', 'auth header'],
    pitfalls: ['checkpoint 题关键是把零散知识收束成一套稳定输出。'],
  },
  '阶段 2 Checkpoint': {
    focus: '把 token、class 和 motion 三层一起考虑。',
    apis: ['tokens', 'class recipe', 'motion'],
    pitfalls: ['不要只输出颜色，checkpoint 要体现样式体系。'],
  },
  '阶段 3 Checkpoint': {
    focus: '把 filters、状态和事件模型整合成页面思维。',
    apis: ['view state', 'filters', 'events'],
    pitfalls: ['不要只写一个字段，checkpoint 要体现组合能力。'],
  },
  '阶段 4 Checkpoint': {
    focus: '说清楚 UI 生态里的 primitive 和 composition 分工。',
    apis: ['dialog', 'tabs', 'select', 'button'],
    pitfalls: ['checkpoint 不是列名词，要体现怎么组合。'],
  },
  '阶段 5 Checkpoint': {
    focus: '确认你已经能把 Nuxt 服务端、数据层和页面串起来。',
    apis: ['route', 'useAsyncData', 'server handler', 'composable'],
    pitfalls: ['别只写页面名，要体现数据链路。'],
  },
  '阶段 6 Checkpoint': {
    focus: '把平台能力落实成刷新、离线和计算策略。',
    apis: ['service worker', 'wasm', 'refresh'],
    pitfalls: ['checkpoint 题要给出明确判断，不要泛泛而谈。'],
  },
  '阶段 7 Checkpoint': {
    focus: '把预检、缓存和 mode 联合起来思考。',
    apis: ['preflight', 'cache', 'request mode'],
    pitfalls: ['浏览器网络题不要只看 method。'],
  },
  '阶段 8 Checkpoint': {
    focus: '形成最小测试金字塔。',
    apis: ['unit', 'component', 'e2e'],
    pitfalls: ['别把所有事都堆到 e2e。'],
  },
  '阶段 9 Checkpoint': {
    focus: '把安全请求和性能策略放进同一个运行时视角。',
    apis: ['auth', 'loading strategy', 'preconnect'],
    pitfalls: ['性能和认证不是分开的两块。'],
  },
  '阶段 10 Checkpoint': {
    focus: '把 SSR、asyncData 和后台页面模型连起来。',
    apis: ['render strategy', 'pagination', 'filters'],
    pitfalls: ['不要把 SSR 看成只有 SEO。'],
  },
  '阶段 11 Checkpoint': {
    focus: '把输入交互、语义、存储和上传的体验打包起来。',
    apis: ['shortcut', 'aria', 'storage', 'upload state'],
    pitfalls: ['要体现用户路径，而不是只列 API。'],
  },
  '阶段 12 Checkpoint': {
    focus: '把实时链接和协同房间建模为同一套系统。',
    apis: ['sse', 'websocket', 'room', 'reconnect'],
    pitfalls: ['不要只写连接地址。'],
  },
  '阶段 13 Checkpoint': {
    focus: '把 query key、乐观更新和安全边界联合起来。',
    apis: ['query key', 'csrf', 'redirect'],
    pitfalls: ['高级阶段的 checkpoint 要体现边界意识。'],
  },
  '阶段 14 Checkpoint': {
    focus: '把监控、追踪和 bug 修复能力收束成上线思维。',
    apis: ['error event', 'trace', 'race guard'],
    pitfalls: ['别只写监控，不写如何接住问题。'],
  },
  '阶段 15 Checkpoint': {
    focus: '把 query layer、设计系统和复杂交互拉成一个产品面板。',
    apis: ['query layer', 'design system', 'interactions'],
    pitfalls: ['checkpoint 题要体现高级专题之间的连接。'],
  },
  '集成挑战（阶段 1-4）': {
    focus: '把基础到 UI 生态串成一个真正可用的前端模块。',
    apis: ['filters', 'routes', 'ui', 'state'],
    pitfalls: ['集成题重点是跨主题协作，不是单点 API。'],
  },
  '集成挑战（阶段 5-8）': {
    focus: '把框架、平台、网络和质量打成一条交付链。',
    apis: ['nuxt', 'platform', 'network', 'tests'],
    pitfalls: ['要体现真实交付，而不是松散清单。'],
  },
  '集成挑战（阶段 9-12）': {
    focus: '把运行时、可访问性和实时系统放到同一个产品视角。',
    apis: ['auth', 'ssr', 'a11y', 'realtime'],
    pitfalls: ['集成题要让系统边界变清楚。'],
  },
  '集成挑战（阶段 13-15）': {
    focus: '把高级前端各子系统整成一个架构方案。',
    apis: ['data layer', 'security', 'observability', 'design system', 'interactions'],
    pitfalls: ['这是高级前端真正拉开差距的地方。'],
  },
  Capstone: {
    focus: '把题库里的能力最终沉淀成可交付项目蓝图。',
    apis: ['routes', 'data modules', 'ui modules', 'collaboration', 'quality gate'],
    pitfalls: ['capstone 不是只列需求，要体现结构和交付标准。'],
  },
}

function buildExerciseHints(exercise) {
  const base = trackHintMap[exercise.track] ?? {
    focus: '先回到题目的最小目标，把返回值或组件结构补完整。',
    apis: [],
    pitfalls: [],
  }

  const hints = [
    `先实现最小正确结果，\`TODO:\` 注释现在可以保留。`,
    `把题目要求拆成最小两三步，先做数据/结构，再补边角。`,
  ]

  if (exercise.instructions?.length) {
    hints.push(`检查器重点通常就在这些动作里：${exercise.instructions.join('；')}`)
  }

  if (exercise.checks?.length) {
    hints.push('这一题是静态规则检查题，关键字、事件名、props 名、模板结构要和要求对齐。')
  } else {
    hints.push('这一题是运行验证题，重点是返回值和行为，不是单纯把字符串写出来。')
  }

  return {
    ...base,
    hints,
  }
}

function printClue() {
  const { index, exercise } = getCurrentExercise()
  const { progress } = getCurrentExercise()

  if (!exercise) {
    console.log('所有练习都完成了。现在没有当前题目的提示。')
    return
  }

  const exerciseHints = buildExerciseHints(exercise)
  const stats = getExerciseStats(progress, exercise)

  console.log(`\nvue-lings clue`)
  console.log(`当前模式: ${activeProfile.title}`)
  console.log(`当前题目: ${exercise.title}`)
  console.log(`当前进度: ${index + 1}/${exercises.length}`)
  console.log(`目标文件: ${exercise.file}`)
  console.log(`所属主题: ${exercise.track}`)
  console.log(`进度文件: ${progressFile}`)
  console.log(`统计: 已保存 ${stats.saveCount} 次 / 已尝试 ${stats.attemptCount} 次`)
  console.log(``)
  console.log(`这题在练什么:`)
  console.log(`- ${exercise.concept}`)
  console.log(`- 当前切入点：${exerciseHints.focus}`)
  if (exerciseHints.apis.length > 0) {
    console.log(`- 这题常会用到：${exerciseHints.apis.join(' / ')}`)
  }
  console.log(``)
  console.log(`做题提示:`)
  for (const hint of exerciseHints.hints) {
    console.log(`- ${hint}`)
  }
  if (exerciseHints.pitfalls.length > 0) {
    console.log(``)
    console.log(`容易卡住:`)
    for (const pitfall of exerciseHints.pitfalls) {
      console.log(`- ${pitfall}`)
    }
  }
  console.log(``)
  console.log(`提示命令:`)
  console.log(`- ${getCommandLabel('clue')}`)
  console.log(`- ${getCommandLabel('hint')}`)
  console.log(`- ${getCommandLabel('ai-hint')}`)
  console.log(``)
}

function printStatus() {
  const progress = loadProgress()
  let currentPhase = ''
  let currentTrack = ''

  console.log(`\nvue-lings status`)
  console.log(`模式: ${activeProfile.title} (${activeProfile.description})`)
  for (const [index, exercise] of exercises.entries()) {
    const phase = trackPhaseMap[exercise.track]

    if (phase !== currentPhase) {
      currentPhase = phase
      currentTrack = ''
      console.log(`\n${phase}`)
    }

    if (exercise.track !== currentTrack) {
      currentTrack = exercise.track
      console.log(`\n${currentTrack}`)
    }

    const marker =
      progress.current === index
        ? '>'
        : progress.completed.includes(index)
          ? 'x'
          : ' '

    console.log(`[${marker}] ${index + 1}. ${exercise.title}`)
  }
  console.log(``)
}

async function startLearnWatch() {
  const intro = getCurrentExercise()

  if (!intro.exercise) {
    console.log('所有练习都完成了。')
    return
  }

  console.log(`\nvue-lings watch`)
  console.log(`模式: ${activeProfile.title}`)
  console.log(`状态: 已进入常驻模式，监听当前题目文件变更`)
  console.log(`退出方式: Ctrl+C`)
  printCurrentExercise()
  await watchCurrentExerciseLoop()
}

async function watchCurrentExerciseLoop() {
  let currentFile = ''
  let watcher = null
  let debounceTimer = null
  let runningCheck = false
  let queued = false

  const runAutoCheck = async () => {
    if (runningCheck) {
      queued = true
      return
    }

    runningCheck = true
    let result

    try {
      const { progress, exercise } = getCurrentExercise()
      saveProgress(bumpExerciseStat(progress, exercise.slug, 'saveCount'))
      console.log(`\n检测到文件变更，自动检查中...`)
      result = await checkCurrentExercise({
        autoAdvance: true,
        quietSuccess: false,
        suppressExitCode: true,
      })
    } catch (error) {
      console.log(`\n自动检查失败，但 watch 会继续运行:`)
      console.log(`- ${formatUnexpectedError(error)}`)
      console.log(``)
      result = { ok: false, finished: false, advanced: false }
    } finally {
      runningCheck = false
    }

    if (result?.advanced) {
      printCurrentExercise()
      printClue()
      armWatcher()
      return
    }

    if (queued) {
      queued = false
      await runAutoCheck()
    }
  }

  const closeWatcher = () => {
    if (watcher) {
      watcher.close()
      watcher = null
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  const armWatcher = () => {
    const { exercise } = getCurrentExercise()

    if (!exercise) {
      closeWatcher()
      console.log(`\n所有练习都完成了。watch 模式结束。`)
      return
    }

    const nextFile = path.join(rootDir, exercise.file)
    if (nextFile === currentFile && watcher) {
      return
    }

    closeWatcher()
    currentFile = nextFile
    const currentDir = path.dirname(currentFile)
    const currentBaseName = path.basename(currentFile)

    watcher = fs.watch(currentDir, (_eventType, filename) => {
      if (filename && filename.toString() !== currentBaseName) {
        return
      }

      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(runAutoCheck, 240)
    })

    console.log(`监听文件: ${exercise.file}`)
  }

  armWatcher()

  await new Promise((resolve) => {
    process.on('SIGINT', () => {
      closeWatcher()
      console.log(`\n已退出 vue-lings watch。`)
      resolve()
    })
  })
}

function getCommandLabel(commandName) {
  const commandAliasMap = {
    'ai-hint': activeProfile.id === 'lite' ? 'pnpm lite:ai:hint' : 'pnpm ai:hint',
  }

  if (commandAliasMap[commandName]) {
    return commandAliasMap[commandName]
  }

  if (activeProfile.id === 'lite') {
    return `pnpm lite:${commandName}`
  }

  if (commandName.includes(':')) {
    return `pnpm ${commandName}`
  }

  return `pnpm ${commandName}`
}

progressProjectKey = `${rootDir}::${activeProfile.id}`
const command = activeProfile.id === 'full' && profileArg !== 'full'
  ? process.argv[2] ?? 'learn'
  : process.argv[3] ?? 'learn'

await run(command)

async function checkCurrentExercise(options = {}) {
  const { autoAdvance = false, quietSuccess = false, suppressExitCode = false } = options
  let { progress, index, exercise } = getCurrentExercise()

  if (!exercise) {
    console.log('没有剩余练习需要检查。')
    return { ok: true, finished: true, advanced: false }
  }

  progress = bumpExerciseStat(progress, exercise.slug, 'attemptCount')
  saveProgress(progress)

  const fullPath = path.join(rootDir, exercise.file)
  const text = fs.readFileSync(fullPath, 'utf8')
  const issues = await collectExerciseIssues(exercise, text)

  if (issues.length > 0) {
    console.log(`\n未通过: ${exercise.title}`)
    const visibleIssues = issues.slice(0, 2)
    for (const issue of visibleIssues) {
      console.log(`- ${issue}`)
    }
    if (issues.length > visibleIssues.length) {
      console.log(`- 还有 ${issues.length - visibleIssues.length} 条未显示，先修最关键的这几条。`)
    }
    console.log(``)
    console.log(`继续修改 ${exercise.file}，然后再运行 ${getCommandLabel('check')}`)
    console.log(``)
    if (!suppressExitCode) {
      process.exitCode = 1
    }
    return { ok: false, finished: false, advanced: false }
  }

  if (!progress.completed.includes(index)) {
    progress.completed.push(index)
  }
  saveProgress(progress)

  if (!quietSuccess) {
    console.log(`\n通过: ${exercise.title}`)
  }

  if (autoAdvance) {
    if (index < exercises.length - 1) {
      progress.current = index + 1
      saveProgress(progress)
      if (!quietSuccess) {
        console.log(`自动进入下一题: ${exercises[progress.current].title}`)
        console.log(``)
      }
      return { ok: true, finished: false, advanced: true }
    }

    if (!quietSuccess) {
      console.log(`你已经完成这一组练习了`)
      console.log(``)
    }
    return { ok: true, finished: true, advanced: false }
  }

  console.log(`下一步:`)
  if (index < exercises.length - 1) {
    console.log(`- 运行 ${getCommandLabel('next')} 进入下一题`)
  } else {
    console.log(`- 你已经完成这一组练习了`)
  }
  console.log(``)
  return { ok: true, finished: index >= exercises.length - 1, advanced: false }
}

function moveToNextExercise() {
  const progress = loadProgress()
  const current = progress.current ?? 0

  if (!progress.completed.includes(current)) {
    console.log(`当前题目还没通过，先运行 pnpm check`)
    process.exitCode = 1
    return
  }

  if (current >= exercises.length - 1) {
    console.log(`已经是最后一题了。`)
    return
  }

  progress.current = current + 1
  saveProgress(progress)

  console.log(`已进入下一题: ${exercises[progress.current].title}`)
  printClue()
}

function resetProgress() {
  saveProgress({ current: 0, completed: [] })
  console.log('练习进度已重置。运行 pnpm learn 从第一题开始。')
}

function runRegexChecks(text, checks) {
  const failures = []

  for (const [regex, message] of checks) {
    if (!regex.test(text)) {
      failures.push(message)
    }
  }

  return failures
}

async function collectExerciseIssues(exercise, text) {
  const preIssues = exercise.preChecks
    ? runRegexChecks(text, exercise.preChecks)
    : []

  if (preIssues.length > 0) {
    return preIssues
  }

  try {
    return await exercise.validate(text, exercise)
  } catch (error) {
    return [formatExerciseRuntimeError(error)]
  }
}

function getTrackPosition(index, track) {
  let position = 0
  for (let currentIndex = 0; currentIndex <= index; currentIndex += 1) {
    if (exercises[currentIndex].track === track) {
      position += 1
    }
  }
  return position
}

async function importExerciseModule(file) {
  const moduleUrl = pathToFileURL(path.join(rootDir, file)).href
  return import(`${moduleUrl}?t=${Date.now()}`)
}

function formatExerciseRuntimeError(error) {
  const message = formatUnexpectedError(error)

  if (
    message.includes('ERR_INVALID_TYPESCRIPT_SYNTAX') ||
    message.includes('SyntaxError') ||
    message.includes('Unexpected token') ||
    message.includes('Expected ident')
  ) {
    return `当前题目文件有语法错误，先把 TypeScript / JavaScript 语法补完整。详情: ${message}`
  }

  return `运行这道题时抛出了错误: ${message}`
}

function formatUnexpectedError(error) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function loadAiConfig() {
  if (!fs.existsSync(aiConfigFile)) {
    return null
  }

  const parsed = JSON.parse(fs.readFileSync(aiConfigFile, 'utf8'))
  if (!parsed.apiKey || !parsed.endpoint || !parsed.model) {
    return null
  }

  return parsed
}

async function requestAiExerciseHint(exercise, text, issues) {
  const config = loadAiConfig()

  if (!config) {
    throw new Error(`缺少 AI 配置，请检查 ${aiConfigFile}`)
  }

  const issueText =
    issues.length > 0 ? issues.slice(0, 3).map((issue) => `- ${issue}`).join('\n') : '- 当前代码已经通过检查，请给出更优写法建议。'

  const prompt = [
    `你是一个前端练习助教。请根据当前练习给出中文提示。`,
    `练习标题：${exercise.title}`,
    `主题：${exercise.track}`,
    `核心目标：${exercise.concept}`,
    `要求：`,
    ...exercise.instructions.map((item) => `- ${item}`),
    `当前检查结果：`,
    issueText,
    `当前代码：`,
    '```',
    text.slice(0, 12000),
    '```',
    `请按下面格式输出：`,
    `思路提示：给 2-4 条，偏指导，不直接把完整答案一字不差写出来。`,
    `更优解法：给 1-3 条，说明当前题如果写通后还可以怎样更简洁或更符合工程习惯。`,
  ].join('\n')

  const response = await fetch(`${config.endpoint.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: '你是一个严格但友好的前端练习助教，输出使用简洁中文。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      stream: false,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`AI 提示请求失败：${response.status} ${detail.slice(0, 200)}`)
  }

  const payload = await response.json()
  return payload.choices?.[0]?.message?.content?.trim() ?? 'AI 没有返回内容。'
}

async function printAiHint() {
  const { exercise, index, progress } = getCurrentExercise()

  if (!exercise) {
    console.log('所有练习都完成了。现在没有 AI 提示。')
    return
  }

  const fullPath = path.join(rootDir, exercise.file)
  const text = fs.readFileSync(fullPath, 'utf8')
  const issues = await collectExerciseIssues(exercise, text)
  const stats = getExerciseStats(progress, exercise)

  console.log(`\nvue-lings ai`)
  console.log(`当前模式: ${activeProfile.title}`)
  console.log(`当前题目: ${exercise.title}`)
  console.log(`当前进度: ${index + 1}/${exercises.length}`)
  console.log(`配置文件: ${aiConfigFile}`)
  console.log(`统计: 已保存 ${stats.saveCount} 次 / 已尝试 ${stats.attemptCount} 次`)
  console.log(``)

  try {
    const content = await requestAiExerciseHint(exercise, text, issues)
    console.log(content)
    console.log(``)
  } catch (error) {
    console.log(`AI 提示失败:`)
    console.log(`- ${error instanceof Error ? error.message : String(error)}`)
    console.log(``)
    process.exitCode = 1
  }
}
