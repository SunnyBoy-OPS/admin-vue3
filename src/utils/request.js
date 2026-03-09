/**
 * axios封装
 */
import axios from 'axios'
// 创建axios
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
})

// 核心函数
const request = (options)=> {
    options.method = options.method || 'post'
    if (options.method.toLowerCase() === 'post') {
        options.params = options.data
    }
    service.defaults.baseURL = import.meta.env.VITE_APP_BASE_API
    return service(options)
}

export  default  request