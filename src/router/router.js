import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:"/",
      redirect: '/login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/home.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/home-home.vue'),
        },
        {
          path: '/dashboard',
          component: () => import('@/views/dashboard.vue'),
        },
        {
          path: '/exec/task',
          component: () => import('@/views/exec-task.vue'),
        },
        {
          path: '/exec/template',
          component: () => import('@/views/exec-template.vue')
        },
        {
          path: '/exec/transfer',
          component: () => import('@/views/exec-transfer.vue')
        },
        {
          path: '/system/loginLog',
          component: () => import('@/views/system-loginLog.vue')
        },
        {
          path: '/system/account',
          component: () => import('@/views/system-account.vue')
        },
        {
          path: '/system/role',
          component: () => import('@/views/system-role.vue')
        },
        {
          path: '/system/set',
          component: () => import('@/views/system-set.vue')
        },
      ],
    },
  ],
})

export default router
