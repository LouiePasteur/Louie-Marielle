import { createRouter, createWebHistory } from 'vue-router'
import WeddingInvitationView from '@/views/WeddingInvitationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WeddingInvitationView,
    },
    {
      path: '/guest',
      redirect: '/',
    },
    {
      path: '/wedding-party',
      redirect: '/',
    },
  ],
})

export default router
