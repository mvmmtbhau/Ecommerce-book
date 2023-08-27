<script setup>
import categoryService from '@/services/category';

const get = async () => {
    const data = await categoryService.getCategories();

    console.log(data);
};

get();

</script>

<template>
    <div>Hello from admin</div>
</template>