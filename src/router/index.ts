import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/login.vue'
import Register from '@/pages/register.vue'
import Dashboard from '@/pages/todo-list-dashboard.vue'
import SignUp from '@/pages/signUp.vue'


  const routes = [
  { path: '/', redirect: '/login' },  // <--- this is what sends / to login
  { path: '/login', component: Login },
  { path: '/signUp', component: SignUp },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard for dashboard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
