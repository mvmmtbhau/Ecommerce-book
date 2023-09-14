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

const app = createApp(App);

registerGlobalComponent(app);

library.add(fas, far, fab);

app.use(router);
app.use(store);

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');


