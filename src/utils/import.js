import { defineAsyncComponent } from "vue";

export function registerGlobalComponent(app) {
    app.component(
        'user-layout',
        defineAsyncComponent(() => import('@/layouts/user.vue')
        ));

    app.component(
        'admin-layout',
        defineAsyncComponent(() => import('@/layouts/admin.vue')
        ));
}