<template>
  <div class="login-container">
    <el-form class="login-form" :rules="rules" :model="loginForm" ref="loginFormRef">
      <!-- 标题 -->
      <div class="title-container">Admin 后台管理</div>
      <!-- 账户 -->
      <el-form-item style="margin-bottom: 30px" prop="username">
        <el-input
          class="input-form"
          placeholder="请输入用户名"
          name="username"
          type="text"
          prefix-icon="User"
          v-model="loginForm.username"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item style="margin-bottom: 30px" prop="password">
        <el-input
          class="input-form"
          placeholder="请输入密码"
          show-password
          name="password"
          type="password"
          prefix-icon="Lock"
          v-model="loginForm.password"
        ></el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button class="input-form" type="primary" style="width: 100%; margin-bottom: 30px" @click="handleLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
  import { getCurrentInstance, ref } from "vue";
  import api from "@/api/index.js";
  import router from "@/router/router.js";
  import {ElNotification} from "element-plus";

  const { proxy } = getCurrentInstance();

  // 表单校验规则
  const rules = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  };

  const loginForm = ref({
    username: "",
    password: "",
  });

  // 处理登录
  const loginFormRef = ref();
  const handleLogin = () => {
    loginFormRef.value.validate((valid) => {
      if (!valid) return;

      proxy.$api.login(loginForm.value).then((res) => {
          const ok = res.data.code === 200 || res.code ===200;
          if (ok){
            open1()
            router.push("/home")
           // console.log("登录成功",res)
          }else {
            open2()
            console.log("登录失败",res)
          }
        }).catch((err) => {
          open2()
          console.log(err);
        });
    });
  };

  // 登录成功的弹出框
  const open1 = () => {
    ElNotification({
      title: 'Success',
      message: "登录成功！",
      type: 'success',
      duration: 3000
    })
  }
    // 登录失败的弹出框
  const open2 = () => {
    ElNotification({
      title: 'warning',
      message: "登录失败",
      type: 'warning',
      duration: 3000
    })
  }
</script>

<style lang="css" scoped>
.login-container {
  background-image: url("../assets/images/logo.jpg");
  height: 100%;
}
.login-form {
  width: 400px;
  border-radius: 1px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.title-container {
  color: #92ca95;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  font-size: 50px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
}
.input-form {
  height: 45px;
}
</style>
