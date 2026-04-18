# Vue 3 Component Lab

这是一个专门给“后端 / Cloud Native 背景，转学前端”的 Vue 3 + Vite 训练目录。  
重点不放在你已经相对熟悉的工程化常识，而是集中补三块最容易卡住人的前端能力：

- 组件拆分
- 生命周期
- CSS 布局与状态样式

现在又往前补了一层：

- Vue Router
- Pinia
- 一个很小的异步状态示例

## 运行方式

```bash
cd /Users/macintoshhd/front-study/vue3-component-lab
pnpm install
pnpm dev
```

构建验证：

```bash
pnpm build
```

## Rustlings 式练法

如果你更喜欢像 `rustlings` 那样一题一题做，现在可以直接用这组命令：

```bash
pnpm learn
pnpm check
pnpm clue
pnpm hint
pnpm next
pnpm learn:status
pnpm learn:reset
```

如果你只想做“最有价值的 30 题”，可以直接切到 `lite` 模式：

```bash
pnpm lite:learn
pnpm lite:check
pnpm lite:clue
pnpm lite:hint
pnpm lite:next
pnpm lite:status
pnpm lite:reset
```

工作流就是：

1. 运行 `pnpm learn` 看当前题目
2. 打开它指定的练习文件
3. 把里面的 `TODO` 做完
4. 运行 `pnpm check`
5. 卡住时运行 `pnpm clue` 或 `pnpm hint`
6. 通过后执行 `pnpm next`

现在题库已经扩成 102 题；同时还提供了一条 `lite` 路线，只保留最值得先做的 30 题。

- 组件拆分
- 单向数据流
- 状态管理
- 生命周期
- 路由
- 表单
- 异步数据获取
- 错误处理与加载态
- CSS、动画
- WASM
- Service Worker
- 浏览器与网络
- 测试
- 性能
- 认证
- Nuxt SSR
- 完整后台实战
- Composables
- DOM 与事件
- 可访问性
- 浏览器存储
- 文件上传
- SSE / WebSocket
- 协同编辑（Yjs）

你不需要自己决定先学什么，直接跑：

```bash
pnpm learn
```

然后按当前题目做，做完就：

```bash
pnpm check
pnpm clue
pnpm hint
pnpm next
```

说明：

- `pnpm clue` 和 `pnpm hint` 都会根据当前题目输出切入点、常用 API、容易卡住的地方
- 学习进度现在会写到 `~/.vue/vue-lings-progress.json`，不再依赖项目目录里的本地状态文件

`pnpm learn:status` 会按主题显示整条练习链。

## 推荐挑战顺序

现在题链已经按“从简单到复杂、从单个概念到组件集成”重排成 6 个阶段：

1. `JavaScript / TypeScript` 基础
2. `CSS / Sass / Tailwind` 样式基础
3. Vue 核心概念
4. 组件生态：`Reka UI` -> `shadcn/vue`
5. 框架实战：`Nuxt Todo`
6. 平台能力：`Service Worker` -> `WASM`
7. 浏览器与网络
8. 测试与质量
9. 性能与认证
10. Nuxt SSR 与后台实战
11. DOM / A11y / 存储 / 上传
12. 实时通信与协同

也就是说，默认第一题现在是：

- `JavaScript 1/7：对象解构`

如果你想严格按这条新顺序从头开始，可以运行：

```bash
pnpm learn:reset
pnpm learn
```

## 新增样式专项

因为你自己也说了 CSS 和样式体系比较薄弱，这一轮额外补了几组：

- Sass
- TailwindCSS
- Nuxt Todo
- shadcn/vue
- Reka UI
- JavaScript
- TypeScript

现在 `pnpm learn:status` 里会继续往后看到这些题。

这一轮还额外加强了两块：

- `Reka UI` 和 `shadcn/vue` 都扩成了常用组件链
  现在能在题库里找到如 `Select`、`Dialog`、`Tabs`、`Tooltip`、`Dropdown Menu`、`Accordion`、`Sheet`、`Checkbox` 这些高频组件
- `CSS` 题增加了更多“修样式”题
  包括修布局、修表单对齐、修移动端断点、修 hover 动效、修 modal 层级这类更贴近真实工作的题型
- 额外补上了更贴近日常业务开发的高频能力
  包括 `Composables`、`DOM 与事件`、`可访问性`、`浏览器存储`、`文件上传`
- 继续补上了 AI 和协同场景常见的实时通信能力
  包括 `SSE`、`WebSocket`、`Yjs` 协同 Todo

## Full Stack 第二阶段

为了更贴近“后端转 full stack”的真实成长路径，这一轮又补了第二阶段路线：

- 浏览器与网络
- 测试
- 性能
- 认证
- Nuxt SSR
- 完整后台实战

这部分从第 49 题开始，建议你在第一阶段大体跑顺后再进入。

你可以先看总览：

```bash
pnpm learn:status
```

也可以继续用同样的方式推进：

```bash
pnpm learn
pnpm check
pnpm next
```

## UI Test 检查样式

为了让样式题不只是“看代码感觉差不多”，我补了一条 Playwright UI test 链路。

样式预览页：

- `/style-preview`
- 文件在 `src/views/StyleExercisePreviewView.vue`

Reka UI 预览页：

- `/reka-preview`
- 文件在 `src/views/RekaPreviewView.vue`

实时通信练习页：

- `/realtime`
- 文件在 `src/views/RealtimeTransportView.vue`

