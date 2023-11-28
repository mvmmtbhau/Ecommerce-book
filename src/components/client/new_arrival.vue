<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";

import productService from "@/services/product";
import { onBeforeMount, ref } from "vue";

const newProducts = ref()
const fetchNewProduct = async () => {
    try {
        const result = await productService.getNewProduct();
        if(result.status == 200) {
            newProducts.value = result.data.products;
        }
    } catch (e) {
        console.log()
    }
}

onBeforeMount(async () => {
    await fetchNewProduct();
})
;
</script>

<template>
    <div class="container pb-16 max-w-[80%]">
        <h2 class="text-2xl font-medium text-gray-800 uppercase mb-6">top new arrival</h2>
        <ProductCardComponent v-if="newProducts" :products="newProducts" sold="true" gridSettings="grid grid-cols-4 gap-6" />
    </div>
</template>