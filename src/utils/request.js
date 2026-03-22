/**
 * axios封装
 */
import axios from 'axios'
// 创建axios
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
})

// 请求拦截器，存储token
service.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error) => {
    return Promise.reject(error)
})

// 核心函数
const request = (options)=> {
    options.method = options.method || 'get'
    service.defaults.baseURL = import.meta.env.VITE_APP_BASE_API

    if (options.method.toLowerCase() === 'get' && options.data) {
        options.params = options.data
    }
    return service(options)
}

export  default  request