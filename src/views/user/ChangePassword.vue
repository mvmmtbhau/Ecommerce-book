<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { publicImageAvatar } from "@/constants/"

import userService from '@/services/user';
import { useStore } from "vuex";
import { Form, Field, ErrorMessage } from "vee-validate";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"
import * as yup from "yup";
import ky from "ky";

const route = useRoute();
const router = useRouter();
const store = useStore();

const old = ref();
const showOld = ref(false);
const newP = ref();
const showNew = ref(false);
const confirmNew = ref();
const showConfirm = ref(false);

let timeOut;
let timer = 300;

const showLoading = (event = 0, time = 2000, text = 'Đợi một chút...') => {
    new Swal({
        text: text,
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'info',
        timer: time,
        showCancelButton: false,
        showConfirmButton: false
    })
    if (event == 0) {
        Swal.showLoading()
    } else {
        Swal.close()
    }
}

const changePasswordForm = yup.object().shape({
    old: yup
        .string()
        .required("Xin nhập vào trường này"),
    new: yup
        .string()
        .required("Xin nhập vào trường này"),
    confirmNew: yup
        .string()
        .required("Xin nhập vào trường này")
        .oneOf([yup.ref('new'), null], 'Mật khẩu không khớp')
});

const updatePassword = async () => {
    clearTimeout(timeOut);
    showLoading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await userService.updatePassword(store.state.user?.user?._id, { old: old.value, newP: newP.value })
            showLoading(1);
            if (result.status == 201) {
                Swal.fire({
                    icon: "success",
                    title: result.data.msg
                })
            }

            if (result.status == 203) {
                Swal.fire({
                    icon: "error",
                    title: result.data.msg
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, timer);
}

onBeforeMount(async () => {

})

    ;

</script>

<template>
    <div>
        <h1 class="text-2xl uppercase font-medium text-center mb-5">Thay đổi mật khẩu</h1>
        <Form @submit="updatePassword()" autocomplete="off" :validation-schema="changePasswordForm"
            class="max-w-sm mx-auto">
            <div class="mb-5">
                <label for="old" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu cũ</label>
                <div class="relative">
                    <Field name="old" :type="showOld ? 'text' : 'password'" id="old" v-model="old"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    <font-awesome-icon v-if="showOld" @click="showOld = false" :icon="['fas', 'eye']"
                        class="absolute top-3 right-4 cursor-pointer" />
                    <font-awesome-icon v-else @click="showOld = true" :icon="['fas', 'eye-slash']"
                        class="absolute top-3 right-4 cursor-pointer" />
                </div>
                <ErrorMessage class="error-message" name="old" />
            </div>
            <div class="mb-5">
                <label for="new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Mật khẩu mới
                </label>
                <div class="relative">
                    <Field name="new" :type="showNew ? 'text' : 'password'" id="new" v-model="newP"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    <font-awesome-icon v-if="showNew" @click="showNew = false" :icon="['fas', 'eye']"
                        class="absolute top-3 right-4 cursor-pointer" />
                    <font-awesome-icon v-else @click="showNew = true" :icon="['fas', 'eye-slash']"
                        class="absolute top-3 right-4 cursor-pointer" />
                </div>
                <ErrorMessage class="error-message" name="new" />
            </div>
            <div class="mb-5">
                <label for="confirmNew" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nhập lại mật khẩu mới
                </label>
                <div class="relative">
                    <Field name="confirmNew" :type="showConfirm ? 'text' : 'password'" id="confirmNew" v-model="confirmNew"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    <font-awesome-icon v-if="showConfirm" @click="showConfirm = false" :icon="['fas', 'eye']"
                        class="absolute top-3 right-4 cursor-pointer" />
                    <font-awesome-icon v-else @click="showConfirm = true" :icon="['fas', 'eye-slash']"
                        class="absolute top-3 right-4 cursor-pointer" />
                </div>
                <ErrorMessage class="error-message" name="confirmNew" />
            </div>
            <button type="submit"
                class="text-white mr-4 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                Cập nhật
            </button>
        </Form>

    </div>
</template>