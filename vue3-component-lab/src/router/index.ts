import { createRouter, createWebHistory } from 'vue-router'
import AsyncStateLab from '../components/AsyncStateLab.vue'
import ComponentPlayground from '../components/ComponentPlayground.vue'
import CssPlayground from '../components/CssPlayground.vue'
import LifecyclePlayground from '../components/LifecyclePlayground.vue'
import type { ModuleId } from '../data/modules'
import CollaborativeTodoView from '../views/CollaborativeTodoView.vue'
import PiniaPlaygroundView from '../views/PiniaPlaygroundView.vue'
import RekaPreviewView from '../views/RekaPreviewView.vue'
import RealtimeTransportView from '../views/RealtimeTransportView.vue'
import RouterPlaygroundView from '../views/RouterPlaygroundView.vue'
import StartHereView from '../views/StartHereView.vue'
import StyleExercisePreviewView from '../views/StyleExercisePreviewView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    moduleId?: ModuleId
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/start',
    },
    {
      path: '/start',
      component: StartHereView,
    },
    {
      path: '/components',
      component: ComponentPlayground,
      meta: { moduleId: 'components' },
    },
    {
      path: '/lifecycle',
      component: LifecyclePlayground,
      meta: { moduleId: 'lifecycle' },
    },
    {
      path: '/css',
      component: CssPlayground,
      meta: { moduleId: 'css' },
    },
    {
      path: '/async',
      component: AsyncStateLab,
      meta: { moduleId: 'async' },
    },
    {
      path: '/router/:topic?',
      name: 'router-lab',
      component: RouterPlaygroundView,
      meta: { moduleId: 'router' },
    },
    {
      path: '/store',
      component: PiniaPlaygroundView,
      meta: { moduleId: 'store' },
    },
    {
      path: '/realtime',
      component: RealtimeTransportView,
      meta: { moduleId: 'realtime' },
    },
    {
      path: '/collab-todos',
      component: CollaborativeTodoView,
      meta: { moduleId: 'collaboration' },
    },
    {
      path: '/style-preview',
      component: StyleExercisePreviewView,
    },
    {
      path: '/reka-preview',
      component: RekaPreviewView,
    },
  ],
})
