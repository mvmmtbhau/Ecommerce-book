<script setup>
import Swal from "sweetalert2";
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import {publicImageAvatar} from "@/constants"

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = (event = 0) => {
    new Swal({
        text: 'Đợi một chút...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'info',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false,
    })
    if (event == 0) {
        Swal.showLoading();
    } else {
        Swal.close();
    }
}

const logout = () => {
    try {
        router.push('/').then(() => {
            localStorage.removeItem("token-hau");
            store.dispatch('user/setUser', null);
            store.dispatch('cart/setCart', null);
            store.dispatch('wishlist/setWishlist', null);
        })
    } catch (err) {
        console.log(err);
    }
}

onBeforeMount(() => {
    if (!store.state.user.user) {
        Swal.fire({
            text: 'Bạn chưa đăng nhập, vui lòng đăng nhập vào tài khoản của bạn.',
            icon: "warning",
        }).then(function () {
            window.location = '/login'
        });
    }
})

    ;
</script>

<template>
    <div class="container max-w-[80%]">
        <!-- breadcrums -->
        <div class="py-4 flex items-center gap-3">
            <a href="#" class="text-primary text-base">
                <font-awesome-icon :icon="['fas', 'house']" />
            </a>
            <span class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <p class="text-gray-600 font-medium">My Account</p>
        </div>

        <!-- Account wrapper -->
        <div class="grid grid-cols-12 items-start gap-6 pt-6 pb-16">
            <!-- sidebar -->
            <div class="col-span-3">
                <!-- account profile -->
                <div class="px-4 py-3 shadow flex items-center gap-4">
                    <div class="flex-shrink-0">
                        <img v-if="store.state.user?.user.typeLogin == 'google'" :src="store.state.user?.user.avatar"
                            referrerpolicy="no-referrer" class="h-8 w-8 rounded-full">
                        <div v-else>
                            <img v-if="store.state.user?.user?.avatar"
                                :src="publicImageAvatar + store.state.user?.user?.avatar" class="h-8 w-8 rounded-full">
                            <img v-else src="../../assets/images/noavatar.png" class="h-8 w-8 rounded-full">
                        </div>
                    </div>
                    <div class="flex-grow">
                        <p class="text-gray-600">Hello,</p>
                        <h4 class="text-gray-800 font-medium">{{ store.state.user?.user?.fullName }}</h4>
                    </div>
                </div>

                <!-- profile links -->
                <div class="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
                    <!-- single link -->
                    <div class="space-y-1 pl-8">
                        <a href="#"
                            class="relative text-primary block font-medium capitalize hover:text-primary transition">
                            Quản lí tài khoản
                            <span class="absolute -left-8 top-0 text-base">
                                <font-awesome-icon :icon="['far', 'address-card']" />
                            </span>
                        </a>
                        <router-link :to="{ name: 'ManageAccount' }" :class="route.name == 'ManageAccount' ? 'text-red-500 font-bold' : ''"
                            class="relative block capitalize hover:text-primary transition">
                            Thông tin tài khoản
                        </router-link>
                        <router-link v-if="store.state.user?.user?.typeLogin == 'local'" 
                        :to="{name: 'ChangePassword'}" :class="route.name == 'ChangePassword' ? 'text-red-500 font-bold' : ''"
                            class="relative block capitalize hover:text-primary transition">
                            Thay đổi mật khẩu
                        </router-link>
                    </div>
                    <div class="space-y-1 pl-8 pt-4">
                        <a href="#"
                            class="relative text-primary block font-medium capitalize hover:text-primary transition">
                            Quản lí đơn hàng
                            <span class="absolute -left-8 top-0 text-base">
                                <font-awesome-icon :icon="['far', 'address-card']" />
                            </span>
                        </a>
                        <router-link :to="{ name: 'Orders' }" :class="route.name == 'Orders' ? 'text-red-500 font-bold' : ''"
                            class="relative block capitalize hover:text-primary transition">
                            Đơn hàng đã đặt
                        </router-link>
                    </div>
                    <div class="space-y-1 pl-8 pt-4">
                        <router-link :to="{ name: 'Wishlist' }" :class="route.name == 'Wishlist' ? 'text-red-500 font-bold' : ''"
                            class="relative block font-medium capitalize hover:text-primary transition">
                            My wishlist
                            <span class="absolute -left-8 top-0 text-base">
                                <font-awesome-icon :icon="['far', 'heart']" />
                            </span>
                        </router-link>
                    </div>
                    <div class="space-y-1 pl-8 pt-4">
                        <div @click="logout()"
                            class="relative block font-medium capitalize hover:text-primary transition cursor-pointer">
                            Đăng xuất
                            <span class="absolute -left-8 top-0 text-base">
                                <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile info -->
            <router-view class="col-span-9 "></router-view>
        </div>
    </div>
</template>