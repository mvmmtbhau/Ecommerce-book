import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/admin/test',
            name: 'Admin',
            meta: {
                layout: 'admin',
            },
            component: () => import(/* webpackChunkName: "register" */'@/views/admin/test.vue'),
        },
        {
            path: '/user/test',
            name: 'User',
            meta: {
              layout: 'user',
            },
            component: () => import(/* webpackChunkName: "register" */'@/views/user/test.vue'),
          },
    ]
})

export default router;
