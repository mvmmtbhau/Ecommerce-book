<script setup>
import orderService from "@/services/order";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";

import { publicImageProduct } from "@/constants";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

let timeOut;
let timer = 300;
const dialog = ref(false);

const orders = ref();
let oldOrders;
const pageNumber = ref(1);
const pages = ref();
const perPage = ref(10);
const filterUser = ref('');
const sortBy = ref(0);
const detailOrder = ref();

let listUsers;

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

const showOrder = async (order) => {
    await setDetail(order)
    await setDialog(true)
}

const closeShow = async () => {
    await setDialog(false)
    setTimeout(async () => {
        await setDetail(null)
    }, 300)
}

const setDialog = (data) => {
    return dialog.value = data;
}
const setDetail = (data) => {
    return detailOrder.value = data;
}

const fetchOrders = async () => {
    orders.value = '';
    try {
        const result = await orderService.adminGetOrders(perPage.value, pageNumber.value, filterUser.value, sortBy.value);
        if (result.status == 200) {
            orders.value = result.data.orders;
            if(!oldOrders) oldOrders = orders.value;
            listUsers = computed(() => {
                const uniqueUsers = new Map();
                oldOrders.forEach(order => {
                    const userId = order.owner._id;
                    const fullName = order.owner.fullName;

                    if (!uniqueUsers.has(userId)) {
                        uniqueUsers.set(userId, { id: userId, fullName: fullName });
                    }
                });

                return Array.from(uniqueUsers.values());
            })
            pages.value = result.data.totalPage;
            return;
        };
    } catch (e) {
        console.log(e)
    }
}

