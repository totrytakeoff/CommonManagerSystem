import type { Menu } from '@/types.ts';
import { fa } from 'element-plus/es/locales.mjs';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { updateRoutes } from '@/router';
import { type RouteRecordRaw } from 'vue-router';
import router from '@/router';

export const useAllDataStore = defineStore('allData', () => {
    const isCollapse = ref(false);
    const tags = ref([
        {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 'home',
        },
    ]);
    let currentMenu = null;
    const menuList = ref<Menu[]>([]);
    const token = ref<string>('');
    // const routerList: any = [];

    function toggleCollapse() {
        isCollapse.value = !isCollapse.value;
    }

    function selectMenu(val: any) {
        if (val.name == 'home') {
            currentMenu = null;
        } else {
            currentMenu = val;

            //这里添加如果点击的不是home时，先找一下tags中是否存在点击的菜单
            let index = tags.value.findIndex((item) => item.name === val.name);
            //如果不存在则添加到tags中
            index === -1 ? tags.value.push(val) : '';
        }
    }

    function closeTag(val: any) {
        tags.value = tags.value.filter((item) => item.name !== val.name);
    }

    // 初始化时从 localStorage 恢复数据
    const initializeState = () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            console.log('Restored token:', storedToken);
            token.value = storedToken;
        } else {
            console.warn('No token found in localStorage');
        }

        const storedMenuList = localStorage.getItem('menuList');
        if (storedMenuList) {
            console.log('Restored menuList:', JSON.parse(storedMenuList));
            console.log('currentrouters!!!:', router.getRoutes());

            menuList.value = JSON.parse(storedMenuList);

            updateRoutes(menuList.value);

            // console.log('the main :',mainRoute);
            console.log('router22222:', router.getRoutes());
        } else {
            console.warn('No menuList found in localStorage');
        }
    };

    // 设置 token 并存储到 localStorage
    function setToken(val: string) {
        token.value = val;
        localStorage.setItem('token', val);
    }

    // 设置 menuList 并存储到 localStorage
    function setMenuList(val: any[]) {
        menuList.value = val;
        localStorage.setItem('menuList', JSON.stringify(val));
        updateRoutes(menuList.value);
    }

    // 计算属性：提供只读的 token 和 menuList
    const getToken = computed<string>(() => token.value);
    const getMenuList = computed<Menu[]>(() => menuList.value);

    return {
        tags,
        isCollapse,
        toggleCollapse,
        selectMenu,
        closeTag,
        setMenuList,
        setToken,
        getMenuList,
        getToken,
        initializeState,
    };
});
