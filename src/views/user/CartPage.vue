<script setup>
import { useStore } from "vuex";
import { publicImageProduct } from "@/constants";
import { onBeforeMount, onMounted, ref, watch } from "vue";

import cartService from "@/services/cart";
import orderService from "@/services/order";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import ky from "ky";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter()
const cart = ref();

const fullAddress = ref()
const province = ref();
const district = ref();
const ward = ref();
const detailAddress = ref();

const newAddress = ref(false);

const provinces = ref(null);
const districts = ref(null);
const wards = ref(null);
let timeOut;
let timer = 300;

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
        Swal.showLoading();
    } else {
        Swal.close()
    }
}

const fetchCart = async () => {
    try {
        const result = await cartService.getCart(store.state.user?.user?._id);
        if (result.status == 200) {
            store.dispatch('cart/setCart', result.data.cart)
            cart.value = store.state.cart?.cart;
        }
    } catch (e) {
        console.log(e);
    }
}

const delProInCart = async (index) => {
    clearTimeout(timeOut)
    showLoading()
    try {
        const result = await cartService.removeProduct(store.state.cart?.cart._id, { index });
        showLoading(1);
        if (result.status == 201) {
            store.dispatch('cart/setCart', result.data.cart)
            cart.value = store.state.cart?.cart;
            Swal.fire({
                title: result.data.msg,
                icon: 'success',
            })
        }
    } catch (err) {
        console.log(err);
    }
}

const increment = async (index, idPro, quantity) => {
    if (!((quantity + 1) <= cart.value.products[index].product.quantity)) {
        Swal.fire({
            text: `Rất tiếc bạn chỉ có thể mua tối đa ${cart.value.products[index].product.quantity} đối với sản phẩm này.`,
            icon: 'warning'
        })
    } else {
        clearTimeout(timeOut);
        timeOut = setTimeout(async () => {
            changeQuantity(index, idPro, quantity + 1);
        }, timer)
    }
}

const decrement = async (index, idPro, quantity) => {
    if ((quantity - 1) == 0) {
        Swal.fire({
            title: 'Bạn có muốn xóa sản phẩm này?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Xóa sản phẩm',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                delProInCart(index)
            }
        })
    } else {
        clearTimeout(timeOut);
        timeOut = setTimeout(async () => {
            changeQuantity(index, idPro, quantity - 1);
        }, timer)
    }
}

const changeQuantity = async (index, idPro, quantity, event) => {
    if (event) {
        if (event.target.value == 0 || event.target.value < 0) {
            Swal.fire({
                title: 'Bạn có muốn xóa sản phẩm này?',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Xóa sản phẩm',
                cancelButtonText: 'Hủy',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    delProInCart(index)
                } else {
                    event.target.value = quantity;
                }
            })
            return;
        }

        quantity = event.target.value;
    }

    clearTimeout(timeOut)
    showLoading()
    try {
        store.dispatch('cart/changeQuantity', { index, quantity })
        const result = await cartService.updateCart(cart.value._id, { index, quantity, idPro })
        showLoading(1);
        if (result.status == 201) {
            store.dispatch('cart/setCart', result.data.cart);
            cart.value = store.state.cart?.cart;
        }

        if (result.status == 203) {
            store.dispatch('cart/setCart', result.data.cart);
            cart.value = store.state.cart?.cart;
            Swal.fire({
                text: result.data.msg,
                icon: 'warning'
            })
        }
    } catch (e) {
        console.log(e);
    }
}

const confirmDelete = (index) => {
    Swal.fire({
        title: 'Bạn có muốn xóa sản phẩm này?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Xóa sản phẩm',
        confirmButtonColor: 'red',
        cancelButtonText: 'Hủy',
    }).then(async (result) => {
        if (result.isConfirmed) {
            delProInCart(index)
        }
    })
}

const fetchProvinces = async () => {
    const result = await ky.get(`https://provinces.open-api.vn/api/p/`).json()
    provinces.value = result;
}

const fetchDistricts = async (provinceCode) => {
    if (provinceCode) {
        fullAddress.value = '';
        district.value = '';
        ward.value = '';
        wards.value = null;
        showLoading();
        const result = await ky.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).json()
        fullAddress.value = province.value.name;
        districts.value = result;
        showLoading(1);
    }
}

const fetchWards = async (districtCode) => {
    if (districtCode) {
        fullAddress.value = province.value.name;
        showLoading();
        const result = await ky.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).json()
        fullAddress.value = district.value.name + ', ' + fullAddress.value;
        wards.value = result;
        showLoading(1);
    }
}

const setFullAddress = () => {
    fullAddress.value = district.value.name + ', ' + ward.value.name + ', ' + province.value.name;
    fullAddress.value = detailAddress.value + ', ' + fullAddress.value;
}

