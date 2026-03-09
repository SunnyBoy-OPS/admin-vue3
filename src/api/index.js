/**
 * api接口封装
 */

import request  from "@/utils/request.js";
export default {
    //登录
    login(params){
        return request({
            //url: '/sysAdmin/login',
            url: '/login',
            method: "POST",
            data: params
        })
    }
}