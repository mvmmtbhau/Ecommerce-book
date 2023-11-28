<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { publicImageAvatar} from "@/constants/"

import userService from '@/services/user';
import { useStore } from "vuex";
import { Form, Field, ErrorMessage } from "vee-validate";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"
import ky from "ky";

const route = useRoute();
const router = useRouter();
const store = useStore();
const userId = ref();

const showForm = ref();

const fullName = ref();
const image = ref();

let timeOut;
let timer = 300;

const fullAddress = ref()
const province = ref();
const district = ref();
const ward = ref();
const detailAddress = ref();

const newAddress = ref(false);

const provinces = ref(null);
const districts = ref(null);
const wards = ref(null);

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
    if (event == 0) {
        Swal.showLoading()
    } else {
        Swal.close()
    }
}

const fetchProvinces = async () => {
    const result = await ky.get(`https://provinces.open-api.vn/api/p/`).json()
    provinces.value = result;
}

const fetchDistricts = async (provinceCode) => {
    if (provinceCode) {
        fullAddress.value = '';
        district.value = '';
        ward.value = '';
        wards.value = null;
        showLoading();
        const result = await ky.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).json()
        fullAddress.value = province.value.name;
        districts.value = result;
        showLoading(1);
    }
}

const fetchWards = async (districtCode) => {
    if (districtCode) {
        fullAddress.value = province.value.name;
        showLoading();
        const result = await ky.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).json()
        fullAddress.value = district.value.name + ', ' + fullAddress.value;
        wards.value = result;
        showLoading(1);
    }
}

const setFullAddress = () => {
    fullAddress.value = district.value.name + ', ' + ward.value.name + ', ' + province.value.name;
    fullAddress.value = detailAddress.value + ', ' + fullAddress.value;
}

const getOldAddress = () => {
    newAddress.value = false;
    province.value = null;
    district.value = null;
    ward.value = null;
    detailAddress.value = null;
    fullAddress.value =
        store.state.user?.user?.address + ', ' +
        store.state.user?.user?.ward.name + ', ' +
        store.state.user?.user?.district.name + ', ' +
        store.state.user?.user?.province.name;
}

const showImage = (e) => {
    let divWrap = document.getElementById('showImg');
    let imgShow = document.getElementById('imageShow');
    if (imgShow) imgShow.remove();

    let typeFile = image.value.type;
    const arr = typeFile.split('/');

    if (!arr[1] == 'png' || !arr[1] == 'jpeg' || !arr[1] == 'jpg') {
        image.value = null;
        e.target.value = null;
        return Swal.fire({
            icon: 'warning',
            title: "Chỉ được đăng tải những file có đuôi như png, jpeg, jpg"
        });
    }
    let img = document.createElement('img');
    img.className = 'rounded-full w-60 h-60 object-cover';
    img.src = URL.createObjectURL(image.value);
    img.id = 'imageShow'

    divWrap.appendChild(img);
}

const showFormProfile = () => {
    fullName.value = store.state.user?.user?.fullName;
    showForm.value = 0;
}

const closeShowForm = () => {
    showForm.value = null; fullName.value = null; image.value = null
}

const updateProfile = async () => {
    clearTimeout(timeOut);
    showLoading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            let formData = new FormData();

            formData.append("fullName", fullName.value);
            formData.append("avatar", image.value);
            formData.append("id", store.state.user?.user?._id)

            const result = await userService.updateProfile(formData);
            showLoading(1);
            closeShowForm();
            if (result.status == 201) {
                console.log(jwtDecode(result.data.user))
                localStorage.setItem("token-hau", result.data.user)
                store.dispatch('user/setUser', jwtDecode(result.data.user));
                
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
            console.log()
        }
    }, timer)
}

