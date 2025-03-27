<template>
    <el-aside :width="asideWidth">
        <el-menu 
            background-color="#545c64"
            text-color="#fff"
            :collapse=isCollapse
            :collapse-transition="true"
            >
            <h3 v-show="!isCollapse">
                通用后台管理系统
            </h3>
            <h3 v-show="isCollapse">
                后台
            </h3>

            <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path">
                <!-- <el-icon :name="item.icon"></el-icon> -->
                <component class="icon" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>

            <el-sub-menu v-for="item in hasChildren" :key="item.path" :index="item.path">
               
                <template #title>
                    <component class="icon" :is="item.icon"></component>
                    <span>{{ item.label }}</span>
                </template>


                <el-menu-item-group>
                    <el-menu-item v-for="(subItem, subIdx) in item.children" :key="subItem.path" :index="subItem.path">
                        <component class="icon" :is="subItem.icon"></component>
                        <span>{{ subItem.label }}</span>

                    </el-menu-item>
                </el-menu-item-group>

            </el-sub-menu>


        </el-menu>
    </el-aside>


</template>



<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAllDataStore } from '@/stores'

const list = ref([
    {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'house',
        url: 'Home'
    },
    {
        path: '/mall',
        name: 'mall',
        label: '商品管理',
        icon: 'video-play',
        url: 'Mall'
    },
    {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'user',
        url: 'User'
    },
    {
        path: 'other',
        label: '其他',
        icon: 'location',
        children: [
            {
                path: '/page1',
                name: 'page1',
                label: '页面1',
                icon: 'setting',
                url: 'Page1'
            },
            {
                path: '/page2',
                name: 'page2',
                label: '页面2',
                icon: 'setting',
                url: 'Page2'
            }
        ]
    }
])


//分别获取有子菜单和无子菜单的数据 
const noChildren = computed(() => {
    return list.value.filter(item => !item.children)
})

const hasChildren = computed(() => {
    return list.value.filter(item => item.children)
})


const store = useAllDataStore()
const isCollapse = computed(() => store.$state.isCollapse)
const asideWidth = computed(() => {
    return isCollapse.value ? '64px' : '200px'
})



</script>


<style scoped lang="less">
.icon {
    margin-right: 5px;
    width: 18px;
    height: 18px;

}

.el-menu {
    border-right: none;
    // background-color: #545c64;
    // color: #fff;

    h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
    }
}



.el-aside {
    height: 100%;
    background-color: #545c64;
}
</style>
