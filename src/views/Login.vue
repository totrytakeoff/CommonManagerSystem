<template>
    <div class="body-login">
        <el-form :model="loginForm" class="login-container">
            <h1>欢迎登录</h1>

            <el-form-item>
                <el-input type="input" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input type="input" v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>

            <el-form-item class="login-btn">
                <el-button type="success" @click="handleLogin">注册</el-button>
                <el-button type="primary" @click="handleLogin">登录</el-button>
            </el-form-item>

        </el-form>
    </div>


</template>




<script setup lang="ts">

import { ref, onMounted } from 'vue'
import type { LoginInfo, Menu } from '@/types.ts'
import API from '@/api/api.ts'
import { useAllDataStore } from '@/stores/index.ts'
import { useRouter } from 'vue-router'
import { generateRoutes } from '@/router'



const router = useRouter();
const store = useAllDataStore();

const loginForm = ref<LoginInfo>({
    username: '',
    password: ''
})


// onMounted(() => {
//     store.initializeState();
// })

console.log('Current routes:', router.getRoutes());

const handleLogin = async () => {
    try {
        const res = await API.getMenu(loginForm.value);

        if (res.code === 200) {
            store.setMenuList(res.data.menuList);
            store.setToken(res.data.token);

            // 跳转到首页
            router.push('/home');
        } else {
            alert(res.message || '登录失败');
        }
    } catch (error) {
        console.error(error);
        alert('登录失败，请检查用户名或密码');
    }
};


</script>


<style scoped lang="less">
.body-login {
    width: 100%;
    height: 100%;
    background-color: #f8f697;
    background-image: url("@/assets/images/bkg.png");
    background-size: 100%;
    overflow: hidden;
    position: relative;

}

.login-container {
    position: absolute;
    top: 25%; // 调整为垂直居中
    left: 50%; // 调整为水平居中
    transform: translate(-50%, -50%); // 使元素相对于自身中心点进行偏移，实现真正的居中


    width: 500px;
    height: 250px;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 25px rgba(255, 195, 195, 0.5);
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    margin: 100px auto;
    border: 1px solid #eaeaea;

    h1 {
        text-align: center;
        font-size: 28px;
        margin-bottom: 20px;
        color: #505450;
    }

    :deep(.el-form-item__content) {
        justify-content: center;

    }

    .login-btn {
        .el-button {
            margin: 0 30px 0 30px; // 添加按钮间距
        }

    }

}
</style>
