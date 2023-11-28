<script setup>
import { onBeforeMount, ref, toRef } from "vue";
import { publicImageProduct } from "@/constants";
import { useStore } from "vuex";

import useWishlist from "@/uses/useWishlist";
import useCart from "@/uses/useCart";
import Swal from 'sweetalert2';
import { useRouter } from "vue-router";

const props = defineProps(['products', 'gridSettings', 'sold']);

const store = useStore();
const router = useRouter();

const {
    addWishlist,
} = useWishlist();

const {
    addToCart,
} = useCart();

let timeOut;
let timer = 300;

const loading = (event = 0, time = 2000) => {
    new Swal({
        text: 'Đợi một chút...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'info',
        timer: time,
        showCancelButton: false,
        showConfirmButton: false
    })
    if (event == 0) {
        Swal.showLoading();
    } else {
        Swal.close();
    }
}

const handleAddToWishlist = async (idPro) => {
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
        return;
    }
    clearTimeout(timeOut);
    loading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await addWishlist(store.state.wishlist?.wishlist._id, idPro, store.state.cart?.cart._id);
            loading(1);
            if (result.status == 202) {
                Swal.fire({
                    text: result.data.msg,
                    icon: "warning"
                });
            }
            if (result.status == 203) {
                Swal.fire({
                    text: result.data.msg,
                    icon: "error"
                });
            };
            if (result.status == 201) {
                Swal.fire({
                    text: result.data.msg,
                    icon: "success",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Tới wishlist',
                    cancelButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push({
                            name: 'Wishlist'
                        })
                    }
                });
                store.dispatch('wishlist/setWishlist', result.data.wishlist)
            }
        } catch (e) {
            console.log(e)
        }
    }, timer)
}

const confirmAddToCart = async (idPro) => {
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
        return;
    }
    let proInWish = false;
    if (store.state.wishlist?.wishlist.items.length > 0) {
        store.state.wishlist?.wishlist.items.forEach(item => {
            if (item._id === idPro) proInWish = true;
        })
    }
    if (proInWish) {
        Swal.fire({
            title: 'Thêm sản phẩm vào giỏ hàng!',
            text: 'Sản phẩm hiện có trong wishlist, bạn muốn thêm vào giỏ hàng chứ?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Thêm vào giỏ hàng',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleAddToCart(idPro)
            }
        })
    } else {
        handleAddToCart(idPro)
    }
}

const handleAddToCart = async (idPro) => {
    clearTimeout(timeOut);
    loading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await addToCart(store.state.cart?.cart?._id, idPro)
            loading(1);
            if (result.status == 201) {
                store.dispatch('cart/setCart', result.data.cart)
                store.dispatch('wishlist/setWishlist', result.data.wishlist)
                Swal.fire({
                    text: result.data.msg,
                    icon: "success",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Tới giỏ hàng',
                    cancelButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push({
                            name: 'CartPage'
                        })
                    }
                });
            }

            if (result.status == 203) {
                Swal.fire({
                    title: 'Xin lỗi!',
                    text: result.data.msg,
                    icon: "error"
                });
            }
        } catch (err) {
            console.log(err);
        }
    }, timer);
}


onBeforeMount(() => {
})
    ;
</script>

<template>
    <div :class="gridSettings" class="">
        <div v-for="product in products" :key="product" class="bg-white shadow-xl border-2 rounded overflow-hidden group h-fit">
            <!-- product img -->
            <div class="relative">
                <div class="h-52">
                    <img :src="publicImageProduct + product.images[0].filename" class="w-full h-full object-contain">
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center 
                gap-2 opacity-0 group-hover:opacity-100 transition">
                    <router-link :to="{
                        name: 'DetailProduct',
                        params: { id: product._id }
                    }" class="text-white text-lg w-8 h-8 rounded-full bg-primary flex items-center justify-center
                         hover:bg-gray-800 transition cursor-pointer">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                    </router-link>
                    <div @click="handleAddToWishlist(product._id)" class="text-white text-lg w-8 h-8 rounded-full bg-primary cursor-pointer
                    flex items-center justify-center hover:bg-gray-800 transition">
                        <font-awesome-icon :icon="['fas', 'heart']" />
                    </div>
                </div>
            </div>


            <!-- product content -->
            <div class="py-4 px-4">
                <router-link :to="{
                    name: 'DetailProduct',
                    params: { id: product._id }
                }">
                    <h4 class="uppercase font-medium text-base h-20 mb-2 text-gray-800 hover:text-primary transition">
                        {{ product.name }}
                    </h4>
                </router-link>
                <div class="flex items-baseline mb-1 space-x-2">
                    <p class="text-xl text-primary font-semibold">$ {{ product.price }}</p>
                    <!-- <p class="text-sm text-gray-400 line-through">$55.00</p> -->
                </div>
                <div class="flex items-center">
                    <div class="flex gap-1 text-sm text-yellow-400">
                        <span v-for="starShow in [1, 2, 3, 4, 5]" :key="starShow" class="">
                            <font-awesome-icon v-if="starShow <= Math.floor(product.avgStar)" :icon="['fas', 'star']"
                                class="text-yellow-400" />
                            <font-awesome-icon
                                v-else-if="(starShow == (Math.floor(product.avgStar) + 1)) && (product.avgStar - Math.floor(product.avgStar) >= 0.5)"
                                :icon="['fas', 'star-half-stroke']" class="text-yellow-400" />
                            <font-awesome-icon v-else :icon="['far', 'star']" class="text-yellow-400" />
                        </span>
                    </div>
                    <div class="text-xs text-gray-500 ml-3">({{ product.totalRate ? product.totalRate : 0 }})</div>
                </div>
            </div>
            <div v-if="product.quantity > 0" @click="confirmAddToCart(product._id)" class="block w-full py-1 text-center text-white bg-primary cursor-pointer
        border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
                Thêm vào giỏ hàng
            </div>
            <div v-else class="block w-full py-1 text-center text-white bg-red cursor-not-allowed
        border border-red rounded-b hover:bg-transparent hover:text-primary transition">
                Hết hàng
            </div>
        </div>
    </div>
</template>