import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/page1',
    component: () => import('@/Frame'),
    children: [
      {
        path: 'page1',
        component: () => import('@/pages/page1')
      },
      {
        path: 'page2',
        component: () => import('@/pages/page2')
      }
    ]
  },
  {
    path: '/menu2',
    component: () => import('@/Frame'),
    children: [
      {
        path: 'page2-1',
        component: () => import('@/pages/menu2/page2-1')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/login'),
    meta: {
      open: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta && !r.meta.open)) {
      if (store.getters.userInfo.token) {
          next()
      } else {
          store.commit('logout')
          next('/login')
      }
      return
  }
  next();
});

export default router
