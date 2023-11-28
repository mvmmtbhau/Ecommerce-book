import wishlistService from "@/services/wishlist";

import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';

export default function () {
    const store = useStore();
    const router = useRouter();

    const addWishlist = async (idWish, idPro, idCart) => {
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
            const result = await wishlistService.addNew(idWish, {idPro, idCart,});
            return result;
        } catch (e) {
            console.log(e)
        }
    }

    return {
        addWishlist,
    }

}