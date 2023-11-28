<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();

const logout = () => {
    localStorage.removeItem("token-hau");
    store.dispatch('user/setUser', null);
    router.push({
        name: 'Login'
    })
}

;
</script>

<template>
    <div class="fixed left-0 top-0 w-72 h-full bg-gray-800 shadow-md z-10">
        <div class="text-white font-bold text-base uppercase text-center py-5 bg-gray-900">Admin</div>
        <div class="py-5">
            <router-link to="/admin/dashboard" :class="[route.name == 'AdminDashboard' ? 'bg-gray-900 border-blue-600' : 'border-transparent']" class="flex items-center border-l-4  hover:border-blue-600 hover:bg-gray-900 my-1 px-4 py-3 text-white">
                <font-awesome-icon :icon="['fas', 'house']" class="w-5 mr-3"/>
                <p>Dashboard</p>
            </router-link>

            <router-link to="/admin/category" :class="[route.name == 'AdminCategory' ? 'bg-gray-900 border-blue-600' : 'border-transparent']" class="flex items-center my-1 px-4 py-3 text-white border-l-4  hover:border-blue-600 hover:bg-gray-900 transition">
                <font-awesome-icon :icon="['fas', 'grip']" class="w-5 mr-3"/>
                <p>Category</p>
            </router-link>

            <router-link to="/admin/product" :class="[route.name == 'AdminProduct' ? 'bg-gray-900 border-blue-600' : 'border-transparent']" class="flex items-center my-1 px-4 py-3 text-white border-l-4 hover:border-blue-600 hover:bg-gray-900 transition">
                <font-awesome-icon :icon="['fas', 'box-open']" class="w-5 mr-3"/>
                <p>Product</p>
            </router-link>
            <router-link :to="{name: 'AdminListOrder'}" :class="[route.name == 'AdminListOrder' ? 'bg-gray-900 border-blue-600' : 'border-transparent']" class="flex items-center my-1 px-4 py-3 text-white border-l-4 hover:border-blue-600 hover:bg-gray-900 transition">
                <font-awesome-icon :icon="['fas', 'cart-flatbed']" class="w-5 mr-3"/>
                <p>List Orders</p>
            </router-link>
        </div>
        <div @click="logout" class="absolute bottom-9 w-full cursor-pointer flex items-center my-1 px-4 py-3 text-white border-l-4 border-transparent hover:border-blue-600 hover:bg-gray-900 transition">
            <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="w-5 mr-3"/>
                <p>Logout</p>
            </div>
    </div>
</template>