const confirmDelivery = (order) => {
    Swal.fire({
        title: `Xác nhận giao đơn hàng ${order._id} này?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Giao hàng',
        cancelButtonText: 'Hủy',
    }).then(async (result) => {
        if (result.isConfirmed) {
            delivery(order)
        }
    })

}

const delivery = async (order) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
        loading();
        try {
            const result = await orderService.adminDelivery(order);
            loading(1);
            fetchOrders();
            if (result.status == 201) {
                console.log(result.data);
                Swal.fire({
                    title: result.data.msgAdmin,
                    icon: "success"
                });
            }
            if (result.status == 203) {
                Swal.fire({
                    title: result.data.msg,
                    icon: "error"
                });
            }
        } catch (e) {
            console.log(e)
        }
    }, timer)
}

const confirmDelete = (order) => {
    Swal.fire({
        icon: 'question',
        text: `Bạn muốn xóa đơn hàng ${order._id}?`,
        showConfirmButton: true,
        confirmButtonText: 'Xóa',
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            delOrder(order)
        }
    })
}

const delOrder = async (order) => {
    clearTimeout(timeOut);
    loading();
    timeOut = setTimeout(async () => {
        try {
            const result = await orderService.adminDel(order);
            if (result.status == 201) {
                loading(1);
                fetchOrders();
                console.log(result.data);
                Swal.fire({
                    title: result.data.msg,
                    icon: "success"
                });
            }
            if (result.status == 203) {
                loading(1);
                fetchOrders();
                Swal.fire({
                    title: result.data.msg,
                    icon: "error"
                });
            }
        } catch (e) {
            console.log()
        }
    }, timer);
}

const resetValue = async () => {
    loading(0, 10000);
    perPage.value = 10;
    filterUser.value = ''; 
    sortBy.value = '';
    pageNumber.value = 1; 
    await fetchOrders()
    loading(1);
    
}

onBeforeMount(async () => {
    await fetchOrders();
})

watch(pageNumber, async () => {
    loading();
    await fetchOrders();
    loading(1);
})

watch(perPage, async () => {
    loading();
    await fetchOrders();
    loading(1);
})

watch(filterUser, async () => {
    loading();
    await fetchOrders();
    loading(1);
})

watch(sortBy, async () => {
    loading();
    await fetchOrders();
    loading(1);
})
    ;
</script>

<template>
    <div v-if="orders" class="relative overflow-x-auto shadow-md sm:rounded-lg border-t-2">
        <div class="grid grid-cols-4 gap-2 mb-4 mx-2 my-2">
            <select v-model="perPage" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
            block w-full p-2.5">
                <option selected value="10">Chọn số lượng hiển thị</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
            </select>
            <select v-model="filterUser" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
            block w-full p-2.5">
                <option selected value="">Lọc theo người dùng</option>
                <option v-for="user in listUsers" :key="user" :value="user.id">
                    {{ user.fullName }} 
                </option>
            </select>
            <select v-model="sortBy" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
            block w-full p-2.5">
                <option selected value="0">Mặc định</option>
                <option value="1">Tổng giá tăng dần</option>
                <option value="2">Tổng giá giảm dần</option>
            </select>
            <span @click="resetValue()" 
            class="cursor-pointer focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 
            focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 text-center">
                Reset
            </span>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Đơn hàng
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Người đặt
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Địa chỉ
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Tổng sản phẩm
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Tổng giá
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        Trạng thái
                    </th>
                    <th scope="col" class="px-6 py-3">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in orders" :key="index" class="bg-white border-b  hover:bg-gray-50">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ order._id }}
                    </th>
                    <td class="px-3 py-4 break-words">
                        {{ order.owner.fullName }}
                    </td>
                    <td class="px-3 py-4 break-words w-40">
                        {{ order.shippingAddress }}
                    </td>
                    <td class="px-3 py-4">
                        {{ order.products.length }}
                    </td>
                    <td class="px-3 py-4">
                        ${{ order.total }}
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div @click="confirmDelivery(order)" v-if="order?.status == 0" type="" class="cursor-pointer focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-red-300 
                        font-medium rounded-full text-sm px-5 py-2.5">
                            Giao hàng
                        </div>
                        <div v-if="order?.status == 1" class="focus:outline-none text-white bg-blue-700 focus:ring-4 focus:ring-red-300 
                        font-medium rounded-full text-sm py-2.5">
                            Đang giao hàng
                        </div>
                        <div v-if="order?.status == 2" class="focus:outline-none text-white bg-green-700 focus:ring-4 focus:ring-red-300 
                        font-medium rounded-full text-sm py-2.5">
                            Đã nhận hàng
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="">
                            <span class="mr-4 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                                color="primary" @click="showOrder(order)">
                                Xem
                            </span>

                            <v-dialog v-model="dialog" width="800px" class="">
                                <v-card>
                                    <div class="relative">
                                        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th scope="col" class="px-6 py-3">
                                                    </th>
                                                    <th scope="col" class="px-6 py-3">
                                                        Sản phẩm
                                                    </th>
                                                    <th scope="col" class="px-6 py-3">
                                                        Số lượng
                                                    </th>
                                                    <th scope="col" class="px-6 py-3">
                                                        Đơn giá
                                                    </th>
                                                    <th scope="col" class="px-6 py-3">
                                                        Tổng cộng
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(product, index) in detailOrder.products" :key="index"
                                                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <th scope="row"
                                                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <img :src="publicImageProduct + product.images[0].filename"
                                                            class="w-20 h-40 object-contain">
                                                    </th>
                                                    <td class="px-6 py-4">
                                                        {{ product.name }}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        {{ product.quantity }}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        ${{ product.price }}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        ${{ product.price * product.quantity }}
                                                    </td>
                                                </tr>
                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <th scope="row"
                                                        class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                                                        Tổng cộng:
                                                    </th>
                                                    <td class="px-6 py-4 ">

                                                    </td>
                                                    <td class="px-6 py-4">
                                                    </td>
                                                    <td class="px-6 py-4">
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        ${{ detailOrder.total }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <v-card-actions>
                                        <v-btn color="primary" block @click="closeShow()">Đóng</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </span>
                        <span @click="confirmDelete(order)" v-if="order?.status == 2"
                            class="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">
                            Xóa
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
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