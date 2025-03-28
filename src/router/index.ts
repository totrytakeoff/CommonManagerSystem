import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/views/Main.vue'),
      // 重定向到home
      redirect: '/home',

      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/Home.vue'),
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/User.vue'),
        },
      ],
    },
  ],
})

export default router
