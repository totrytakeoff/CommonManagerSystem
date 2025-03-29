import axios from "axios";
import { ElMessage } from "element-plus";
// import { ElMessage } from "element-plus";

const service=axios.create({
    baseURL:'http://localhost:3000',
    timeout:5000
})

const NET_ERROR='网络异常，请稍后再试...';

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(
    (res)=>{
        const {code,data,msg}=res.data;
        if(code===200){
            return data;
        }else{
            ElMessage.error(msg||NET_ERROR);
            return Promise.reject(new Error(msg))
        }

    },(err)=>{
    }
);


function request(options:any){
    const {method="get",data={}} = options;
    return service({
        url:options.url,
        method,
        [method.toLowerCase()==='get'?'params':'data']:data
    })
}

export default request;




