<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";
import productService from "@/services/product";
import categoryService from "@/services/category";

import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const products = ref();
const categories = ref();

const pageNumber = ref(1);
const pages = ref();
const perPage = 9;

const routeQuery = ref();

const fetchCategories = async () => {
    try {
        const result = await categoryService.getCategories();
        if (result.status == 200) categories.value = result.data.data;
    } catch (err) {
        console.log(err);
    }
}

const fetchProducts = async () => {
    products.value = ''
    try {
        const result = await productService.getProducts(perPage, pageNumber.value, routeQuery.value.category, routeQuery.value.sortCode, routeQuery.value.search);

        if (result.status == 200) {
            products.value = result.data.products
            pages.value = result.data.totalPage;
        };
    } catch (err) {
        console.log(err);
    }
}

const addNewQuery = (newQuery) => {
    router.push({
        name: 'ShopPage',
        query: { ...routeQuery.value, ...newQuery }
    })
}

onBeforeMount(async () => {
    routeQuery.value = route.query;
    await fetchCategories();
    await fetchProducts();
})

watch(pageNumber, () => {
    fetchProducts();
})

watch(routeQuery, () => {
    // console.log(routeQuery.value)
})
    ;
</script>

<template>
    <div class="container max-w-[80%]">
        <!-- breadcrums -->
        <div class="py-4 flex items-center gap-3">
            <router-link to="/" class="text-primary text-base">
                <font-awesome-icon :icon="['fas', 'house']" />
            </router-link>
            <span class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <router-link v-if="route.query.category && (route.query.category != 'undefined' || !route.query.category)"
                to="/shop" class="text-primary font-bold">
                Cửa hàng
            </router-link>
            <p v-else class="text-gray-600 font-medium">Cửa hàng</p>
            <span v-if="route.query.category && (route.query.category != 'undefined' || !route.query.category)"
                class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <p v-if="route.query.category && (route.query.category != 'undefined' || !route.query.category) && categories"
                class="text-gray-600 font-medium">
                {{ categories.filter(cate => cate._id == route.query.category)[0].title }}
            </p>
        </div>

        <!-- shop wrapper -->
        <div class="container grid grid-cols-4 gap-6 pt-4 pb-16 items-start">
            <!-- sidebar -->
            <div v-if="categories" class="col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hidden">
                <div class="divide-y divide-gray-200 space-y-5">
                    <!-- category filter -->
                    <div class="">
                        <h3 class="text-xl mt-2 text-gray-800 mb-3 uppercase font-medium">Danh mục</h3>
                        <div class="space-y-2">
                            <!-- single category -->
                            <div class="flex items-center">
                                <router-link to="/shop" for="cat-1" class="text-gray-600 ml-3 cursor-pointer">
                                    Tất cả sản phẩm
                                </router-link>
                            </div>
                            <div :class="[(route.query.category && route.query.category == category._id) ? 'text-primary font-medium' : '']"
                                class="flex items-center text-gray-600 hover:text-primary"
                                v-for="(category, index) in categories" :key="index">
                                <router-link :to="{name: 'ShopPage', query: {category: category._id}}"  for="cat-1"
                                    class=" ml-3 cursor-pointer">{{ category.title }}</router-link>
                                <div class="ml-auto  text-sm">({{ category.num }})</div>
                            </div>
                        </div>
                    </div>

                    <div class="">
                        <h3 class="text-xl mt-2 text-gray-800 mb-3 uppercase font-medium">Lưa chọn khác</h3>
                        <div class="space-y-2 ">
                            <!-- sort -->
                            <div class="text-gray-600 hover:text-primary"
                                :class="[(route.query.sortCode && route.query.sortCode == 1) ? 'text-primary font-medium' : '']">
                                <span @click="addNewQuery({ sortCode: 1 })" for="cat-1" class=" ml-3 cursor-pointer">
                                    Sản phẩm mới
                                </span>
                            </div>
                            <div class="text-gray-600 hover:text-primary"
                                :class="[(route.query.sortCode && route.query.sortCode == 2) ? 'text-primary font-medium' : '']">
                                <span @click="addNewQuery({ sortCode: 2 })" for="cat-1" class=" ml-3 cursor-pointer">
                                    Giá thấp
                                </span>
                            </div>
                            <div class="text-gray-600 hover:text-primary"
                                :class="[(route.query.sortCode && route.query.sortCode == 3) ? 'text-primary font-medium' : '']">
                                <span @click="addNewQuery({ sortCode: 3 })" for="cat-1" class=" ml-3 cursor-pointer">
                                    Giá cao
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div v-else class="container max-w-[80%] mt-10">
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </div>

            <!-- products -->
            <div class="col-span-3">
                <div class="flex items-center mb-4">
                    <div class="flex items-center gap-2 text-xl font-medium text-primary uppercase">
                        <p v-if="route.query.search && (route.query.search != 'undefined' || !route.query.search)"
                            class="">
                            Kết quả tìm kiếm: {{ route.query.search }}
                        </p>
                        <p v-else-if="route.query.category && (route.query.category != 'undefined' || !route.query.category) && categories"
                            class="">
                            {{ categories.filter(cate => cate._id == route.query.category)[0].title }}
                        </p>
                        <span v-else-if="route.query.sortCode && (route.query.sortCode != 'undefined' || !route.query.sortCode)"
                            class="flex items-center gap-2">
                            <p>-</p>
                            <p v-if="route.query.sortCode == 1">Sản phẩm mới</p>
                            <p v-if="route.query.sortCode == 2">Giá thấp</p>
                            <p v-if="route.query.sortCode == 3">Sản giá cao</p>
                        </span>
                        <span v-else>Tất cả sản phẩm</span>
                    </div>

                    <!-- grid products -->
                    <div class="flex gap-2 ml-auto">
                        <div
                            class="border border-primary w-10 h-9 flex items-center justify-center text-white bg-primary rounded cursor-pointer">
                            <font-awesome-icon :icon="['fas', 'grip-vertical']" />
                        </div>
                        <div
                            class="border border-gray-300 w-10 h-9 flex items-center justify-center text-gray-600 rounded cursor-pointer">
                            <font-awesome-icon :icon="['fas', 'grip']" />
                        </div>
                    </div>
                </div>

                <ProductCardComponent v-if="products" :products="products" gridSettings="grid grid-cols-3 gap-6" />
                <div v-else class="container max-w-[80%] mt-10">
                    <v-skeleton-loader type="card-avatar"></v-skeleton-loader>
                </div>
                <div class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                    aria-label="Table navigation">
                    <v-pagination v-model="pageNumber" :length="pages" :total-visible="4"></v-pagination>
                </div>
            </div>
        </div>
    </div>
</template>