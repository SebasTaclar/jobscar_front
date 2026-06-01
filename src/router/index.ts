import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/api'
import Home from '@/views/Home.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiredRole?: string
    requiredRoles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/servicios',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
    },
    {
      path: '/workshop/admin',
      redirect: '/workshop/admin/clients',
    },
    {
      path: '/workshop/admin/clients',
      name: 'workshop-admin-clients',
      component: () => import('../views/WorkshopAdminDashboard.vue'),
    },
    {
      path: '/workshop/admin/services',
      name: 'workshop-admin-services',
      component: () => import('../views/WorkshopAdminServices.vue'),
    },
    {
      path: '/workshop/admin/vehicles',
      name: 'workshop-admin-vehicles',
      component: () => import('../views/WorkshopAdminVehicles.vue'),
    },
    {
      path: '/workshop/admin/reports',
      name: 'workshop-admin-reports',
      component: () => import('../views/WorkshopAdminReports.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresGuest: true, // Solo accesible cuando no está autenticado
      },
    },

    {
      path: '/accesorios',
      name: 'accesorios',
      component: () => import('../views/AccesoriosPage.vue'),
    },

    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/AdminDashboardNew.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'admin',
      },
    },

    {
      path: '/admin/workshop/clients',
      name: 'admin-workshop-clients',
      component: () => import('../views/WorkshopClients.vue'),
    },

    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('../views/PaymentSuccess.vue'),
    },
    {
      path: '/payment/failure',
      name: 'payment-failure',
      component: () => import('../views/PaymentFailure.vue'),
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/Checkout.vue'),
    },
    {
      path: '/terms-and-conditions',
      name: 'TermsAndConditions',
      component: () => import('../views/TermsAndConditions.vue'),
    },
    {
      path: '/test-sync',
      name: 'test-sync',
      component: () => import('../views/TestSync.vue'),
    },
    {
      path: '/test-purchases',
      name: 'test-purchases',
      component: () => import('../views/TestPurchases.vue'),
    },
    {
      path: '/payment/pending',
      name: 'payment-pending',
      component: () => import('../views/PaymentPending.vue'),
    },
    // Catch-all route - debe ir al final
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return authService.isAdmin() ? '/admin/products' : '/'
  }

  const requiredRoles = to.meta.requiredRoles || (to.meta.requiredRole ? [to.meta.requiredRole] : [])
  if (requiredRoles.length > 0) {
    const userRole = authService.getUserRole()
    if (!userRole || !requiredRoles.includes(userRole)) {
      return '/'
    }
  }

  return true
})


export default router