协同 Todo 页面：

- `/collab-todos`
- 文件在 `src/views/CollaborativeTodoView.vue`

本地运行 UI test：

```bash
pnpm ui:test
```

运行 Vitest 单元测试：

```bash
pnpm test:unit
```

Docker 里跑 headless 浏览器：

```bash
pnpm ui:test:docker
```

这些 UI test 主要检查：

- CSS grid 和 active 卡片是否真的生效
- Sass 面板样式是否真的编译出来
- Tailwind utility classes 是否真的作用到组件上

注意：

- 如果对应练习题还没做完，UI test 失败是正常的
- 这套测试本来就是拿来帮你验证“样式到底有没有真的对”

## 目录说明

- `src/App.vue`
  整个训练场入口，左侧是路由导航和全局学习进度，右侧是 `RouterView`。
- `src/router/index.ts`
  路由入口，展示前端应用如何从“单页面组件切换”升级成“真正的多页面结构”。
- `src/stores/studyLab.ts`
  一个很小但完整的 Pinia store，练 `state / getter / action`。
- `src/data/modules.ts`
  把模块信息抽成共享数据，避免导航、store、页面介绍重复定义。
- `src/components/ComponentPlayground.vue`
  练父子组件职责边界、`props`、`emits`、列表渲染。
- `src/components/LifecyclePlayground.vue`
  练 `mounted / updated / unmounted` 的触发顺序。
- `src/components/LifecycleChild.vue`
  用最小子组件观察生命周期和 `watch`。
- `src/components/CssPlayground.vue`
  练布局切换、状态样式、层级与留白。
- `src/components/AsyncStateLab.vue`
  练 `idle / loading / error / success` 四态 UI。
- `src/views/RouterPlaygroundView.vue`
  练 `params`、`query` 和程序化跳转。
- `src/views/PiniaPlaygroundView.vue`
  练共享状态、getter、action 以及跨页面同步。
- `src/views/RealtimeTransportView.vue`
  对照看 `SSE` 和 `WebSocket` 两种实时通信在 AI 应用里的典型用法。
- `src/views/CollaborativeTodoView.vue`
  一个真实的 `WebSocket + Yjs` 协同 Todo 小应用，可以开多窗口一起操作。
- `src/components/SectionShell.vue`
  一个简单的壳组件，用来观察 `slot` 带来的复用方式。

## 实时通信命令

如果你要直接看实时通信和协同编辑，可以用这几条命令：

```bash
pnpm realtime:server
pnpm collab:server
```

如果你想一次拉起完整环境：

```bash
pnpm dev:realtime
```

它会同时启动：

- Vite 前端
- SSE / WebSocket 示例服务
- Yjs 协同服务

## 按 1 2 3 4 开始

如果你现在打开项目会有点不知道先点哪里，那就只按这 4 步走：

### 1. 先练组件拆分

目标：

- 建立父组件、子组件、`props`、`emit` 的边界感

先看：

- `src/components/ComponentPlayground.vue`
- `src/components/UserBadge.vue`

先问自己：

- 数据为什么放在父组件？
- 子组件为什么不自己改数据？
- 事件为什么要向上抛？

### 2. 再看生命周期

目标：

- 建立组件挂载、更新、卸载的顺序直觉

先看：

- `src/components/LifecyclePlayground.vue`
- `src/components/LifecycleChild.vue`

先做：

- 点“修改 props”
- 点“卸载子组件”
- 再点“重新挂载子组件”

### 3. 集中补 CSS

目标：

- 补布局、留白、状态样式，不再怕改 UI

先看：

- `src/components/CssPlayground.vue`
- `src/style.css`

先做：

- 切换 `grid` / `stack`
- 调 `hover` / `active`
- 自己加一个媒体查询断点

### 4. 最后做应用化

目标：

- 把单组件能力扩展到页面级和应用级

顺序：

- 先看 `src/components/AsyncStateLab.vue`
- 再看 `src/views/RouterPlaygroundView.vue`
- 最后看 `src/views/PiniaPlaygroundView.vue`

配套文件：

- `src/router/index.ts`
- `src/stores/studyLab.ts`

一句话理解：

- `async` 是页面状态
- `router` 是地址栏状态
- `pinia` 是共享业务状态

## 适合你这个背景的学习方法

如果你以前主要是 Java 后端和 Cloud Native 架构，前端最值得切换的思维是：

- 后端更常处理“请求流”，前端更常处理“事件流”
- 后端强调“服务边界”，前端要多想“状态边界”
- 后端很多复杂度在服务编排，前端很多复杂度在 UI 状态和渲染细节

所以学前端时，不要只盯语法，重点问自己：

- 为什么这个状态放在这里？
- 为什么这个组件要拆？
- 为什么这个 class 放在容器上，而不是子元素上？
- 为什么这个 UI 需要 loading 和 error，而不是只写成功态？

## 下一步怎么扩展

等这套练顺了，你可以继续往这个目录里加：

- `router/`：补 Vue Router
- `stores/`：补 Pinia
- `composables/`：补可复用逻辑封装
- `pages/`：从组件训练升级成小型页面

如果你愿意，我下一轮可以继续直接在这个目录里帮你加：

1. `composables/` 练习，把可复用逻辑从组件里抽出去
2. 一个“管理后台页面”的完整练习题
3. 表单、校验、列表筛选、分页这些更贴近业务开发的练习
