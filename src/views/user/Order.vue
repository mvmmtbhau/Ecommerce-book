<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { publicImageProduct, publicImageAvatar } from "@/constants";

import orderService from "@/services/order";
import rateService from "@/services/rate";

const store = useStore();
const router = useRouter();

let timeOut;
let timer = 300;
const textRate = ref();
const starRate = ref(5);
const dialog = ref(false);
const dialogRate = ref(false);
const checkShow = ref(true);

const orders = ref();
const pageNumber = ref(1);
const pages = ref();
const perPage = 10;
const detailOrder = ref();

const showName = computed(() => {
    if (checkShow.value == false) {
        const hiddenCharacters = '******'
        const visibleCharacters = store.state.user?.user.fullName.slice(0, 2);
        const hiddenPart = hiddenCharacters;

        return visibleCharacters + hiddenPart;
    } else {
        return store.state.user?.user?.fullName;
    }
})

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

const closeDialogRate = () => {
    checkShow.value = true;
    starRate.value = 5;
    textRate.value = '';
    dialogRate.value = false;
}

const fetchOrders = async () => {
    orders.value = '';
    try {
        const result = await orderService.getOrders(store.state.user?.user._id, perPage, pageNumber.value);
        if (result.status == 200) {
            orders.value = result.data.orders;
            pages.value = result.data.totalPage;
            return;
        };
    } catch (e) {
        console.log(e)
    }
}

const confirmReceived = (order) => {
    Swal.fire({
        icon: 'warning',
        text: 'Bạn có chắc chắn đã nhận được hàng? Nếu xác nhận, bạn không thể hoàn tác lại hành động này.',
        showConfirmButton: true,
        confirmButtonText: 'Xác nhận',
        confirmButtonColor: 'green',
        showCancelButton: true,
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            received(order)
        }
    })
}

