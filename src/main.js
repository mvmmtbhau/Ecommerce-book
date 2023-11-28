import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';

import './assets/css/style.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {fas} from '@fortawesome/free-solid-svg-icons';
import {far}  from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';

import { registerGlobalComponent } from '@/utils/import';

import vuetify from "@/plugins/vuetify";
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App);

registerGlobalComponent(app);

library.add(fas, far, fab);

app.use(router);
app.use(store);
app.use(vuetify);
app.use(Vue3Toasity, {autoClose: 3000});
app.use( CKEditor )

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');


