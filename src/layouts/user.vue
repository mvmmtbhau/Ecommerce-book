<script setup>
import HeaderComponent from "@/components/client/header.vue"
import NavbarComponent from "@/components/client/navbar.vue"
import FooterComponent from "@/components/client/footer.vue"
import CopyrightComponent from "@/components/client/copyright.vue"
</script>

<template>
    <div class="">
        <HeaderComponent />
        <NavbarComponent />
        <slot />
        <FooterComponent />
        <CopyrightComponent />
    </div>
</template>