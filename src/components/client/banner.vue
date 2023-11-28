<script setup>
import { useRouter } from "vue-router";

const router = useRouter()

const move = () => {
    router.push({name: 'ShopPage'})
}
;
</script>

<template>
    <div @click="move()" class="bg-cover bg-no-repeat bg bg-center py-64 banner-img cursor-pointer">
        <div class="container max-w-[80%]">
            <h1 class="text-6xl text-gray-800 font-medium mb-4 capitalize">
               
            </h1>
            
            <div class="mt-10">
                
            </div>
        </div>
    </div>
</template>