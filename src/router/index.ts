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
    // {
    //     path: '/:pathMatch(.*)*',
    //     redirect: '/404',
    // }
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

export const updateRoutes = async (menuList: Menu[]) => {
    const dynamicRoutes = generateRoutes(menuList);
    console.log('Dynamic Routes:', dynamicRoutes);

    const mainRoute = router
        .getRoutes()
        .find((route: any) => route.name === 'main');
    if (!mainRoute) {
        console.warn('Main route not found');
        return;
    }

    // 清除旧的子路由
    if (mainRoute.children && mainRoute.children.length > 0) {
        mainRoute.children.forEach((child: any) => {
            router.removeRoute(`${child.name}`);
        });
    }

    console.log('mainRoute:', mainRoute);
    console.log('mainRoute.children:', mainRoute.children);
    // 更新主路由的 children
    mainRoute.children = dynamicRoutes;
    console.log('mainRoute.children2:', mainRoute.children);

    // // 注册新的动态路由
    // dynamicRoutes.forEach((route, index) => {
    //     router.addRoute('main', { ...route, name: `main-${route.name as string}` });
    // });

    console.log('Updated Main Route Children:', mainRoute.children);
    console.log('router=====:', router.getRoutes());

};

router.beforeEach(async (to, from, next) => {
    const store = useAllDataStore();
    const token = store.getToken;
    const menuList = store.getMenuList;

    console.log('Navigating to:', to.path);

    // 如果用户未登录且访问的不是登录页面，则跳转到登录页面
    if (!token && to.path !== '/login') {
        return next('/login');
    }

    // 如果用户已登录但动态路由尚未加载，则加载动态路由
    if (
        token &&
        menuList.length > 0 &&
        router.getRoutes().find((route) => route.name === 'main')?.children
            ?.length === 0
    ) {
        try {
            console.log('Loading dynamic routes...');
            await updateRoutes(menuList);

            // 如果目标路由未匹配，则重新触发导航
            if (to.matched.length === 0) {
                return next({ ...to, replace: true });
            }
        } catch (error) {
            console.error('Failed to load dynamic routes:', error);
            return next('/404');
        }
    }

    // 如果路由匹配成功，则继续导航
    if (to.matched.length > 0) {
        console.log('Route matched successfully:', to.matched);
        return next();
    }
    console.log('to.matched:', to.matched);
    console.log('next', next);
    // 如果路由未匹配，则跳转到 404 页面
    console.warn('No matching route found for path:', to.path);
    return next('/404');
});


// router.beforeEach(async (to, from, next) => {
//     const store = useAllDataStore();
//     const token = store.getToken;

//     console.log('TO', to, from, next);

//     // store.initializeState();
//     // 如果用户未登录且访问的不是登录页面，则跳转到登录页面
//     if (!token && to.path !== '/login') {
//         return next('/login');
//     }

//     // 如果用户已登录但动态路由尚未加载，则加载动态路由
//     if (
//         token &&
//         router.getRoutes().find((route) => route.name === 'main')?.children
//             ?.length === 0
//     ) {
//         try {
//             // 动态生成路由
//             console.log('如果用户已登录但动态路由尚未加载，则加载动态路由');
//             await updateRoutes(store.getMenuList);

//             // 重新触发导航，确保动态路由生效
//             return next({ ...to, replace: true });
//         } catch (error) {
//             console.error('动态路由加载失败:', error);
//             return next('/404');
//         }
//     }
//     console.log('tototo', to);

//     // 如果路由匹配成功，则继续导航
//     if (to.matched.length > 0) {
//         console.log('如果路由匹配成功，则继续导航');
//         console.log('to.matched:', to.matched);
//         console.log('next', next);

//         return next();
//     }

//     // 如果路由未匹配，则跳转到 404 页面
//     return next('/404');
// });

export default router;
