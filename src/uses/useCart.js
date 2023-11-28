import cartService from "@/services/cart";

import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default function () {
    const store = useStore();
    const router = useRouter();

    const addToCart = async (idCart, idPro, quantity = 1) => {
        if (!store.state.user?.user) {
            Swal.fire({
                title: 'Bạn chưa đăng nhập vào ứng dụng',
                icon: 'info',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Hủy',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push({ name: 'Login' })
                }
            })
            return;
        }
        try {
            const result = await cartService.addProductToCart(idCart, { idPro, quantity });
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        addToCart,
    }

}