import { createRouter, createWebHistory } from "vue-router";
// @ is an alias to /src
// 登录
import login from "@/views/login.vue";
// 主页
import home from "@/views/home.vue";
// 内容管理
import content from "@/views/contentManage/list.vue"; //内容管理列表
import contentdetail from "@/views/contentManage/detail.vue"; // 内容管理详情

import upload from "@/views/uploadManage/upload.vue"; // 导入内容导入

import error from "@/views/error/error.vue"; // 404

/**
 * 注意：
 * children的path注意不要有/
 * requiresAuth 需要登录
 * **/
const routes = [
  // 根目录
  {
    path: "/",
    redirect: "/home",
  },
  // 登录
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/error",
    name: "error",
    component: error,
  },

  {
    path: "/home",
    name: "home",
    component: home,
    redirect: "/home/content",
    // meta: {
    //   requiresAuth: true,
    // },
    children: [
      //注意： 子路由注册的所有页面，都得在（homeChildren--components）注册
      {
        path: "/home/content",
        name: "content",
        component: content, //内容管理列表
      },
      {
        path: "/home/contentdetail",
        name: "contentdetail",
        component: contentdetail, //内容编辑
      },
      {
        path: "/home/upload",
        name: "upload",
        component: upload, //上传内容
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
// 路由守卫
// router.beforeEach((to, from, next) => {
//   if (localStorage.getItem("loginState") === null)
//     localStorage.setItem("loginState", "-1");
//   // 如果不是登录页，那么其他页面则需要判断loginState
//   if (localStorage.getItem("loginState") === "1" || to.fullPath === "/login") {
//     next();
//   } else {
//     next("/login");
//   }
// });

export default router;
