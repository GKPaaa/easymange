<template>
  <a-layout-header class="bc-5194 pl-2 pr-0 df " style="padding-left: 0;">
    <div class="cl-f fs-24 lh-32 h-64 df ai-ct jc-ct nowrap">
      <img class="w-33" :style="{ margin: collapsed ? '0 23px' : '0 10px' }" src="@/assets/icon.png">
      {{ !collapsed ? "员工常见问题问答" : "" }}
    </div>
    <div class="ml-24" @click="toggleCollapsed">
      <MenuUnfoldOutlined class="cl-f pointer" v-if="collapsed" />
      <MenuFoldOutlined class="cl-f pointer" v-else />
    </div>

    <a-breadcrumb class="mr-30 ml-10 df ai-ct">
      <a-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="index">
        <a @click="toggleBreadCrumb(index)" v-if="item.key != undefined">
          <span class="cl-f">{{ item.name }}</span>
        </a>
        <span class="cl-f" v-else>{{ item.name }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>

    <div class="fl-1"></div>
    <!-- 头像 -->
    <div class="w-24 df ai-ct">
      <img class="w-100per  bg-cover" v-if="src" :src="src" alt="">
      <div class="w-100per  bg-cover head-img" v-else></div>
    </div>

    <label class="fs-14 ml-8 cl-f nowrap">
      {{ loginAccount }}
    </label>

    <div>
      <a-button type="link" class="sign-out" @click="logout">
        <span class="cl-f">退出登录</span>
      </a-button>
    </div>
  </a-layout-header>
</template>
<script>
import { defineComponent, reactive, toRefs, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import debounce from "debounce";

// 接口引入
import { loginout, getlogininfo } from "@/apis/get";
export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  // 子父传值
  emits: ["toggleCollapsed", "toggleMenuItem"],
  setup(props, ctx) {
    const router = useRouter();
    const vuex = useStore();
    /*--定义data--*/
    const state = reactive({
      collapsed: false,
      loginAccount: "", //登录账户
      src: ''
    });
    /*--处理computed--*/
    const computeds = {
      breadcrumbData: computed(() => vuex.state.breadCrumbData),
    };
    /*--处理生命周期--*/
    onMounted(() => {
      methods.getlogininfo()
      state.loginAccount = localStorage.getItem("realname") || "博库";
    });
    /*--定义methods--*/
    const methods = {
      // 缩放left
      toggleCollapsed: function () {
        state.collapsed = !state.collapsed;
        ctx.emit("toggleCollapsed", state.collapsed);
      },
      /**
       * 切换面包屑
       * @param {String} idx 面包屑当前的idx
       * **/
      toggleBreadCrumb: function (idx) {
        let crumb = computeds.breadcrumbData["_value"][idx];
        ctx.emit("toggleMenuItem", crumb.key, crumb.name);
      },
      // 获取登陆人的信息
      getlogininfo: () => {
        getlogininfo().then(res => {
          console.log(res);
          if (res.data) {
            localStorage.setItem("realname", res.data.name)
            state.src = res.data.avatar
          } else {
          }
        })
      },

      // 退出登录
      logout: debounce(function () {
        loginout().then(res => {
          message.success("退出登录成功", 2, function () {
            window.location.href = "/login";
          });
          // 删除所有localStorage
          window.localStorage.clear();
          // 删除面包屑
          vuex.commit("setBreadCrumbData", {});
        }).catch((res) => {
          window.location.href = "/login";
          // 删除所有localStorage
          window.localStorage.clear();
          // 删除面包屑
          vuex.commit("setBreadCrumbData", {});
        });
      }, 500)
    };
    return Object.assign(toRefs(state), methods, computeds);
  },
});
</script>


<style lang="less" scoped>
.pr-0 {
  padding-right: 0px;
}

.head-img {
  background-image: url("../assets/defaultAvatar.png");
}

.sign-out {
  padding: 4px 23px;
}
</style>

