<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";
import productService from "@/services/product";
import { onBeforeMount, ref } from "vue";

const recommendProduct = ref();

const fetchProducts = async () => {
    try {
        const result = await productService.getRecommend();
        if (result.status == 200) {
            recommendProduct.value = result.data.products;
        }
    } catch (e) {
        console.log(e);
    }
}

onBeforeMount(async () => {
    await fetchProducts();
})

    ;
</script>

<template>
    <div class="container max-w-[80%] mb-4">
        <a href="#" class="">
            <!-- <img src="../../assets/images/offer.jpg" class="w-full"> -->
        </a>

        <div class="pt-6">
            <h2 class="text-2xl font-medium text-gray-800 uppercase mb-6 hover:text-primary cursor-pointer">Sản phẩm bán
                chạy</h2>
            <!-- product grid -->

            <ProductCardComponent v-if="recommendProduct" :products="recommendProduct" gridSettings="grid grid-cols-4 gap-6" />
        </div>
    </div>
</template>