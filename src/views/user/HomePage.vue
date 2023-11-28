<script setup>
import BannerComponent from "@/components/client/banner.vue";
import FeatureComponent from "@/components/client/feature.vue";
import CategoriesComponent from "@/components/client/categories.vue";
import NewArrivalComponent from "@/components/client/new_arrival.vue";
import RecommendComponent from "@/components/client/recommend.vue";

import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { jwtDecode } from "jwt-decode";
import { useStore } from "vuex";

import cartService from "@/services/cart";
import wishlistService from "@/services/wishlist";

const route = useRoute();
const router = useRouter();
const store = useStore();

onBeforeMount(() => {
    if (route.query?.valid) {
        const token = route.query.valid;
        localStorage.setItem("token-hau", token);

        const decoded = jwtDecode(token);
        store.dispatch('user/setUser', decoded);

        const cart = async (id) => {
            try {
                const result = await cartService.getCart(id);
                if (result.status == 200) {
                    store.dispatch('cart/setCart', result.data.cart);
                }
            } catch (err) {
                console.log(err);
            }
        }

        const wishlist = async (id) => {
            try {
                const result = await wishlistService.getWishlist(id);
                if (result.status == 200) {
                    store.dispatch('wishlist/setWishlist', result.data.wishlist);
                }
            } catch (err) {
                console.log(err);
            }
        }
        cart(store.state.user?.user._id);
        wishlist(store.state.user?.user._id);
        router.replace('/');
    }
})


    ;
</script>

<template>
    <div>
        <BannerComponent />
        <FeatureComponent />
        <NewArrivalComponent />
        <RecommendComponent />
    </div>
</template>