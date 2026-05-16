import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      name: 'bio6',
      path: '/bio6',
      redirect: '/bio6/index',
      component: () => import('../views/bio6/bio6-base.vue'),
      children: [
        {
          name: 'bio6-index',
          path: '/bio6/index',
          component: () => import('../views/bio6/bio6-index.vue')
        },
        {
          name: 'bio6-overview',
          path: '/bio6/block/:blockId',
          component: () => import('../views/bio6/bio6-overview.vue'),
          props: true
        },
        {
          name: 'bio6-node',
          path: '/bio6/node/:nodeId',
          component: () => import('../views/bio6/bio6-node.vue'),
          props: true
        }
      ]
    },
    {
      path: '/',
      redirect: '/bio6/index'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/bio6/index'
    }
  ]
})

export default router
