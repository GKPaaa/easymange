import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// import antdv from 'ant-design-vue'
import "ant-design-vue/dist/reset.css";
import antdv from "ant-design-vue";
import { message } from "ant-design-vue";
message.config({
  top: `70px`,
  duration: 3,
  maxCount: 1,
});
// 自定义样式
import "@/style/public.css";
import "@/style/antd-rewrite.css";

// 自定义组件
import compoIdx from "./components/compoIndex";

//加载更多数据（自定义指令）
import loadMore from "@/directive/aTableLoadMore";

createApp(App)
  .use(store)
  .use(router)
  .use(antdv)
  .use(compoIdx)
  .use(loadMore)
  .mount("#app");
