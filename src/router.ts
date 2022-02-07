import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const pageRoutes: RouteRecordRaw[] = [
  {
    name: "index",
    path: "/",
    component: () => import('./pages/posts/posts.vue')
  },
  {
    name: "post",
    path: "/post/:id",
    component: () => import('./pages/posts/posts.vue')
  },
  {
    name: "signin",
    path: "/signin",
    component: () => import('./pages/signin/signin.vue')
  },
  {
    name: "nodes",
    path: "/nodes",
    component: () => import('./pages/nodes/nodes.vue')
  },
  {
    name: "peering",
    path: "/nodes/:uuid",
    component: () => import('./pages/nodes/peering.vue')
  },
  {
    name: "manage",
    path: "/manage",
    component: () => import('./pages/manage/manage.vue')
  },
]

const routerHistory = createWebHistory()

export default createRouter({
  history: routerHistory,
  routes: pageRoutes,
})
