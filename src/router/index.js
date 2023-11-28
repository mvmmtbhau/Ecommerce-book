import { createRouter, createWebHistory } from 'vue-router';

import HomePage from "@/views/user/HomePage.vue";
import ShopPage from "@/views/user/ShopPage.vue";
import DetailPage from "@/views/user/DetailPage.vue";
import Register from "@/views/user/Register.vue";
import Login from "@/views/user/Login.vue";
import Account from "@/views/user/Account.vue";
import ManageAccount from "@/views/user/ManageAccount.vue";
import Wishlist from "@/views/user/Wishlist.vue";
import Order from "@/views/user/Order.vue";
import CartPage from "@/views/user/CartPage.vue";
import ChangePassword from "@/views/user/ChangePassword.vue";

import Dashboard from "@/views/admin/Dashboard.vue";
import Category from "@/views/admin/Category.vue";
import Product from "@/views/admin/Product.vue";
import ListOrder from "@/views/admin/ListOrder.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            meta: {
                layout: 'login',
            },
            component: Login,
        },
        {
            path: '/register',
            name: 'Register',
            meta: {
                layout: 'login',
            },
            component: Register,
        },
        {
            path: '/admin/dashboard',
            name: 'AdminDashboard',
            meta: {
                layout: 'admin',
            },
            component: Dashboard,
        },
        {
            path: '/admin/listOrder',
            name: 'AdminListOrder',
            meta: {
                layout: 'admin',
            },
            component: ListOrder,
        },
        {
            path: '/admin/category',
            name: 'AdminCategory',
            meta: {
                layout: 'admin',
            },
            component: Category,
        },
        {
            path: '/admin/product',
            name: 'AdminProduct',
            meta: {
                layout: 'admin',
            },
            component: Product,
        },
        {
            path: '/',
            name: 'HomePage',
            meta: {
                layout: 'user',
            },
            component: HomePage,
        },
        {
            path: '/shop',
            name: 'ShopPage',
            meta: {
                layout: 'user',
            },
            component: ShopPage,
        },
        {
            path: '/cart',
            name: 'CartPage',
            meta: {
                layout: 'user',
            },
            component: CartPage,
        },
        {
            path: '/detail/:id',
            name: 'DetailProduct',
            meta: {
                layout: 'user',
            },
            component: DetailPage,
        },
        {
            path: '/account',
            name: 'Account',
            meta: {
                layout: 'user',
            },
            component: Account,
            children: [
                {
                    path: 'me',
                    name: 'ManageAccount',
                    component: ManageAccount,
                },
                {
                    path: 'wishlist',
                    name: 'Wishlist',
                    component: Wishlist,
                },
                {
                    path: 'orders',
                    name: 'Orders',
                    component: Order,
                },
                {
                    path: 'changePassword',
                    name: 'ChangePassword',
                    component: ChangePassword,
                },
            ]
        },
    ]
})

export default router;
