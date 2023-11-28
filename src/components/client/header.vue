<script setup>
import { useStore } from "vuex";
import { publicImageAvatar } from "@/constants/"
import { onBeforeMount, ref } from "vue";

import Swal from "sweetalert2";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

import productService from "@/services/product";

const store = useStore();
const route = useRoute();
const router = useRouter();

let timeOut;
let timer = 300;

const listSearch = ref({});
const searchTerm = ref();
const searchInput = ref(null);

const searchProduct = () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
        try {
            const result = await productService.productSearch(searchTerm.value);
            if (result.status == 200) {
                listSearch.value = result.data.products;
            }
        } catch (e) {
            console.log(e);
        }
    }, timer)
}

const arriveToShopPage = () => {
    router.push({ name: 'ShopPage', query: {search: searchTerm.value } })
}

const isDropdownVisible = ref(false);

const showDropdown = () => {
    isDropdownVisible.value = true;
}

const hideDropdown = () => {
    setTimeout(() => {
        isDropdownVisible.value = false;
    }, 100);
}

const move = (val) => {
    if (!store.state.user?.user) {
        Swal.fire({
            title: 'Bạn chưa đăng nhập vào ứng dụng',
            icon: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Đăng nhập',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                router.push({ name: 'Login' })
            }
        })
    } else {
        if (val == 0) {
            router.push({ name: 'Wishlist' })
        }
        if (val == 1) {
            router.push({ name: 'CartPage' })
        }
        if (val == 2) {
            router.push({ name: 'ManageAccount' })
        }
    }
}
    ;
</script>

<template>
    <header class="py-4 shadow-sm bg-white">
        <div class="container max-w-[80%] flex items-center justify-between">
            <!-- Logo -->
            <router-link to="/">
                <img src="../../assets/images/logo.svg" class="w-32">
            </router-link>

            <!-- searchbar -->
            <div class="w-full max-w-xl relative flex">
                <span class="absolute left-4 top-3 text-lg text-gray-400">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                </span>
                <input type="text" @keypress.enter="arriveToShopPage()" @focus="showDropdown" @blur="hideDropdown"
                    v-model="searchTerm" @input="searchProduct"
                    class="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
                    placeholder="Search here...">
                <div v-if="isDropdownVisible && listSearch" class="absolute mt-2 w-full top-10 rounded-b-md
                     shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <!-- Dropdown content goes here -->
                    <ul v-if="!searchTerm" class="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <span @click="arriveToShopPage()"
                                class="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                SẢN PHẨM MỚI
                            </span>
                        </li>
                    </ul>
                    <ul v-else-if="listSearch.length > 0" class="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li v-for="product in listSearch" :key="product">
                            <router-link :to="{
                                name: 'DetailProduct',
                                params: { id: product._id }
                            }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                {{ product.name }}
                            </router-link>
                        </li>
                    </ul>
                    <ul v-else class="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Không tìm thấy sản phẩm tượng tự
                            </span>
                        </li>
                    </ul>
                </div>
                <button @click="arriveToShopPage()"
                    class="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition">
                    Search
                </button>
            </div>

            <!-- icons -->
            <div class="flex items-center space-x-4">
                <div @click="move(0)"
                    class="text-center cursor-pointer text-gray-700 hover:text-primary transition relative">
                    <div class="text-2xl">
                        <font-awesome-icon :icon="['far', 'heart']" />
                    </div>
                    <div class="text-xs leading-3">Wish List</div>
                    <span
                        class="absolute right-0 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                        {{ store.state.wishlist?.wishlist ? store.state.wishlist.wishlist?.items.length : '0' }}
                    </span>
                </div>

                <div @click="move(1)"
                    class="text-center cursor-pointer text-gray-700 hover:text-primary transition relative">
                    <div class="text-2xl">
                        <font-awesome-icon :icon="['fas', 'bag-shopping']" />
                    </div>
                    <div class="text-xs leading-3">Cart</div>
                    <span class="absolute -right-3 -top-1 w-5 h-5 rounded-full 
                    flex items-center justify-center bg-primary text-white text-xs">
                        {{ store.state.cart?.cart ? store.state.cart.cart?.products.length : '0' }}
                    </span>
                </div>

                <div @click="move(2)" v-if="!store.state.user?.user"
                    class="text-center cursor-pointer text-gray-700 hover:text-primary transition relative">
                    <div class="text-2xl">
                        <font-awesome-icon :icon="['fas', 'user']" />
                    </div>
                    <div class="text-xs leading-3">Account</div>
                </div>
                <div @click="move(2)" v-else
                    class="flex flex-col justify-center items-center cursor-pointer group transition">
                    <img v-if="store.state.user?.user.typeLogin == 'google'" :src="store.state.user?.user.avatar"
                        referrerpolicy="no-referrer" class="h-8 w-8 rounded-full">
                    <div v-else>
                        <img v-if="store.state.user?.user?.avatar"
                            :src="publicImageAvatar + store.state.user?.user.avatar" class="h-8 w-8 rounded-full">
                        <img v-else src="../../assets/images/noavatar.png" class="h-8 w-8 rounded-full">
                    </div>
                    <div class="text-xs leading-3 text-gray-700 group-hover:text-primary">Account</div>
                </div>
            </div>
        </div>
    </header>
</template>