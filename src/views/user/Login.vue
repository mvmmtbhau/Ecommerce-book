<script setup>
import userService from '@/services/user';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import {jwtDecode } from "jwt-decode";

import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter()
const store = useStore();

const email = ref();
const password = ref();

let timeOut;
const timer = 300;

const loginGoogle = async () => {
    try {
        let oauthUrl = 'http://localhost:3000/api/auth/google';
        window.open(oauthUrl, '_self');
    } catch (err) {
        console.log(err)
    }
}

const signInForm = yup.object().shape({
    email: yup
        .string().email('example@example.com')
        .required("Xin nhập vào trường này"),
    password: yup
        .string()
        .required("Xin nhập vào trường này")
});

const showLoading = (event = 0, time = 2000) => {
    new Swal({
        text: 'Đợi một chút...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'info',
        timer: time,
        showCancelButton: false,
        showConfirmButton: false
    })
    if(event == 0) {
        Swal.showLoading();
    } else {
        Swal.close()
    }
}

const signIn = async () => {
    showLoading(0, 10000);
    try {
        const data = {
            email: email.value,
            password: password.value
        }

        const result = await userService.signIn(data);
        showLoading(1);
        if(result.status == 202) {
            Swal.fire({
                icon : 'error',
                text: result.data.msg
            })
        }

        if (result.status == 201) {
            const token = await result.data.profile;
            localStorage.setItem("token-hau", token);

            const decoded = jwtDecode(token);

            store.dispatch('user/setUser', decoded);
            
            location.href = '/'
        }
    } catch (err) {
        console.log(err)
    }
}



const handleSignIn = () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
        console.log('here')
        signIn();
    }, timer)
}

watch([ email, password], () => {
    let errorText = document.getElementById('errorText');
    if (errorText) errorText.remove();
})
    ;
</script>

<template>
    <div class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-4">
            <div class="md:w-1/2 px-16">
                <div class="flex items-center justify-between">
                    <h2 class="font-bold text-2xl text-[#002d74]">Đăng nhập</h2>
                    <router-link to="/" class="hover:text-primary">Trang chủ</router-link>
                </div>
                <p class="text-sm mt-4 text-[#002d74]">Bạn có tài khoản, hãy đăng nhập.</p>
                <span class=" text-red break-words" id="errorDiv"></span>

                <Form @submit="handleSignIn()" autocomplete="off" :validation-schema="signInForm" class="flex flex-col gap-4 mt-2">
                    <Field v-model="email" class="py-2 px-4 rounded-lg border w-full" type="text" name="email"
                        placeholder="Email của bạn" />
                    <ErrorMessage class="error-message" name="email" />

                    <Field v-model="password" class="py-2 px-4 rounded-lg border w-full" type="password" name="password"
                        placeholder="Mật khẩu của bạn" />
                    <ErrorMessage class="error-message" name="password" />

                    <button class="bg-[#002d74] rounded-lg text-white py-2 hover:scale-105 duration-300 transition">
                        Đăng nhập
                    </button>
                </Form>

                <div class="mt-10 grid grid-cols-3 items-center text-gray-500">
                    <hr class="border-gray-500">
                    <p class="text-center">Hoặc</p>
                    <hr class="border-gray-500">
                </div>

                <button @click="loginGoogle()"
                    class="bg-white border py-2 w-full rounded-lg mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 transition">
                    <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                        preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
                        <path fill="#4285F4"
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027">
                        </path>
                        <path fill="#34A853"
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1">
                        </path>
                        <path fill="#FBBC05"
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782">
                        </path>
                        <path fill="#EB4335"
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251">
                        </path>
                    </svg>
                    <p>Đăng nhập với Google</p>
                </button>

                <p class="mt-5 text-xs border-b border-gray-400 py-4">Bạn quên mật khẩu?</p>

                <div class="text-xs flex justify-between items-center mt-3">
                    <p>Nếu bạn chưa có tài khoản?</p>
                    <button @click="$router.push({ name: 'Register' })" class="py-2 px-5 bg-white border rounded-lg">Đăng
                        ký</button>
                </div>
        </div>



        <div class="w-1/2 p-5 md:block hidden">
            <img src="../../assets/images/login.avif" class="rounded-2xl">
        </div>
    </div>
</div></template>