import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      component: () => import('@/pages/index')
    },
    {
      path: '/shop/:id',
      component: () => import('@/pages/shop')
    },
    {
      path: '/prodetail/:id',
      component: () => import('@/pages/prodetail')
    },
    {
      path: '/map/:lat/:lon',
      component: () => import('@/pages/map')
    },
    {
      path: '/ordersubmit/:id/:num/:phone',
      component: () => import('@/pages/ordersubmit')
    },
    {
      path: '/my',
      component: () => import('@/pages/my')
    },
    {
      path: '/orderlist/:type',
      component: () => import('@/pages/orderlist')
    },
    {
      path: '/orderdetail/:id',
      component: () => import('@/pages/orderdetail')
    },
    {
      path: '/paysuccess/:id',
      component: () => import('@/pages/paysuccess')
    },

    {
      path: '/offlogin',
      component: () => import('@/pages/offlogin')
    },
    {
      path: '/off/:id',
      component: () => import('@/pages/off')
    },


    {
      path: '/myitem',
      component: () => import('@/pages/myitem')
    },
    {
      path: '/myedit',
      component: () => import('@/pages/myedit')
    },
    {
      path: '/',
      redirect: '/index'
    }
  ]
})
