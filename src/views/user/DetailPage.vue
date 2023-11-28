<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { publicImageProduct, publicImageAvatar } from "@/constants";
import { useStore } from "vuex";

import useWishlist from "@/uses/useWishlist";
import useCart from "@/uses/useCart";
import Swal from 'sweetalert2';
import productService from "@/services/product";
import rateService from "@/services/rate";

const route = useRoute();
const store = useStore();
const router = useRouter();
const {
    addWishlist,
} = useWishlist();

const {
    addToCart,
} = useCart();

const product = ref();
const imgShow = ref();
const quantity = ref(1);
const totalRate = ref(0);
const avgStar = ref(0)

const showContent = ref(0);
const rates = ref();

const pageNumber = ref(1);
const pages = ref();
const perPage = 4;

let timeOut;
let loading = ref(false);


const showLoading = (event = 0, time = 2000) => {
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
        Swal.showLoading()
    } else {
        Swal.close()
    }
}

const fetchDetail = async (id) => {
    try {
        const result = await productService.getById(id);
        if (result.status == 200) {
            product.value = result.data.product;
            imgShow.value = product.value.images[0].filename;
            totalRate.value = result.data.totalRate;
            avgStar.value = result.data.avgStar;
        }
    } catch (err) {
        console.log(err);
    }
}

const fetchRates = async (id) => {
    rates.value = '';
    try {
        const result = await rateService.getByProductId(id, perPage, pageNumber.value);
        if (result.status == 200) {
            rates.value = result.data.rates;
            console.log(rates.value);
            pages.value = result.data.totalPage
        }
    } catch (e) {
        console.log(e);
    }
}

const increment = () => {
    if (quantity.value < product.value.quantity) quantity.value++;
}

const decrement = () => {
    if (quantity.value > 0) quantity.value--;
}

const handleAdd = async (idPro) => {
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
    showLoading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await addWishlist(store.state.wishlist?.wishlist._id, idPro, store.state.cart?.cart._id);
            showLoading(1)
            if (result.status == 202) {
                Swal.fire({
                    text: result.data.msg,
                    icon: "warning",
                    showConfirmButton: true,
                    confirmButtonText: 'Tới wishlist',
                    showCancelButton: true,
                    cancelButtonText: 'Không'
                }).then(result => {
                    if (result.isConfirmed) {
                        router.push({
                            name: 'Wishlist'
                        })
                    }
                });
            }
            if (result.status == 203) {
                Swal.fire({
                    text: result.data.msg,
                    icon: "error"
                });
            };
            if (result.status == 201) {
                store.dispatch('wishlist/setWishlist', result.data.wishlist)
                Swal.fire({
                    text: result.data.msg,
                    icon: "success",
                    showConfirmButton: true,
                    confirmButtonText: 'Tới wishlist',
                    showCancelButton: true,
                    cancelButtonText: 'Không'
                }).then(result => {
                    if (result.isConfirmed) {
                        router.push({
                            name: 'Wishlist'
                        })
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    }, 300)
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
    showLoading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await addToCart(store.state.cart.cart?._id, idPro, quantity.value);
            showLoading(1);
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
        } catch (e) {
            console.log(e)
        }
    }, 300)

}

onBeforeMount(async () => {
    await fetchDetail(route.params.id);
    await fetchRates(route.params.id);
})

watch(quantity, () => {
    if (quantity.value <= 0) quantity.value = 1;
})

watch(pageNumber, async () => {
    await fetchRates(route.params.id);
})
    ;
</script>

