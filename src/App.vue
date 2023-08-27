<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router";

const route = useRoute();

const layout = computed(() => (route.meta.layout) + '-layout');

</script>

<template>
  <component :is="layout">
    <router-view :key="this.$route.fullPath"></router-view>
  </component>
</template>
