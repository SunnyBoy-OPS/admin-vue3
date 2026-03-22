/**
 * api接口封装
 */

import request  from "@/utils/request.js";
export default {
    //登录
    login(params){
        return request({
            //url: '/login',
            url: '/logintoken',
            method: "POST",
            data: params
        },
        {
            url: '/users',
            method: "POST",
            data: params
        },
        )
    }
}