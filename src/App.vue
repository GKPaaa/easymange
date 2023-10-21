<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script>
// ant-dsign组件语言配置
// import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import zhCN from "ant-design-vue/es/locale/zh_CN"; // 在node_modules中找到（可切换各种语言）
import { onMounted } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const vuex = useStore();
    const route = useRoute();
    onMounted(()=>{
    });
    return {
      zhCN: zhCN,
    };
  },
};
</script>