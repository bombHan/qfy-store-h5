import axios from 'axios';
import { Toast } from 'vant';

axios.defaults.timeout = 10000;

// 请求拦截器
axios.interceptors.request.use(
    config => {
        let token = window.localStorage.getItem("token")
        token && (config.headers.token = token);
        if (config.data.type == "check") {
            config.data.type = null
            delete config.data.type;
            let checkUser = window.localStorage.getItem("checkUser");
            checkUser = checkUser && JSON.parse(checkUser);
            config.headers.token = checkUser && checkUser.token || ''
        }
        return config;  //添加这一行
    },
    error => {
        return Promise.reject(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200 || response.status === 304) {
            if (response.data.code === 403) {
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("checkUser")
                Toast({
                    message: "登录信息失效，认证失败~",
                    duration: 1000,
                    forbidClick: true
                });
                return Promise.reject(response);
            } else if (response.data.code !== 200) {
                Toast({
                    message: response.data.message,
                    duration: 1000,
                    forbidClick: true
                });
                return Promise.reject(response);
            } else {
                return Promise.resolve(response);
            }
        } else if (response.status === 403) {
            Toast({
                message: "403-认证失败~",
                duration: 1000,
                forbidClick: true
            });
            return Promise.reject(response);
        } else if (response.status === 500) {
            Toast({
                message: "500-服务器繁忙~",
                duration: 1000,
                forbidClick: true
            });
            return Promise.reject(response);
        }
    });