<template>
    <div v-if="product" class="container max-w-[80%]">
        <!-- breadcrums -->
        <div class="py-4 flex items-center gap-3">
            <a href="#" class="text-primary text-base">
                <font-awesome-icon :icon="['fas', 'house']" />
            </a>
            <span class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <router-link :to="{
                name: 'ShopPage',
                query: { category: product.category._id }
            }" class="text-primary font-medium">{{ product.category.title }}</router-link>
            <span class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <p class="text-gray-600 font-medium">{{ product.name }}</p>
        </div>

        <!-- product view -->

        <div class="grid grid-cols-2 gap-6">
            <!-- Product image -->
            <div>
                <!-- main image -->
                <div id="imageContainer" class="image-container h-[30rem] group relative overflow-hidden">
                    <img :src="publicImageProduct + imgShow"
                        class="w-full h-full object-contain transition duration-300 origin-center">
                </div>

                <!-- others image -->
                <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-4 mt-4">
                    <img v-for="(image, index) in product.images" :key="index" :src="publicImageProduct + image.filename"
                        class="h-20 w-full object-cover cursor-pointer" @mouseover="imgShow = image.filename" />
                </div>
            </div>

            <!-- product content -->
            <div>
                <h2 class="text-3xl font-medium uppercase mb-2">{{ product.name }}</h2>
                <!-- rating star -->
                <div class="flex items-center mb-4">
                    <div class="flex gap-1 text-sm text-yellow-400">
                        <span v-for="starShow in [1, 2, 3, 4, 5]" :key="starShow" class="">
                            <font-awesome-icon v-if="starShow <= Math.floor(avgStar)" :icon="['fas', 'star']"
                                class="text-yellow-400" />
                            <font-awesome-icon
                                v-else-if="(starShow == (Math.floor(avgStar) + 1)) && (avgStar - Math.floor(avgStar) >= 0.5)"
                                :icon="['fas', 'star-half-stroke']" class="text-yellow-400" />
                            <font-awesome-icon v-else :icon="['far', 'star']" class="text-yellow-400" />
                        </span>
                    </div>
                    <div class="text-xs text-gray-500 ml-3">({{ totalRate }} Đánh giá)</div>
                </div>

                <!-- some info -->
                <div class="space-y-2">
                    <p class="text-gray-800 font-semibold space-x-2">
                        <span>Danh mục:</span>
                        <span class="">{{ product.category.title }}</span>
                    </p>
                    <p class="text-gray-800 font-semibold space-x-2">
                        <span>Trong kho:</span>
                        <span v-if="product.quantity > 0" class="text-green-600">{{ product.quantity }}</span>
                        <span v-else class="text-red-600">Hết hàng</span>
                    </p>
                </div>

                <!-- price -->
                <div class="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
                    <p class="text-xl text-primary font-semibold">$ {{ product.price }}</p>
                </div>
                <div class="mt-4">
                    <h3 class="text-sm text-gray-800 uppercase mb-1">Số lượng:</h3>
                    <div class="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                        <div @click="decrement()"
                            class="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">-</div>
                        <div class="h-8 w-12 text-md flex items-center justify-center">
                            <input v-model="quantity" type="number"
                                class="text-sm w-full h-full focus:outline-0 focus:border-0 border-black" min="0">
                        </div>
                        <div @click="increment()"
                            class="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">+</div>
                    </div>
                </div>

                <!-- cart button -->
                <div class="flex gap-3 border-b border-gray-200 pb-5 mt-6">
                    <div v-if="product.quantity > 0" @click="confirmAddToCart(product._id)"
                        class="bg-primary border border-primary text-white px-4 py-2 cursor-pointer
                    font-medium rounded uppercase flex items-center gap-3 hover:bg-transparent hover:text-primary transition">
                        <font-awesome-icon :icon="['fas', 'bag-shopping']" />
                        <p>Thêm vào giỏ hàng</p>
                    </div>
                    <div v-else
                        class="bg-red border border-red text-white px-4 py-2 cursor-not-allowed
                    font-medium rounded uppercase flex items-center gap-3 hover:bg-transparent hover:text-red transition">
                        <p>Hết hàng</p>
                    </div>
                    <div v-if="loading == false" @click="handleAdd(product._id)" class="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase
                     flex items-center gap-3 hover:bg-transparent hover:text-primary transition cursor-pointer">
                        <font-awesome-icon :icon="['fas', 'heart']" />
                        <p>Yêu thích</p>
                    </div>
                    <v-progress-circular class="text-center" v-else indeterminate></v-progress-circular>
                </div>
            </div>
        </div>

        <!-- product detail -->
        <div class="pb-16 pt-16">
            <h3 class="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium flex gap-2 items-center">
                <p @click="showContent = 0"
                    :class="[showContent == 0 ? 'border-black border-b-2' : 'hover:border-b-2 hover:border-black']"
                    class=" w-fit cursor-pointer transition ">Giới thiệu sản phẩm</p>
                <p @click="showContent = 1"
                    :class="[showContent == 1 ? 'border-black border-b-2' : 'hover:border-b-2 hover:border-black']"
                    class=" w-fit cursor-pointer transition">Đánh giá sản phẩm</p>
            </h3>

            <div class="pt-3 w-full">
                <div v-if="showContent == 0" class="text-gray-600 space-y-3 w-3/5" v-html="product.description">
                </div>
                <div v-else-if="showContent == 1 && rates">
                    <div v-if="rates" class="w-full border-b-2">
                        <article v-for="(rate, index) in rates" :key="index" class="w-full mt-4">
                            <div class="flex items-center mb-4">
                                <img v-if="rate?.owner.typeLogin == 'google'" :src="rate?.owner.avatar"
                                    referrerpolicy="no-referrer" class="h-8 w-8 rounded-full">
                                <div v-else class="mr-4">
                                    <img v-if="rate?.owner?.avatar" :src="publicImageAvatar + rate?.owner.avatar"
                                        class="h-8 w-8 rounded-full">
                                    <img v-else src="../../assets/images/noavatar.png" class="h-8 w-8 rounded-full">
                                </div>
                                <div class="font-medium dark:text-white">
                                    <p>{{ rate.showName }}</p>
                                </div>
                            </div>
                            <div class="flex items-center mb-1 gap-1">
                                <span v-for="starShow in [1, 2, 3, 4, 5]" :key="starShow" class="">
                                    <font-awesome-icon v-if="starShow <= rate.star" :icon="['fas', 'star']"
                                        class="text-yellow-400" />
                                    <font-awesome-icon v-if="starShow > rate.star" :icon="['far', 'star']"
                                        class="text-yellow-400" />
                                </span>
                                <span
                                    v-for="(text, index) in ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời']"
                                    :key="index">
                                    <p v-if="rate.star == (index + 1)"
                                        :class="[(rate.star == 4 || rate.star == 5) ? 'text-yellow-600' : 'text-gray-500 ml-4']"
                                        class="text-sm">{{ text }}</p>
                                </span>
                            </div>
                            <p class="mb-2 text-gray-500 dark:text-gray-400">{{ rate.textRate }}</p>
                        </article>
                        <div class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                            aria-label="Table navigation">
                            <v-pagination v-model="pageNumber" :length="pages" :total-visible="4"></v-pagination>
                        </div>
                    </div>
                    <div v-else class="space-y-4">
                        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
                        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
                        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
                        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
                    </div>
                </div>
                <div v-else class="mt-2 text-gray-500">
                    <p>Chưa có đánh giá nào dành cho sản phẩm này.</p>
                </div>
            </div>
        </div>

        <!-- related product -->
        <!-- <ProductCardComponent :newProducts="newProducts" gridSettings="grid grid-cols-4 gap-6" /> -->
    </div>
    <div v-else class="container max-w-[80%] mt-10">
        <v-skeleton-loader type="card-avatar"></v-skeleton-loader>
    </div>
</template>