const getOldAddress = () => {
    newAddress.value = false;
    province.value = '';
    district.value = '';
    ward.value = '';
    detailAddress.value = '';
    fullAddress.value =
        store.state.user?.user?.address + ', ' +
        store.state.user?.user?.ward.name + ', ' +
        store.state.user?.user?.district.name + ', ' +
        store.state.user?.user?.province.name;
}

const handlePlaceOrder = async (province, district, ward, address, fullAddress) => {
    showLoading(0, 10000);
    try {
        const result = await orderService.placeOrder(
            cart.value,
            {
                province: (!province ? store.state.user?.user?.province : province),
                district: (!district ? store.state.user?.user?.district : district),
                ward: (!ward ? store.state.user?.user?.ward : ward),
                address: (!address ? store.state.user?.user?.address : address),
                fullAddress,
            }
        )
        showLoading(1);
        if (result.status == 201) {
            store.dispatch('cart/setCart', result.data.cart);
            localStorage.setItem("token-hau", result.data.user)
            store.dispatch('user/setUser', jwtDecode(result.data.user));
            cart.value = store.state.cart?.cart;
            Swal.fire({
                title: result.data.msg,
                icon: "success"
            });
        }

        if (result.status == 203) {
            store.dispatch('cart/setCart', result.data.cart);
            cart.value = store.state.cart?.cart;
            Swal.fire({
                title: result.data.msg,
                icon: "error"
            });
        }
    } catch (e) {
        console.log(e);
    }
}

const confirmPlaceOrder = async () => {
    clearTimeout(timeOut);
    if (cart.value.products.length == 0) {
        return Swal.fire({
            icon: 'error',
            text: 'Chưa có sản phẩm nào.',
            showConfirmButton: true,
            confirmButtonText: 'Tới cửa hàng',
            showCancelButton: true,
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/shop')
            }
        })
    }
    if ((!province.value || !district.value || !ward.value || !detailAddress.value) && newAddress.value == true) {
        return Swal.fire({
            icon: 'error',
            text: 'Vui lòng nhập đầy đủ thông tin địa chỉ (Tỉnh thành/Quận huyện/Phường xã).'
        })
    } else {
        timeOut = setTimeout(async () => {
            await handlePlaceOrder(province.value, district.value, ward.value, detailAddress.value, fullAddress.value);
        }, timer)
    }
}

onBeforeMount(async () => {
    if (!store.state.user?.user) {
        Swal.fire({
            text: 'Bạn chưa đăng nhập, vui lòng đăng nhập vào tài khoản của bạn.',
            icon: "warning",
        }).then(function () {
            window.location = '/login'
        });
        return;
    }
    if (store.state.user?.user?.address &&
        store.state.user?.user?.ward &&
        store.state.user?.user?.district &&
        store.state.user?.user?.province.name) {
        fullAddress.value =
            store.state.user?.user?.address + ', ' +
            store.state.user?.user?.ward.name + ', ' +
            store.state.user?.user?.district.name + ', ' +
            store.state.user?.user?.province.name;
    } else {
        newAddress.value = true;
    }


    await fetchCart();
    await fetchProvinces();
})


watch(province, async () => {
    if (province.value) {
        await fetchDistricts(province.value.code)
    }
})

watch(district, async () => {
    if (district.value) {
        await fetchWards(district.value.code)
    }

})

watch(ward, () => {
    if (ward.value) {
        fullAddress.value = district.value.name + ', ' + province.value.name;
        if (ward.value) {
            fullAddress.value = ward.value.name + ', ' + fullAddress.value;
        }
        if (detailAddress.value) {
            fullAddress.value = detailAddress.value + ', ' + fullAddress.value;
        }
    }
})

watch(fullAddress, () => {
    // console.log(fullAddress.value);
})


    ;
</script>

