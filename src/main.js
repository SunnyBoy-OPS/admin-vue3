import { createApp } from 'vue'
import App from './App.vue'
//router
import router from './router/router'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//导入全局样式
import '@/styles/index.css'
// 输出环境
console.log("环境地址为：", import.meta.env.VITE_APP_ENV)
console.log("baseUrl地址为：", import.meta.env.VITE_APP_BASE_API)

//api
import api  from "@/api/index.js";


// app 实例
const app =  createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(ElementPlus)




//使用api
app.config.globalProperties.$api = api
app.mount("#app")