import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import Login from "@/views/login.vue";
import Home from "@/views/home.vue";

/**
 * 路由表
 */
const router = createRouter({
    //去掉url中的#
    history: createWebHistory(),
    routes:[
        {
            path:'/login',
            //处理@引入问题在vite.cinfig,js里面
            component: ()=> import('@/views/login.vue'),
        },
        {
            path:'/home',
            component: Home
        },
    ]
})

//导出路由
export default router