import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
    // 解决@引入的问题
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
 //           '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    plugins: [vue()],

    // 配置启动服务的参数
    lintOnSave: false,  //关闭校验
    productionSourceMap: false, //生成环境是否要生成 sourceMap
    publicPath: '/',    //部署应用包时的基本 URL(如果是'./' 导致刷新页面出现cannot get/错误)
    outputPath: 'dist', // build 时输出的文件目录
    assetsDir: 'assets',    //放置静态文件夹目录
    server: {
        host: '0.0.0.0',
        port: 5002,
        https: false,
        //是否打开游览器
        open: false,
        proxy: {
            "/api": {
                target: 'http://localhost:5001',
                changeOrigin: true,
            }
        },
        client: {
            overlay: false
        }
    }
})
