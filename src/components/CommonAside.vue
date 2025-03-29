<template>
    <el-aside :width="asideWidth">
        <el-menu background-color="#545c64" text-color="#fff" :collapse=isCollapse :collapse-transition="true">
            <h3 v-show="!isCollapse">
                通用后台管理系统
            </h3>
            <h3 v-show="isCollapse">
                后台
            </h3>

            <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path" @click="handleMenu(item)">
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
                    <el-menu-item v-for="(subItem, subIdx) in item.children" :key="subItem.path" :index="subItem.path"
                        @click="handleMenu(subItem)">

                        <component class=" icon" :is="subItem.icon"> </component>

                        <span>{{ subItem.label }}</span>

                    </el-menu-item>
                </el-menu-item-group>

            </el-sub-menu>


        </el-menu>
    </el-aside>


</template>



<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { useAllDataStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import type { Menu } from '@/types.ts'

const router = useRouter();
const route = useRoute();



//动态获取菜单数据
const list: Ref<Menu[]> = computed(() => {
    return store.getMenuList
})

//分别获取有子菜单和无子菜单的数据
const noChildren = computed(() => {
    return list.value.filter(item => !item.children)
})

const hasChildren = computed(() => {
    return list.value.filter(item => item.children)
})

const handleMenu = (item: any) => {
    router.push({
        path: item.path
    })
    store.selectMenu(item)
}




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
        font-weight: 1000;

    }
}



.el-aside {
    height: 100%;
    background-color: #545c64;
}
</style>
