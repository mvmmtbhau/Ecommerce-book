<script setup>
import wishlistService from "@/services/wishlist";
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";

import { publicImageProduct } from "@/constants";
import Swal from "sweetalert2";
import useCart from "@/uses/useCart";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const deleteItem = ref();
let timeOut;
let timer = 300;

const pageNumber = ref(1);
const pages = ref();
const perPage = 5;

const {
    addToCart,
} = useCart();

const wishlist = ref();

let showWishlist;

const loading = (event = 0) => {
    new Swal({
        text: 'Đợi một chút...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'info',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
    })
    if (event == 0) {
        Swal.showLoading();
    } else {
        Swal.close();
    }
}

const fetchWishlist = async () => {
    try {
        const result = await wishlistService.getWishlist(store.state.user?.user._id, perPage, pageNumber.value);
        if (result.status == 200) {
            wishlist.value = result.data.wishlist;
            showWishlist = computed(() => {
                if (!wishlist.value || !pageNumber.value || !perPage) {
                    return [];
                }
                pages.value = Math.ceil(wishlist.value.items.length / perPage);
                let result;
                if (pageNumber.value < pages.value) {
                    result = wishlist.value.items.slice((pageNumber.value - 1) * perPage, pageNumber.value * perPage)
                } else {
                    result = wishlist.value.items.slice((pageNumber.value - 1) * perPage,
                        Math.min(pageNumber.value * perPage, wishlist.value.items.length))
                }
                return result
            })
            store.dispatch('wishlist/setWishlist', result.data.wishlist)
        };
    } catch (e) {
        console.log(e)
    }
}

const removeFromWishlist = async (item) => {
    try {
        const result = await wishlistService.removeItem(wishlists.value._id, item._id);

        console.log(result)
        if (result.status == 201) {
            store.dispatch('wishlist/setWishlist', result.data.wishlist);
            Swal.fire({
                icon: 'success',
                title: result.data.msg
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const dialogDelete = (item) => {
    deleteItem.value = item;
    Swal.fire({
        title: "Bạn có muốn xóa " + item.name + " khỏi wishlist?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Hủy',
        confirmButtonText: "Xóa"
    }).then((result) => {
        if (result.isConfirmed) {
            removeFromWishlist(item);
        }
    });
}

const handleAddToCart = async (idPro) => {
    clearTimeout(timeOut);
    loading();
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

const confirmAddToCart = async (idPro) => {
    Swal.fire({
        title: 'Thêm sản phẩm vào giỏ hàng!',
        text: 'Bạn muốn thêm sản phẩm này vào giỏ hàng?',
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
}

onBeforeMount(async () => {
    await fetchWishlist()
})
    ;
</script>

<template>
    <div v-if="store.state.wishlist?.wishlist">
        <!-- single wishlist -->
        <div v-if="showWishlist?.length > 0" class="space-y-4">
            <div v-for="(item, index) in showWishlist" :key="index"
                class="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded shadow">
                <!-- wishlist img -->
                <div class="w-28 h-28 flex-shrink-0">
                    <img :src="publicImageProduct + item.images[0].filename" class="w-full h-full object-contain">
                </div>

                <!-- item content -->
                <div class="w-1/3">
                    <router-link :to="{
                        name: 'DetailProduct',
                        params: {id: item._id}
                    }" class="text-gray-800 text-xl font-medium uppercase break-words hover:text-primary">{{ item.name }}</router-link>
                    <p class="text-gray-500 text-sm">Trong kho:
                        <span v-if="item.quantity > 0" class="text-green-600">{{ item.quantity }}</span>
                        <span v-else class="text-red-600">Hết hàng</span>
                    </p>
                </div>

                <div class="text-primary text-lg font-semibold">$ {{ item.price }}</div>
                <div v-if="item.quantity > 0" @click="confirmAddToCart(item._id)" class="px-6 py-2 cursor-pointer text-center font-roboto font-medium text-sm text-white bg-primary border 
                border-primary rounded hover:bg-transparent hover:text-primary transition uppercase">
                    Thêm vào giỏ hàng
                </div>
                <div v-else class="px-6 py-2 cursor-not-allowed text-center font-roboto font-medium text-sm text-white bg-red border 
                border-red rounded hover:bg-transparent hover:text-red transition uppercase">
                    Hết hàng
                </div>
                <div @click="dialogDelete(item)" class="text-gray-600 cursor-pointer hover:text-primary">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                </div>
            </div>
        </div>
        <div v-else class="text-xl">
            <h2>Chưa có sản phẩm nào trong wishlist.</h2>
        </div>
        <div class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <v-pagination v-model="pageNumber" :length="pages" :total-visible="4"></v-pagination>
        </div>
    </div>
    <div v-else class="space-y-4">
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
    </div>
</template>