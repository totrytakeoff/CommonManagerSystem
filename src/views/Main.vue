<template>
    <div class="common-layout">
        <el-container class="lay-container">

            <!-- 自定义侧边栏 -->
            <common-aside />

            <el-container>

                <el-header class="el-header">
                    <!-- 自定义头部 -->
                    <common-header />
                </el-header>


                <el-main class="right-main">
                    <router-view />
                </el-main>

            </el-container>

        </el-container>

    </div>
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import CommonAside from '@/components/CommonAside.vue'

import CommonHeader from '@/components/CommonHeader.vue'

</script>


<style scoped lang="less">
.common-layout {
    height: 100%;

}

.lay-container {
    height: 100%;
}


.el-header {
    background-color: #333;
    color: #fff;
}


</style>
