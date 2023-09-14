<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";

const newProducts = ['product_1', 'product_2', 'product_3', 'product_4']
</script>

<template>
    <div class="container pb-16 max-w-[80%]">
        <h2 class="text-2xl font-medium text-gray-800 uppercase mb-6">top new arrival</h2>
        <ProductCardComponent :newProducts="newProducts" gridSettings="grid grid-cols-4 gap-6" />
    </div>
</template>