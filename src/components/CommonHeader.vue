<template>
    <div class="header">
        <div class="l-content">
            <el-button size="small" @click="toggleAside">
                <component class="icon" is="menu"></component>
            </el-button>
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            </el-breadcrumb>

        </div>

        <div class="r-content">

            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="getImageUrl('user')" alt="用户头像" class="user" />
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="logout">退出</el-dropdown-item>

                    </el-dropdown-menu>
                </template>
            </el-dropdown>

        </div>

    </div>

</template>



<script setup lang="ts">
// import { computed, ref } from 'vue'
import { useAllDataStore } from '@/stores'
import getImageUrl from '@/utils/getUserData'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
    router.push('/login')
    // 清空数据
    store.clearn();
}

const store = useAllDataStore()
const toggleAside = () => {
    store.toggleCollapse()
}


</script>


<style scoped lang="less">
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #333;
}

.icon {
    width: 20px;
    height: 20px;
}

.r-content {
    display: flex;
    flex-direction: row;
    align-items: center;

    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    margin-left: auto; // 强制右侧对齐
    padding-right: 20px; // 右侧留空
}

.l-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0; // 禁止收缩

    .el-button {
        margin-right: 10px;
    }

    .bread {
        white-space: nowrap; // 防止面包屑换行
    }

}

:deep(.bread span) {
    color: #fff !important;
    cursor: pointer !important;
}
</style>
