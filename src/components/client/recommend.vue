<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";
</script>

<template>
    <div class="container max-w-[80%] mb-4">
        <a href="#" class="">
            <img src="../../assets/images/offer.jpg" class="w-full">
        </a>

        <div class="pt-6">
            <h2 class="text-2xl font-medium text-gray-800 uppercase mb-6">Recommend for you</h2>
            <!-- product grid -->
            <div class="grid grid-cols-4 gap-6">
                <!-- single product -->
                <ProductCardComponent />
            </div>
        </div>
    </div>
</template>