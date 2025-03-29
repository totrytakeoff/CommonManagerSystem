import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';
import type { Menu } from '@/types.ts';

import { useAllDataStore } from '@/stores/index.ts';
import { init } from 'echarts';

const staticRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/Main.vue'),
        redirect: '/home',
        children: [],
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('@/views/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: staticRoutes,
});

export function generateRoutes(menuList: Menu[]): RouteRecordRaw[] {
    const routes: RouteRecordRaw[] = [];

    menuList.forEach((menu) => {
        if (menu.url) {
            // 如果有 url 属性，说明这是一个有效的路由
            const route: RouteRecordRaw = {
                path: menu.path,
                name: menu.name,
                component: () => import(`@/views/${menu.url}.vue`),
            };
            routes.push(route);
        }

        // 如果有子菜单，递归生成子路由
        if (menu.children && menu.children.length > 0) {
            const childRoutes = generateRoutes(menu.children);
            routes.push(...childRoutes);
        }
    });

    return routes;
}

router.beforeEach(async (to, from, next) => {
    const store = useAllDataStore();
    const token = store.getToken;

    store.initializeState();
    // 如果用户未登录且访问的不是登录页面，则跳转到登录页面
    if (!token && to.path !== '/login') {
        return next('/login');
    }

    // 如果用户已登录但动态路由尚未加载，则加载动态路由
    if (
        token &&
        router.getRoutes().find((route) => route.name === 'main')?.children
            ?.length === 0
    ) {
        try {
            // 动态生成路由
            const dynamicRoutes = generateRoutes(store.getMenuList as Menu[]);
            const mainRoute = router
                .getRoutes()
                .find((route) => route.name === 'main');

            if (mainRoute) {
                // 将动态路由添加到 main 路由的 children 中
                mainRoute.children = dynamicRoutes;
                dynamicRoutes.forEach((route) => {
                    router.addRoute('main', route);
                });
            }

            // 重新触发导航，确保动态路由生效
            return next({ ...to, replace: true });
        } catch (error) {
            console.error('动态路由加载失败:', error);
            return next('/404');
        }
    }

    // 如果路由匹配成功，则继续导航
    if (to.matched.length > 0) {
        return next();
    }

    // 如果路由未匹配，则跳转到 404 页面
    return next('/404');
});

export default router;
