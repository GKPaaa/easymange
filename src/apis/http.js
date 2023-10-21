/*
 * author: nancyzeng
 * date:2019/4/26
 */

import axios from "axios";
import qs from "qs";
import router from "@/router/index.js";
// md5加密
import { md5 } from "@/utils/md5.js";

// function getSign(data) {
//   let secretkey = "6037cf909fa41d0771bf483bd9bfdb8b";
//   var str =
//     secretkey +
//     "appkey" +
//     data.appkey +
//     "data" +
//     data.data +
//     "method" +
//     data.method +
//     secretkey;
//   return md5(str);
// }

// 创建axios的一个实例
var obj = {};
// obj.baseURL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
// obj.baseURL = "http://tbfladm.bookuu.net";
if (process.env.NODE_ENV === "development") {
  obj.baseURL = "https://dingbot-test.bookuu.com/robot";
} else {
  obj.baseURL =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port +
    "/robot";
}

obj.timeout = 60000;

// 一、请求拦截器 忽略
var instance = axios.create(obj);
instance.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json;charset=utf-8";
    // config.credentials = true;
    //   config.withCredentials = true;
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 二、响应拦截器 忽略
instance.interceptors.response.use(
  function (response) {
    // console.log(response, "response");
    sessionStorage.setItem("timeout", "-1");
    if (response.status === 200) {
      // 处理请求成功的逻辑
      // if (response.data.code == "601") {
      if (response.data.code == "601") {
        // 接口提示未登录 上线要改成601
        localStorage.setItem("loginState", "-1");
        setTimeout(() => {
          router.push({
            name: "login",
          });
        }, 1500);
      } else if (response.data.status == "1") {
        localStorage.setItem("loginState", "1");
      }
      return response.data; // 必须返回，后面的接口的then，才能获取response
    } else {
      if (response.status >= 500) {
        // 错误处理
      } else if (response.status === 404) {
        // ...
      }
      return response.data; // 必须返回
    }
  },
  function (error) {
    // sessionStorage.setItem("timeout", "1");
    return Promise.reject(error);
  }
);

/**
 * 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
 * 函数的参数及返回值如下:
 * @param {String} method  请求的方法:get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} data    请求的参数
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 */

export default function (method, url, data = null) {
  // data.appkey = "10012";
  // data.sign = getSign(data);
  method = method.toLowerCase();
  if (method === "post") {
    return instance.post(url, data);
    // return instance.post(url, qs.stringify(data));
  } else if (method === "get") {
    return instance.get(url, qs.stringify(data));
  } else if (method === "delete") {
    return instance.delete(url, qs.stringify(data));
  } else if (method === "put") {
    return instance.put(url, qs.stringify(data));
  } else {
    return false;
  }
}