<template>
    <div v-if="cart" class="container max-w-[80%]">
        <!-- breadcrums -->
        <div class="py-4 flex items-center gap-3">
            <a href="#" class="text-primary text-base">
                <font-awesome-icon :icon="['fas', 'house']" />
            </a>
            <span class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <p class="text-gray-600 font-medium">Giỏ hàng</p>
        </div>
        <div class="grid grid-cols-12 items-start pb-16 pt-4 gap-4">
            <div class="col-span-8">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-16 py-3">
                                    <span class="sr-only">Hình ảnh</span>
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Sản phẩm
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Số lượng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Giá
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Tổng cộng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="cart?.products.length > 0">
                            <tr v-for="(product, index) in cart?.products" :key="index"
                                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td class="p-4">
                                    <img :src="publicImageProduct + product.product.images[0].filename"
                                        class="w-full md:w-32 h-32 object-contain" :alt="product.product.name">
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white break-words">
                                    {{ product.product.name }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <button @click="decrement(index, product.product._id, product.quantity)"
                                            class="inline-flex items-center justify-center p-1 me-3 text-sm 
                                        font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full 
                                        focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 
                                        dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 18 2">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2" d="M1 1h16" />
                                            </svg>
                                        </button>
                                        <div>
                                            <input type="number" :value="product.quantity"
                                                @blur="changeQuantity(index, product.product._id, product.quantity, $event)"
                                                class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                            focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600
                                             dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>
                                        <button @click="increment(index, product.product._id, product.quantity)"
                                            class="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            type="button">
                                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    ${{ product.product.price }}
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    ${{ product.product.price * product.quantity }}
                                </td>
                                <td class="px-6 py-4">
                                    <div @click="confirmDelete(index)"
                                        class="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">
                                        Remove
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr class="text-center h-36">
                                <td colspan="5">
                                    <p class="mb-4">Chưa có sản phẩm nào trong giỏ hàng.</p>
                                    <router-link to="/shop" class="border p-1 bg-primary text-xl rounded-md">
                                        Shopping nào
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div
                class="col-span-4 border-gray-200 border p-4 rounded relative overflow-x-auto shadow-md sm:rounded-lg bg-gray-50">
                <h4 class="text-gray-800 text-lg mb-4 font-medium uppercase">Tổng đơn hàng</h4>
                <!-- Địa chỉ -->

                <div v-if="newAddress" class="space-y-4">
                    <button v-if="(store.state.user?.user?.address &&
                        store.state.user?.user?.ward &&
                        store.state.user?.user?.district &&
                        store.state.user?.user?.province.name)" @click="getOldAddress" class="text-blue-700 hover:text-white border border-black hover:bg-blue-800 focus:ring-4 
                    focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                    dark:focus:ring-blue-800 flex items-center gap-2">
                        Dùng địa chỉ cũ
                    </button>
                    <div>
                        <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Tỉnh thành
                        </label>
                        <select v-model="province" id="province" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                         dark:focus:border-blue-500">
                            <option v-for="(pro, index) in provinces" :key="index"
                                :value="{ name: pro.name, code: pro.code }">
                                {{ pro.name }}
                            </option>
                        </select>
                    </div>
                    <div v-if="province && districts != null">
                        <label for="district" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Quận huyện
                        </label>
                        <select v-model="district" id="district" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                         dark:focus:border-blue-500">
                            <option v-for="(dis, index) in districts?.districts" :key="index"
                                :value="{ name: dis.name, code: dis.code }">
                                {{ dis.name }}
                            </option>
                        </select>
                    </div>
                    <div v-if="district && wards != null">
                        <label for="ward" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Phường xã
                        </label>
                        <select v-model="ward" id="ward" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                         dark:focus:border-blue-500">
                            <option v-for="(war, index) in wards?.wards" :key="index"
                                :value="{ name: war.name, code: war.code }">
                                {{ war.name }}
                            </option>
                        </select>
                    </div>
                    <div v-if="ward">
                        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Chi tiết địa chỉ
                        </label>
                        <input v-model="detailAddress" @blur="setFullAddress" type="text"
                            class="w-full border border-gray-400 rounded-lg" placeholder="Nhập chi tiết địa chỉ">
                    </div>
                </div>
                <div v-else>
                    <button @click="newAddress = true; fullAddress = ''" class="text-blue-700 hover:text-white border border-black hover:bg-blue-800 focus:ring-4 
                    focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                    dark:focus:ring-blue-800 flex items-center gap-2">
                        <font-awesome-icon :icon="['fas', 'plus']" /> Địa chỉ mới
                    </button>
                </div>
                <div class="h-[1px] bg-gray-300 mt-10"></div>

                <!-- Địa chỉ giao hàng -->
                <div class="flex justify-between font-medium py-3 uppercase">
                    <p class="font-semibold">Địa chỉ giao hàng:</p>
                </div>
                <div class="flex justify-between py-3">
                    <p class="font-semibold text-xs break-words">
                        {{ fullAddress }}
                    </p>
                </div>
                <!-- Total -->
                <div class="flex justify-between font-medium py-3 uppercase">
                    <p class="font-semibold">Tổng</p>
                    <p>${{ cart.total }}</p>
                </div>

                <!-- place order button -->
                <div @click="confirmPlaceOrder()" class="w-full mt-10 cursor-pointer block text-center bg-primary border border-primary text-white px-4 py-3 
                font-medium rounded-md hover:bg-transparent hover:text-primary transition uppercase text-sm">
                    Đặt hàng
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container max-w-[80%] mt-10">
        <v-skeleton-loader type="card-avatar"></v-skeleton-loader>
    </div>
</template>