<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const logout = () => {
    localStorage.removeItem("token-hau");
    store.dispatch('user/setUser', null);
    router.push({
        name: 'Login'
    })
}

const dropdown = () => {
    document.getElementById("dropdown_content").classList.toggle("hidden");
};
</script>

<template>
    <nav class="h-16 bg-white shadow-sm pl-80 pr-8 fixed top-0 left-0 w-full flex items-center">
        <div class="relative">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="absolute left-2 top-3 w-6 text-gray-400" />
            <input type="text" class="block w-72 shadow border-none rounded-3xl focus:outline-none py-2 
            bg-gray-100 text-base text-gray-600 pl-11 pr-2">
        </div>

        <div class="ml-auto flex items-center">
            <div>
                <font-awesome-icon :icon="['far', 'bell']" class="w-6 cursor-pointer text-gray-600 hover:text-gray-900" />
            </div>
            <div class="ml-4 relative">
                <div class="">
                    <img src="../../assets/images/avatar.png" class="h-8 w-8 rounded-full object-cover">
                </div>
            </div>
        </div>
    </nav>

</template>