<template>
    <el-container class="home-container">
      <!--左侧边栏-->
      <el-aside class="el-aside" :width="isCollapse ? '64px' : '200px'">
        <div class="logo">
          <img src="../assets/images/img.png" class="aside-logo" alt="网站logo">
        </div>
        <!--Menu菜单-->
        <el-menu class="el-menu" background-color="#0f172a" text-color="#c1c1c1" unique-opened :collapse="isCollapse" :collapse-transition="false">
            <!--一级首页菜单-->
            <el-menu-item index="0">
              <el-icon size="20"><House /></el-icon>
              <span style="font-size: large">首页</span>
            </el-menu-item>

            <!--一级Dashboard菜单-->
            <el-menu-item index="1">
              <el-icon size="60"><Sunny /></el-icon>
              <span style="font-size: large">Dashboard</span>
            </el-menu-item>

            <!--一级菜单[批量执行]-->
            <el-sub-menu index="2">
              <template #title>
                <el-icon size="20"><Files /></el-icon>
                <span style="font-size: large">批量执行</span>
              </template>
              <!--二级菜单-->
              <el-menu-item-group >
                <el-menu-item index="2-1" style="font-size: large">执行任务</el-menu-item>
                <el-menu-item index="2-2" style="font-size: large">模板管理</el-menu-item>
                <el-menu-item index="2-3" style="font-size: large">文件分发</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>

            <!--一级菜单[系统管理]-->
            <el-sub-menu index="3">
              <template #title>
                <!--前缀图标-->
                <el-icon size="20"><Setting /></el-icon>
                <span style="font-size: large">系统管理</span>
              </template>
              <!--二级菜单-->
              <el-menu-item-group >
                <el-menu-item index="3-1" style="font-size: large">登录日志</el-menu-item>
                <el-menu-item index="3-2" style="font-size: large">账户管理</el-menu-item>
                <el-menu-item index="3-3" style="font-size: large">角色信息</el-menu-item>
                <el-menu-item index="3-4" style="font-size: large">系统设置</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
        </el-menu>

      </el-aside>
      <!--下部容器-->
      <el-container>
        <!--头部栏-->
        <el-header class="el-header">
          <div class="header-btn">
            <el-icon size="25" @click="toggleCollapse">
              <component :is="collapseBtnClass"></component>
            </el-icon>
          </div>
        </el-header>
        <!--主体栏-->
        <el-main class="el-main">el-main</el-main>
      </el-container>
    </el-container>
</template>

<script setup>
import {Expand, Files, Fold, House, Location, Setting, Sunny} from "@element-plus/icons-vue";
import {ref} from "vue";
// 侧边栏展开和折叠
const isCollapse = ref(false)
const collapseBtnClass = ref("Expand")

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  if (isCollapse.value) {
    collapseBtnClass.value = "Expand"
  }else {
    collapseBtnClass.value = "Fold"
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: white;
  align-items: center;
  justify-content: space-between;
  display: flex;
  .header-btn{
    padding: 6px;
    font-size: 23px;
    cursor: pointer;
  }
}
.el-aside{
  background-color: #0f172a;
  .logo{
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    padding:7px 40px;
  }
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: ghostwhite;
}

</style>