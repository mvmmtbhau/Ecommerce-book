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
            path: '/',
            name: 'HomePage',
            meta: {
                layout: 'user',
            },
            component: () => import(/* webpackChunkName: "register" */'@/views/user/HomePage.vue'),
        },
        {
            path: '/shop',
            name: 'ShopPage',
            meta: {
                layout: 'user',
            },
            component: () => import(/* webpackChunkName: "register" */'@/views/user/ShopPage.vue'),
        },
    ]
})

export default router;
