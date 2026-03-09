import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/index.css'
import api from '@/api/index.js'

console.log('当前环境地址:', import.meta.env.VITE_APP_ENV)
console.log('baseURL 地址:', import.meta.env.VITE_APP_BASE_API)

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$api = api
app.mount('#app')