const received = async (order) => {
    clearTimeout(timeOut);
    loading();
    timeOut = setTimeout(async () => {
        try {
            const result = await orderService.userReceived(order);
            if (result.status == 201) {
                loading(1);
                fetchOrders();
                console.log(result.data);
                Swal.fire({
                    title: result.data.msgUser,
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
            const result = await orderService.userDel(order);
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

const confirmUndo = (order) => {
    Swal.fire({
        icon: 'question',
        text: `Bạn muốn hủy đặt đơn hàng ${order._id}?`,
        showConfirmButton: true,
        confirmButtonText: 'Xác nhận',
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
            undoOrder(order)
        }
    })
}

const undoOrder = async (order) => {
    clearTimeout(timeOut);
    loading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await orderService.userUndoOrder(order);
            if (result.status == 201) {
                loading(1);
                fetchOrders();
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

const rating = async (order) => {
    const text = textRate.value;
    clearTimeout(timeOut);
    closeDialogRate();
    loading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await rateService.ratingProduct({
                order,
                star: starRate.value,
                text,
                showName: showName.value
            })
            loading(1);
            fetchOrders();
            if (result.status == 201) {
                Swal.fire({
                    icon: "success",
                    text: result.data.msg,
                })
            }
            if (result.status == 203) {
                Swal.fire({
                    icon: "error",
                    text: result.data.msg,
                })
            }
        } catch (e) {
            console.log(e)
        }
    })
}

onBeforeMount(async () => {
    await fetchOrders();
})

watch(pageNumber, async () => {
    loading();
    await fetchOrders();
    loading(1);
})
    ;
</script>

<template>
    <div v-if="orders" class="relative text-center overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Đơn hàng
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Tổng sản phẩm
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Tổng giá
                    </th>
                    <th scope="col" class="px-3 py-3">
                        Trạng thái
                    </th>
                    <th scope="col" class="px-3 py-3">
                    </th>
                </tr>
            </thead>
            <tbody v-if="orders.length > 0">
                <tr v-for="(order, index) in orders" :key="index"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ order._id }}
                    </th>
                    <td class="px-3 py-4">
                        {{ order.products.length }}
                    </td>
                    <td class="px-3 py-4">
                        ${{ order.total }}
                    </td>
                    <td class="px-3 py-4 text-[1rem]">
                        <p v-if="order?.status == 0" class="text-green-600">Đang chờ xác nhận</p>
                        <p v-if="order?.status == 1" class="text-blue-600 mb-2">Đang trên đường giao hàng</p>
                        <p v-if="order?.status == 2" class="text-orange-500 mb-2">Đã hoàn thành</p>

                    </td>
                    <td class="px-3 py-4 flex flex-col">
                        <span class="">
                            <span class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                                color="primary" @click="showOrder(order)">
                                Xem
                            </span>

                            <v-dialog v-model="dialog" width="800px" class="">
                                <v-card title="CHI TIẾT ĐƠN HÀNG">
                                    <div class="relative">
                                        <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
                                            <thead class=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                                                <tr class="">
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
                        <span @click="confirmUndo(order)" v-if="order?.status == 0"
                            class="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                            color="primary">
                            Hủy đặt hàng
                        </span>
                        <span @click="confirmReceived(order)" v-if="order?.status == 1"
                            class="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                            color="primary">
                            <p>Xác nhận</p>
                            <p>đã nhận</p>
                            <p>được hàng</p>
                        </span>
                        <span @click="confirmDelete(order)" v-if="order?.status == 2 && order?.userRate == true"
                            class="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">
                            Xóa
                        </span>
                        <span class="" v-if="order?.status == 2 && order?.userRate == false">
                            <span class="font-medium text-orange-600 dark:text-orange-500 hover:underline cursor-pointer"
                                color="primary" @click="dialogRate = true">
                                Đánh giá
                            </span>

                            <v-dialog v-model="dialogRate" width="800px" class="" persistent>
                                <v-card title="ĐÁNH GIÁ SẢN PHẨM">
                                    <div class="relative">
                                        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th scope="col" class="px-6 py-3">
                                                    </th>
                                                    <th scope="col" class="px-6 py-3">
                                                        Sản phẩm
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(product, index) in order.products" :key="index"
                                                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <th scope="row"
                                                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <img :src="publicImageProduct + product.images[0].filename"
                                                            class="w-40 h-20 object-cover">
                                                    </th>
                                                    <td class="px-6 py-4">
                                                        {{ product.name }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="grid grid-cols-12 items-center px-10 py-6">
                                            <div class="col-span-11 flex flex-col">
                                                <span class="flex items-center">
                                                    <p class="text-sm self-start mr-4">Chất lượng sản phẩm</p>
                                                    <div class="mr-1">
                                                        <span v-for="star in [1, 2, 3, 4, 5]" :key="star"
                                                            class="cursor-pointer text-2xl text-yellow-400"
                                                            @click="starRate = star">
                                                            <font-awesome-icon v-if="star <= starRate"
                                                                :icon="['fas', 'star']" class="mr-1" />
                                                            <font-awesome-icon v-if="star > starRate"
                                                                :icon="['far', 'star']" class="mr-1" />
                                                        </span>
                                                    </div>
                                                    <span
                                                        v-for="(text, index) in ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời']"
                                                        :key="index">
                                                        <p v-if="starRate == (index + 1)"
                                                            :class="[(starRate == 4 || starRate == 5) ? 'text-yellow-600' : 'text-gray-500']"
                                                            class="text-sm">{{ text }}</p>
                                                    </span>
                                                </span>

                                                <div class="px-4 py-4 mt-4">
                                                    <v-textarea 
                                                    v-model="textRate"
                                                    label="Đánh giá của bạn" 
                                                    bg-color="grey-lighten-2" 
                                                    auto-grow 
                                                    clearable clear-icon="mdi-close-circle">
                                                </v-textarea>
                                                </div>
                                                <div class="flex items-center my-4">
                                                    <input checked id="checked-checkbox" type="checkbox" v-model="checkShow"
                                                        class="w-4 h-4 cursor-pointer text-orange-600 bg-gray-300 border-gray-300 rounded focus:ring-orange-500">
                                                    <label for="checked-checkbox"
                                                        class="ms-2 text-sm cursor-pointer font-medium text-gray-900 dark:text-gray-300">
                                                        <p>Hiển thị tên đăng nhập trên đánh giá</p>
                                                        <p class="text-gray-400">
                                                            Tên tài khoản sẽ được biểu hiện như {{ showName }}
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn class="px-10 hover:bg-gray-200 hover:text-black" variant="text"
                                            @click="closeDialogRate()">
                                            Trở lại
                                        </v-btn>
                                        <v-btn class="px-10 hover:bg-orange-500 hover:text-white" variant="text"
                                            @click="rating(order)">
                                            Hoàn thành
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </span>
                    </td>
                </tr>
            </tbody>
            <tbody v-else class="text-center">
                <tr><th colspan="4">Chưa có đơn hàng nào.</th></tr>
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