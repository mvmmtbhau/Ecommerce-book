<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import categoryService from "@/services/category";
import { onBeforeMount, ref } from "vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const categories = ref();

const fetchCategories = async () => {
    try {
        const result = await categoryService.getCategories();
        if(result.status == 200) categories.value = result.data.data;
    } catch (err) {
        console.log(err);
    }
}

const goToShopPage = (cateId) => {
    const currentQuery = { ...route.query, category: cateId };

    router.push({ name: 'ShopPage', query: currentQuery })
}

const logout = () => {
    try {
        localStorage.removeItem("token-hau");
        store.dispatch('user/setUser', null);
        store.dispatch('cart/setCart', null);
        store.dispatch('wishlist/setWishlist', null);
        if(route.matched && route.matched.length > 0 && route.matched[0].name == 'Account') {
            location.href = '/'
        } else {
            router.go(0)
        }
    } catch (err) {
        console.log(err);
    }
} 

onBeforeMount(async () => {
    await fetchCategories();
})
;
</script>

<template>
    <nav class="bg-gray-800">
        <div class="container max-w-[80%] flex">
            <!-- all category -->
            <div class="px-8 py-4 bg-primary flex items-center cursor-pointer relative group">
                <span class="text-white">
                    <font-awesome-icon :icon="['fas', 'bars']" />
                </span>
                <span class="capitalize ml-2 text-white">Danh mục</span>

                <div class="absolute z-50 w-80 left-0 top-full bg-white shadow-md divide-y divide-gray-300 divide-dashed 
                opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
                    <span v-for="(category, index) in categories" :key="index" @click="goToShopPage(category._id)"
                    class="flex items-center px-6 py-3 hover:bg-gray-100  transition cursor-pointer">
                        <span class="ml-6 text-gray-600 text-sm">{{ category.title }}</span>
                    </span>
                </div>
            </div>

            <!-- navbar links -->
            <div class="flex items-center justify-between flex-grow pl-12">
                <div class="flex items-center space-x-6 capitalize">
                    <router-link to="/" :class="[route.name == 'HomePage' ? 'text-[#5856d6] font-bold' : 'text-gray-200']" class=" hover:text-primary transition">Trang chủ</router-link>
                    <router-link to="/shop" :class="[route.name == 'ShopPage' ? 'text-[#5856d6] font-bold' : 'text-gray-200']" class=" hover:text-primary transition">Sản phẩm</router-link>
                </div>
                <router-link v-if="!$store.state.user.user" to="/login" class="text-gray-200 hover:text-white transition">Đăng nhập/Đăng ký</router-link>
                <span v-else @click="logout()" class="text-gray-200 hover:text-white transition cursor-pointer">Đăng xuất</span>
            </div>
        </div>
    </nav>
</template>