<script setup>
import { computed } from "vue"
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";

import cartService from "@/services/cart"
import wishlistService from "@/services/wishlist"
import userService from "@/services/user"

import Swal from "sweetalert2";

const store = useStore();
const router = useRouter()
const route = useRoute()

const showLoading = (event = 0, time = 2000) => {
  new Swal({
    text: 'Đợi một chút nhé!',
    allowEscapeKey: false,
    allowOutsideClick: false,
    icon: 'info',
    timer: time,
    showCancelButton: false,
    showConfirmButton: false
  })
  if (event == 0) {
    Swal.showLoading();
  } else {
    Swal.close()
  }
}

// store.dispatch('user/setUser', null)
// store.dispatch('cart/setCart', null)
// localStorage.removeItem('token-hau');

const getCurrentUser = async () => {
  const token = localStorage.getItem("token-hau") || null;
  try {
    if (token) {
      showLoading(0, 10000);
      const decoded = jwtDecode(token);

      store.dispatch('user/setUser', decoded);

      if (store.state.user.user?.role == 'user') {
        await getCart(store.state.user.user?._id);
        await getWishlist(store.state.user.user?._id);
      }
      showLoading(1);

      if (store.state.user.user?.role == 'user' && (location.pathname == '/login' || location.pathname == '/register')) {
        router.push({
          name: 'HomePage',
        });
      }

      if (store.state.user.user?.role == 'admin') {
        router.push({
          name: 'AdminDashboard',
        })
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const getCart = async (id) => {
  try {
    const result = await cartService.getCart(id);
    if (result.status == 200) {
      store.dispatch('cart/setCart', result.data.cart);
    }
  } catch (err) {
    console.log(err);
  }
}

const getWishlist = async (id) => {
  try {
    const result = await wishlistService.getWishlist(id);
    if (result.status == 200) {
      store.dispatch('wishlist/setWishlist', result.data.wishlist);
    }
  } catch (err) {
    console.log(err);
  }
}

onBeforeMount(() => {
  getCurrentUser();
})


const layout = computed(() => (route.meta.layout) + '-layout');

</script>

<template>
  <component :is="layout">
    <router-view :key="this.$route.fullPath"></router-view>
  </component>
</template>
