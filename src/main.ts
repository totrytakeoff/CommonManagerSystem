import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import '@/assets/less/index.less';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import '@/api/mock.ts';

import { useAllDataStore } from '@/stores/index.ts';
import { ro } from 'element-plus/es/locales.mjs';

const app = createApp(App);

app.use(createPinia());
const store = useAllDataStore();
app.use(router);

app.use(ElementPlus);


console.log('currut###111:', router.getRoutes());
store.initializeState();

// if(store.getToken){
//     router.push('/');
// }else{
//     router.push('/login');

// }

console.log('currut###222:', router.getRoutes());

app.mount('#app');
//引入element-plus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
