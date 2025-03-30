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

const app = createApp(App);

app.use(createPinia());

app.use(ElementPlus);

const store = useAllDataStore();
store.initializeState();

console.log('currut:', router.getRoutes());
app.use(router);
console.log('currut:', router.getRoutes());

app.mount('#app');
//引入element-plus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
