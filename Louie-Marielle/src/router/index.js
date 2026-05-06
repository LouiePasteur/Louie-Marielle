import { createRouter, createWebHistory } from 'vue-router'
import WeddingInvitationView from '@/views/WeddingInvitationView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import { hasValidAuthToken } from '@/utils/adminAuth'

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
    {
      path: '/admin',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { guestOnlyAdmin: true },
    },
    {
      path: '/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAdminAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = hasValidAuthToken()

  if (to.meta.requiresAdminAuth && !isAuthenticated) {
    return { path: '/admin' }
  }

  if (to.meta.guestOnlyAdmin && isAuthenticated) {
    return { path: '/dashboard' }
  }

  return true
})

export default router
