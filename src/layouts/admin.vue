<script setup>
import NavbarComponent from "@/components/admin/navbar.vue";
import SidebarComponent from "@/components/admin/sidebar.vue";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter()

onBeforeMount(() => {
    if(!store.state.user?.user) router.push({name: 'Login'});
    
    if(store.state.user?.user && store.state.user.user?.role == "user") {
        alert('Không phải tài khoản admin');
        router.push({name: 'HomePage'})
    }
})

;
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <NavbarComponent />
        <SidebarComponent />
        <div class="pt-24 pr-8 pl-80">
            <slot />
        </div>
    </div>
</template>