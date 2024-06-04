import './style.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index';
import { createPinia } from 'pinia';

import Vant from 'vant'
import 'vant/lib/index.css'

let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;
function setViewportUnits() {
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
}

// 在页面加载时调用该函数
window.addEventListener('load', setViewportUnits);
                        
const app = createApp(App); // Create the app instance
const pinia = createPinia(); // Create the Pinia instance

// Use Pinia and router with the app
app.use(pinia).use(router).use(Vant);

// Mount the app
app.mount('#app');