const updateAddress = async (province, district, ward, address) => {
    clearTimeout(timeOut);
    showLoading(0, 10000);
    timeOut = setTimeout(async () => {
        try {
            const result = await userService.updateAddress(store.state.user?.user?._id,
                {
                    province: (!province ? store.state.user?.user?.province : province),
                    district: (!district ? store.state.user?.user?.district : district),
                    ward: (!ward ? store.state.user?.user?.ward : ward),
                    address: (!address ? store.state.user?.user?.address : address),
                })

            showLoading(1);
            closeShowForm();
            if (result.status == 201) {
                localStorage.setItem("token-hau", result.data.user)
                store.dispatch('user/setUser', jwtDecode(result.data.user));
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
            getOldAddress();
        } catch (e) {
            console.log(e);
        }
    }, timer);
}

onBeforeMount(async () => {
    if (store.state.user?.user?.address &&
        store.state.user?.user?.ward &&
        store.state.user?.user?.district &&
        store.state.user?.user?.province.name) {
        getOldAddress()
    } else {
        newAddress.value = true;
    }
    await fetchProvinces();
})

watch(province, async () => {
    if (province.value) {
        await fetchDistricts(province.value.code)
    }
})

watch(district, async () => {
    if (district.value) {
        await fetchWards(district.value.code)
    }

})

watch(ward, () => {
    if (ward.value) {
        fullAddress.value = district.value.name + ', ' + province.value.name;
        if (ward.value) {
            fullAddress.value = ward.value.name + ', ' + fullAddress.value;
        }
        if (detailAddress.value) {
            fullAddress.value = detailAddress.value + ', ' + fullAddress.value;
        }
    }
})
    ;

</script>

<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <!-- single card -->
            <div class="shadow-lg rounded bg-white px-4 pt-6 pb-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-medium text-gray-800 text-lg capitalize">Personal profile</h3>
                    <p @click="showFormProfile()" class="text-red-500 hover:text-black transition cursor-pointer">Edit</p>
                </div>

                <div class="space-y-1">
                    <h4 class="text-gray-700 font-medium">{{ store.state.user?.user?.fullName }}</h4>
                    <p class="text-gray-800">{{ store.state.user?.user?.email }}</p>
                </div>
            </div>

            <div  class="shadow-lg rounded bg-white px-4 pt-6 pb-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-medium text-gray-800 text-lg capitalize">Shipping address</h3>
                    <p @click="showForm = 1" class="text-red-500 hover:text-black transition cursor-pointer">Edit</p>
                </div>

                <div v-if="store.state.user?.user?.address" class="space-y-1">
                    <h4 class="text-gray-700 flex gap-1 item-center">
                        <p class="font-medium">Tỉnh thành: </p>
                        <p>{{ store.state.user?.user?.province.name }}</p>
                    </h4>
                    <h4 class="text-gray-700 flex gap-1 item-center">
                        <p class="font-medium">Quận huyện: </p>
                        <p>{{ store.state.user?.user?.district.name }}</p>
                    </h4>
                    <h4 class="text-gray-700 flex gap-1 item-center">
                        <p class="font-medium">Phường xã: </p>
                        <p>{{ store.state.user?.user?.ward.name }}</p>
                    </h4>
                    <h4 class="text-gray-700 flex gap-1 item-center">
                        <p class="font-medium">Địa chỉ: </p>
                        <p>{{ store.state.user?.user?.address }}</p>
                    </h4>
                </div>
                <span v-else class="">Chưa có địa chỉ giao hàng</span>
            </div>
        </div>
        <div v-if="showForm == 0 || showForm == 1" class="grid grid-cols-2 gap-4 mt-10">
            <form v-if="showForm == 0" class="shadow-lg rounded bg-white px-4 pt-6 pb-8">
                <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên của
                    bạn</label>
                <div class="flex mb-5">
                    <span
                        class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                    </span>
                    <input type="text" id="website-admin" v-model="fullName"
                        class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Bonnie Green">
                </div>
                <div v-if="store.state.user?.user?.typeLogin == 'local'" class="mb-5">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">
                        Hình đại diện
                    </label>
                    <Field @change="showImage($event)" v-model="image" name="image"
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                </div>
                <div class="flex gap-2">
                    <span @click="updateProfile()" class="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Cập nhật
                    </span>
                    <span @click="closeShowForm()" class="text-white cursor-pointer bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Hủy
                    </span>
                </div>
            </form>
            <div v-if="showForm == 0" id="showImg" class="w-full h-full flex items-center justify-center">
                <img id="imageShow" v-if="store.state.user?.user.typeLogin == 'google'" :src="store.state.user?.user.avatar"
                    referrerpolicy="no-referrer" class="rounded-full w-60 h-60 object-cover">
                <div v-else>
                    <img id="imageShow" v-if="store.state.user?.user?.avatar"
                        :src="publicImageAvatar + store.state.user?.user.avatar"
                        class="rounded-full w-60 h-60 object-cover">
                    <img id="imageShow" v-else src="../../assets/images/noavatar.png"
                        class="rounded-full w-60 h-60 object-cover">
                </div>
            </div>
            <div v-if="showForm == 1" class="col-span-2 shadow-lg rounded bg-white px-4 pt-6 pb-8">
                <div v-if="newAddress" class="space-y-4">
                    <button v-if="(store.state.user?.user?.address &&
                        store.state.user?.user?.ward &&
                        store.state.user?.user?.district &&
                        store.state.user?.user?.province.name)" @click="getOldAddress" class="text-blue-700 hover:text-white border border-black hover:bg-blue-800 focus:ring-4 
                    focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                    dark:focus:ring-blue-800 flex items-center gap-2">
                        Dùng địa chỉ cũ
                    </button>
                    <div class="flex items-center gap-4">
                        <div class="w-1/3">
                            <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Tỉnh thành
                            </label>
                            <select v-model="province" id="province" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                         dark:focus:border-blue-500">
                                <option v-for="(pro, index) in provinces" :key="index"
                                    :value="{ name: pro.name, code: pro.code }">
                                    {{ pro.name }}
                                </option>
                            </select>
                        </div>
                        <div class="w-1/3" v-if="province && districts != null">
                            <label for="district" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Quận huyện
                            </label>
                            <select v-model="district" id="district" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                         dark:focus:border-blue-500">
                                <option v-for="(dis, index) in districts?.districts" :key="index"
                                    :value="{ name: dis.name, code: dis.code }">
                                    {{ dis.name }}
                                </option>
                            </select>
                        </div>
                        <div class="w-1/3" v-if="district && wards != null">
                            <label for="ward" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Phường xã
                            </label>
                            <select v-model="ward" id="ward" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                         dark:focus:border-blue-500">
                                <option v-for="(war, index) in wards?.wards" :key="index"
                                    :value="{ name: war.name, code: war.code }">
                                    {{ war.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div v-if="ward" class="">
                        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Chi tiết địa chỉ
                        </label>
                        <input v-model="detailAddress" @blur="setFullAddress" type="text"
                            class="w-full border border-gray-400 rounded-lg" placeholder="Nhập chi tiết địa chỉ">
                    </div>
                </div>
                <div v-else>
                    <button @click="newAddress = true; fullAddress = ''" class="text-blue-700 hover:text-white border border-black hover:bg-blue-800 focus:ring-4 
                    focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                    dark:focus:ring-blue-800 flex items-center gap-2">
                        <font-awesome-icon :icon="['fas', 'plus']" /> Địa chỉ mới
                    </button>
                </div>
                <div class="h-[1px] bg-gray-300 mt-10"></div>

                <!-- Địa chỉ giao hàng -->
                <div class="flex justify-between font-medium py-3 uppercase">
                    <p class="font-semibold">Địa chỉ giao hàng:</p>
                </div>
                <div class="flex justify-between py-3 mb-4">
                    <p class="font-semibold text-xs break-words">
                        {{ fullAddress }}
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <span @click="updateAddress(province, district, ward, detailAddress)" class="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Cập nhật
                    </span>
                    <span @click="showForm = null; getOldAddress()" class="text-white cursor-pointer bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Hủy
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>