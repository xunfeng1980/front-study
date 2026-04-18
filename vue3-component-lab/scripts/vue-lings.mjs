import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const rootDir = process.cwd()
const stateDir = path.join(os.homedir(), '.vue')
const progressFile = path.join(stateDir, 'vue-lings-progress.json')
const legacyProgressFile = path.join(rootDir, '.vue-lings-progress.json')
const progressProjectKey = rootDir

const exerciseCatalog = [
  regexExercise({
    slug: 'components-01-user-badge',
    track: '组件拆分',
    title: '组件拆分 1/2：展示组件接收 props',
    file: 'exercises/07-component-boundary/UserBadgeExercise.vue',
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
    file: 'exercises/07-component-boundary/SectionShellExercise.vue',
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
    file: 'exercises/08-one-way-data-flow/FilterPanelExercise.vue',
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
    file: 'exercises/08-one-way-data-flow/toggleTask.ts',
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
    file: 'exercises/11-state-management/localPanelState.ts',
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
    file: 'exercises/11-state-management/LearningStoreExercise.ts',
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
    file: 'exercises/09-lifecycle-basic/LifecycleHooksExercise.vue',
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
    file: 'exercises/10-lifecycle-effects/PollingCleanupExercise.vue',
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
    file: 'exercises/15-routing/routes.ts',
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
    file: 'exercises/15-routing/buildStudyLocation.ts',
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
    file: 'exercises/12-forms/createProfileForm.ts',
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
    file: 'exercises/12-forms/validateProfileForm.ts',
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
    file: 'exercises/13-async-data/loadUsers.ts',
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
    file: 'exercises/13-async-data/mapUserOptions.ts',
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
    file: 'exercises/14-error-and-loading/async-state.ts',
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
    file: 'exercises/14-error-and-loading/toErrorMessage.ts',
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
    file: 'exercises/03-css-layout/dashboard-card.css',
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
    file: 'exercises/04-css-animation/fade-up.css',
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
    file: 'exercises/03-css-layout/fixDashboardGrid.css',
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
    file: 'exercises/03-css-layout/fixFormAlignment.css',
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
    file: 'exercises/03-css-layout/fixMobileCards.css',
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
    file: 'exercises/04-css-animation/fixHoverCard.css',
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
    file: 'exercises/04-css-animation/fixModalLayer.css',
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
    file: 'exercises/20-wasm/supportsWasm.ts',
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
    file: 'exercises/20-wasm/callWasmAdd.ts',
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
    file: 'exercises/19-service-worker/registerServiceWorker.ts',
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
    file: 'exercises/19-service-worker/shouldPromptForRefresh.ts',
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
    file: 'exercises/05-sass/_tokens.scss',
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
    file: 'exercises/05-sass/profile-panel.scss',
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
    file: 'exercises/06-tailwindcss/buildCardClasses.ts',
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
    file: 'exercises/06-tailwindcss/buildStatusBadgeClasses.ts',
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
    file: 'exercises/18-nuxt-todo/server/api/todos.get.ts',
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
    file: 'exercises/18-nuxt-todo/composables/useTodoFilter.ts',
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
    file: 'exercises/18-nuxt-todo/pages/todos/index.vue',
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
    file: 'exercises/17-shadcn-vue/ButtonInputExercise.vue',
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
    file: 'exercises/17-shadcn-vue/CardExercise.vue',
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
    file: 'exercises/17-shadcn-vue/ButtonAsChildExercise.vue',
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
    file: 'exercises/17-shadcn-vue/DialogExercise.vue',
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
    file: 'exercises/17-shadcn-vue/TabsExercise.vue',
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
    file: 'exercises/17-shadcn-vue/SelectExercise.vue',
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
    file: 'exercises/17-shadcn-vue/CheckboxExercise.vue',
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
    file: 'exercises/17-shadcn-vue/SheetExercise.vue',
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
    file: 'exercises/16-reka-ui-components/SelectExercise.vue',
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
    file: 'exercises/16-reka-ui-components/MenubarExercise.vue',
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
    file: 'exercises/16-reka-ui-components/ControlledOpenExercise.vue',
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
    file: 'exercises/16-reka-ui-components/DialogExercise.vue',
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
    file: 'exercises/16-reka-ui-components/TabsExercise.vue',
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
    file: 'exercises/16-reka-ui-components/TooltipExercise.vue',
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
    file: 'exercises/16-reka-ui-components/DropdownMenuExercise.vue',
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
    file: 'exercises/16-reka-ui-components/AccordionExercise.vue',
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
    title: 'JavaScript 1/7：对象解构',
    file: 'exercises/01-javascript/destructureProfile.ts',
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
    title: 'JavaScript 2/7：filter',
    file: 'exercises/01-javascript/filterDoneTodos.ts',
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
    title: 'JavaScript 3/7：map',
    file: 'exercises/01-javascript/mapTaskTitles.ts',
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
    title: 'JavaScript 4/7：reduce',
    file: 'exercises/01-javascript/sumTaskPoints.ts',
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
    title: 'JavaScript 5/7：对象展开合并',
    file: 'exercises/01-javascript/mergeFilters.ts',
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
    title: 'JavaScript 6/7：optional chaining + nullish coalescing',
    file: 'exercises/01-javascript/getPrimaryEmail.ts',
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
    title: 'JavaScript 7/7：Promise.all + async/await',
    file: 'exercises/01-javascript/loadDashboard.ts',
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
  regexExercise({
    slug: 'ts-01-record',
    track: 'TypeScript',
    title: 'TypeScript 1/6：Record',
    file: 'exercises/02-typescript/createMetricRecord.ts',
    concept: '`Record` 在前端里特别常见，常拿来表示状态表、映射表和字典对象。',
    instructions: ['把 `metrics` 明确标注成 `Record<string, number>`。'],
    checks: [[/const\s+metrics:\s*Record<string,\s*number>\s*=/, '还没有用 `Record<string, number>` 标注。']],
  }),
  moduleExercise({
    slug: 'ts-02-pluck',
    track: 'TypeScript',
    title: 'TypeScript 2/6：泛型 + keyof',
    file: 'exercises/02-typescript/pluck.ts',
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
    title: 'TypeScript 3/6：联合类型收窄',
    file: 'exercises/02-typescript/formatResult.ts',
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
    title: 'TypeScript 4/6：Partial',
    file: 'exercises/02-typescript/mergeConfig.ts',
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
    title: 'TypeScript 5/6：泛型返回类型',
    file: 'exercises/02-typescript/toIdLabel.ts',
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
    title: 'TypeScript 6/6：Pick + keyof 组合',
    file: 'exercises/02-typescript/pickFields.ts',
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
    slug: 'composable-01-use-counter',
    track: 'Composables',
    title: 'Composables 1/3：useCounter',
    file: 'exercises/27-composables/useCounter.ts',
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
    file: 'exercises/27-composables/useToggle.ts',
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
    file: 'exercises/27-composables/useFilteredList.ts',
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
    file: 'exercises/21-browser-network/buildJsonRequest.ts',
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
    file: 'exercises/21-browser-network/shouldPreflight.ts',
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
    file: 'exercises/21-browser-network/parseCacheControl.ts',
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
    file: 'exercises/28-dom-events/handleEnterSubmit.ts',
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
    file: 'exercises/28-dom-events/shouldIgnoreClickOutside.ts',
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
    file: 'exercises/28-dom-events/buildKeyShortcutLabel.ts',
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
    file: 'exercises/29-accessibility/buildInputAria.ts',
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
    file: 'exercises/29-accessibility/getDialogA11yProps.ts',
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
    file: 'exercises/29-accessibility/isInteractiveKey.ts',
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
    file: 'exercises/22-testing/requestStatus.spec.ts',
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
    file: 'exercises/22-testing/loadUsers.spec.ts',
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
    file: 'exercises/23-performance/chooseImageLoading.ts',
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
    file: 'exercises/23-performance/buildListWindow.ts',
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
    file: 'exercises/23-performance/shouldPreconnectOrigin.ts',
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
    file: 'exercises/24-authentication/createAuthCookieOptions.ts',
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
    file: 'exercises/24-authentication/canAccessAdmin.ts',
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
    file: 'exercises/24-authentication/attachBearerToken.ts',
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
    file: 'exercises/30-browser-storage/safeReadJson.ts',
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
    file: 'exercises/30-browser-storage/buildStorageKey.ts',
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
    file: 'exercises/30-browser-storage/mergeRecentSearches.ts',
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
    file: 'exercises/31-file-upload/validateUploadFile.ts',
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
    file: 'exercises/31-file-upload/getUploadPreviewUrl.ts',
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
    file: 'exercises/31-file-upload/buildUploadState.ts',
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
    file: 'exercises/25-nuxt-ssr/chooseRenderStrategy.ts',
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
    file: 'exercises/25-nuxt-ssr/buildAsyncDataOptions.ts',
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
    file: 'exercises/26-admin-dashboard/applyIssueFilters.ts',
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
    file: 'exercises/26-admin-dashboard/sortTableRows.ts',
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
    file: 'exercises/26-admin-dashboard/buildPaginationState.ts',
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
    file: 'exercises/32-sse-websocket/buildSseUrl.ts',
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
    file: 'exercises/32-sse-websocket/reduceSseStream.ts',
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
    file: 'exercises/32-sse-websocket/createSocketEnvelope.ts',
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
    file: 'exercises/32-sse-websocket/shouldReconnectSocket.ts',
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
    file: 'exercises/33-collaboration-yjs/normalizeCollabRoom.ts',
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
    file: 'exercises/33-collaboration-yjs/createYTodoRecord.ts',
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
    file: 'exercises/33-collaboration-yjs/findYTodoIndex.ts',
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
    file: 'exercises/33-collaboration-yjs/buildAwarenessUser.ts',
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
]

const phaseOrder = [
  '阶段 1：JavaScript / TypeScript 基础',
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
]

const trackOrder = [
  'JavaScript',
  'TypeScript',
  'CSS、动画',
  'Sass',
  'TailwindCSS',
  '组件拆分',
  '单向数据流',
  'Composables',
  '生命周期',
  '状态管理',
  '表单',
  '异步数据获取',
  '错误处理与加载态',
  '路由',
  'Reka UI',
  'shadcn/vue',
  'Nuxt Todo',
  'Service Worker',
  'WASM',
  '浏览器与网络',
  '测试',
  '性能',
  '认证',
  'Nuxt SSR',
  '完整后台实战',
  'DOM 与事件',
  '可访问性',
  '浏览器存储',
  '文件上传',
  'SSE / WebSocket',
  '协同编辑（Yjs）',
]

const trackPhaseMap = {
  JavaScript: '阶段 1：JavaScript / TypeScript 基础',
  TypeScript: '阶段 1：JavaScript / TypeScript 基础',
  'CSS、动画': '阶段 2：CSS / Sass / Tailwind 样式基础',
  Sass: '阶段 2：CSS / Sass / Tailwind 样式基础',
  TailwindCSS: '阶段 2：CSS / Sass / Tailwind 样式基础',
  组件拆分: '阶段 3：Vue 核心概念',
  单向数据流: '阶段 3：Vue 核心概念',
  Composables: '阶段 3：Vue 核心概念',
  生命周期: '阶段 3：Vue 核心概念',
  状态管理: '阶段 3：Vue 核心概念',
  表单: '阶段 3：Vue 核心概念',
  异步数据获取: '阶段 3：Vue 核心概念',
  错误处理与加载态: '阶段 3：Vue 核心概念',
  路由: '阶段 3：Vue 核心概念',
  'Reka UI': '阶段 4：组件生态（Reka UI / shadcn）',
  'shadcn/vue': '阶段 4：组件生态（Reka UI / shadcn）',
  'Nuxt Todo': '阶段 5：框架实战（Nuxt）',
  'Service Worker': '阶段 6：平台能力（Service Worker / WASM）',
  WASM: '阶段 6：平台能力（Service Worker / WASM）',
  '浏览器与网络': '阶段 7：浏览器与网络',
  测试: '阶段 8：测试与质量',
  性能: '阶段 9：性能与认证',
  认证: '阶段 9：性能与认证',
  'Nuxt SSR': '阶段 10：Nuxt SSR 与后台实战',
  '完整后台实战': '阶段 10：Nuxt SSR 与后台实战',
  'DOM 与事件': '阶段 11：DOM / A11y / 存储 / 上传',
  '可访问性': '阶段 11：DOM / A11y / 存储 / 上传',
  '浏览器存储': '阶段 11：DOM / A11y / 存储 / 上传',
  '文件上传': '阶段 11：DOM / A11y / 存储 / 上传',
  'SSE / WebSocket': '阶段 12：实时通信与协同',
  '协同编辑（Yjs）': '阶段 12：实时通信与协同',
}

const exercises = exerciseCatalog
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

const trackTotals = exercises.reduce((accumulator, exercise) => {
  accumulator[exercise.track] = (accumulator[exercise.track] ?? 0) + 1
  return accumulator
}, {})

async function run(currentCommand) {
  switch (currentCommand) {
    case 'learn':
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

function normalizeProgress(rawProgress) {
  return {
    current: Math.min(rawProgress.current ?? 0, exercises.length - 1),
    completed: Array.isArray(rawProgress.completed)
      ? rawProgress.completed.filter((index) => Number.isInteger(index) && index >= 0 && index < exercises.length)
      : [],
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

function printCurrentExercise() {
  const { progress, index, exercise } = getCurrentExercise()

  if (!exercise) {
    console.log('所有练习都完成了。可以开始自己加题了。')
    return
  }

  const positionInTrack = getTrackPosition(index, exercise.track)
  console.log(`\nvue-lings`)
  console.log(`当前进度: ${index + 1}/${exercises.length}`)
  console.log(`当前题目: ${exercise.title}`)
  console.log(`当前阶段: ${trackPhaseMap[exercise.track]}`)
  console.log(`所属主题: ${exercise.track} (${positionInTrack}/${trackTotals[exercise.track]})`)
  console.log(`目标文件: ${exercise.file}`)
  console.log(`核心目标: ${exercise.concept}`)
  console.log(``)
  console.log(`要做的事:`)
  for (const item of exercise.instructions) {
    console.log(`- ${item}`)
  }
  console.log(``)
  console.log(`完成后运行:`)
  console.log(`- pnpm check`)
  console.log(`- pnpm clue`)
  console.log(`- pnpm hint`)
  if (progress.completed.includes(index)) {
    console.log(`- 这一题已经通过，可以执行 pnpm next`)
  }
  console.log(``)
}

const trackHintMap = {
  JavaScript: {
    focus: '先把数据变换写成最小、纯净、可读的表达式。',
    apis: ['destructuring', 'filter', 'map', 'reduce', 'spread', 'Promise.all'],
    pitfalls: ['不要修改输入数据。', '先写返回值形状，再考虑实现细节。'],
  },
  TypeScript: {
    focus: '先想类型关系，再写函数体。',
    apis: ['Record', 'keyof', 'Pick', 'Partial', 'generic'],
    pitfalls: ['如果类型已经表达清楚，函数实现通常会更短。'],
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
}

function buildExerciseHints(exercise) {
  const base = trackHintMap[exercise.track] ?? {
    focus: '先回到题目的最小目标，把返回值或组件结构补完整。',
    apis: [],
    pitfalls: [],
  }

  const hints = [
    `先看目标文件里的 \`TODO:\`，\`pnpm check\` 会先卡这个。`,
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

  if (!exercise) {
    console.log('所有练习都完成了。现在没有当前题目的提示。')
    return
  }

  const exerciseHints = buildExerciseHints(exercise)

  console.log(`\nvue-lings clue`)
  console.log(`当前题目: ${exercise.title}`)
  console.log(`当前进度: ${index + 1}/${exercises.length}`)
  console.log(`目标文件: ${exercise.file}`)
  console.log(`所属主题: ${exercise.track}`)
  console.log(`进度文件: ${progressFile}`)
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
  console.log(`- pnpm clue`)
  console.log(`- pnpm hint`)
  console.log(``)
}

function printStatus() {
  const progress = loadProgress()
  let currentPhase = ''
  let currentTrack = ''

  console.log(`\nvue-lings status`)
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

const command = process.argv[2] ?? 'learn'

await run(command)

async function checkCurrentExercise() {
  const { progress, index, exercise } = getCurrentExercise()

  if (!exercise) {
    console.log('没有剩余练习需要检查。')
    return
  }

  const fullPath = path.join(rootDir, exercise.file)
  const text = fs.readFileSync(fullPath, 'utf8')
  const preIssues = text.includes('TODO:')
    ? ['还有 `TODO:` 没有完成。']
    : exercise.preChecks
      ? runRegexChecks(text, exercise.preChecks)
      : []
  const issues =
    preIssues.length > 0 ? preIssues : await exercise.validate(text, exercise)

  if (issues.length > 0) {
    console.log(`\n未通过: ${exercise.title}`)
    for (const issue of issues) {
      console.log(`- ${issue}`)
    }
    console.log(``)
    console.log(`继续修改 ${exercise.file}，然后再运行 pnpm check`)
    console.log(``)
    process.exitCode = 1
    return
  }

  if (!progress.completed.includes(index)) {
    progress.completed.push(index)
  }
  saveProgress(progress)

  console.log(`\n通过: ${exercise.title}`)
  console.log(`下一步:`)
  if (index < exercises.length - 1) {
    console.log(`- 运行 pnpm next 进入下一题`)
  } else {
    console.log(`- 你已经完成这一组练习了`)
  }
  console.log(``)
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
  console.log(`运行 pnpm learn 查看要求`)
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
