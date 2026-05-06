import { createRouter, createWebHistory } from 'vue-router'
import WeddingInvitationView from '@/views/WeddingInvitationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/guest',
    },
    {
      path: '/guest',
      name: 'guest',
      component: WeddingInvitationView,
    },
    {
      path: '/wedding-party',
      name: 'wedding-party',
      component: WeddingInvitationView,
    },
  ],
})

export default router
