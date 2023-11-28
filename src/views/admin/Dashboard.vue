<script setup>

import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { jwtDecode } from "jwt-decode";
import { useStore } from "vuex";

import cartService from "@/services/cart";

const route = useRoute();
const router = useRouter();
const store = useStore();

onBeforeMount(() => {
    if (route.query?.valid) {
        const token = route.query.valid;
        localStorage.setItem("token-hau", token);

        const decoded = jwtDecode(token);

        store.dispatch('user/setUser', decoded);
        router.replace('/admin/dashboard');
    }
});

</script>

<template>
    <div>
        <h1 class="text-3xl text-gray-700 font-bold">Welcome to Dashboard</h1>
    </div>
</template>