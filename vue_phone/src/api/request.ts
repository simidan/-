import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import router from '../router/index'; // 引入路由配置，确保你已经设置了路由

// 此接口现在直接匹配预期的错误消息格式
interface ErrorResponse {
    error: string;
}


// 创建 axios 实例
const request = axios.create({
    baseURL: "/api", // API 的基础路径
    headers: { 'Content-Type': 'application/json' } // 设置默认请求头
});

// 请求拦截器
request.interceptors.request.use((config) => {
    // 在发送请求之前做一些处理，比如添加 token
    if (localStorage.token) {
      config.headers.Authorization = `Bearer ${localStorage.token}`;
    }
    return config;
}, (error: AxiosError) => {
    // 请求出错时的处理
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use((response: AxiosResponse) => {
    // 对响应数据进行处理
    return response;
}, (error: AxiosError) => {
    // 响应出错时的处理
    if (error.response) {
        const errorResponse = error.response.data as ErrorResponse; // 使用类型断言
        if (errorResponse.error === "Invalid token") {
            // 如果后端返回的错误信息是 "Invalid token"，则跳转到登录页面
            router.push('/login'); // 假设你的登录路由是 '/login'
        } else {
            alert(error.message); // 弹出其他类型错误信息
        }
    } else {
        // 如果没有响应对象，可能是网络错误或其他问题
        alert(error.message);
    }
    // 返回一个拒绝状态的 Promise
    return Promise.reject(error);
});

export default request; // 导出 axios 实例
