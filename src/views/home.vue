<template>
  <!-- <div class="bc-3978 w-48 h-48 br-8 df ai-ct jc-ct pointer" style="position: fixed;bottom: 46px;left: 66px;z-index: 1;"
    @click="logout">
    <img src="@/assets/exit.png">
  </div> -->
  <a-layout>
    <Header @toggleCollapsed="toggleCollapsed" @toggleMenuItem="addTab"></Header>
    <!-- <Header @toggleCollapsed="toggleCollapsed" @toggleMenuItem="addTab" @islogin='sonRouteRefresh'></Header> -->
    <a-layout>
      <Left ref="left" @toggleMenuItem="addTab"></Left>
      <a-layout-content>
        <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card" @edit="onEdit" @tabClick="tabClick"
          :tabBarGutter="16">
          <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title"
            :closable="panes.length > 1 ? pane.closable : false">
            <!-- {{ pane.detailpage }} -->
            <!-- 此处会动态地添加具有name的router-view，通过a-tab-pane切换的display none block进行显隐切换 -->
            <!-- <router-view @openNewMenuItem="addTab"></router-view> -->
            <!-- <router-view :name="pane.detailpage" :query="pane.query" @openNewMenuItem="addTab"></router-view> -->
          </a-tab-pane>
        </a-tabs>
        <router-view @confirm="childremove" @openNewMenuItem="addTab"></router-view>


      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
// 接口引入
import debounce from "debounce";
export default defineComponent({
  setup() {
    // 路由
    const route = useRoute();
    const router = useRouter();
    // 标签页
    const panes = ref([]);
    // 当前激活 tab 面板的 key
    const activeKey = ref("11");
    // 组件实例
    const left = ref(null);

    const vuex = useStore();
    /**
     * 新开标签页
     * @param {String} key 由Left组件传过来的栏目项key值
     * @param {String} resName 由Left组件传过来的栏目项名字
     **/
    const addTab = (key, resName, query) => {
      key = String(key); //同一处理数据为String
      // 判断标签页是否已经存在
      let repeatBool = repeatTabJudge(key);

      if (repeatBool) {
        //重复则跳转
        activeKey.value = key;
        if (!!query) {
          let flag = panes.value.findIndex(v => v.key == activeKey.value);
          // console.log(flag, 'flag');
          if (flag > -1) {
            panes.value[flag].query = query.id ? query : {};
            sonRouteRefresh(query.id ? query : {}); //子路由刷新
          } else {
            sonRouteRefresh(query); //子路由刷新
          }
        } else {
          sonRouteRefresh(query); //子路由刷新
        }
      } else {
        // 不重复则添加然后跳转
        activeKey.value = key;
        panes.value.push({
          title: resName,
          key: activeKey.value,
          detailpage: detailpageJudge(),
          query: query || {},
        });
        // console.log(panes.value);

        // 子路由对应的name名
        function detailpageJudge() {
          switch (Number(key)) {
            case 11:
              return "content";
            case 12:
              return "contentdetail";
            // case 111:
            //   return "addtask";
            // case 12:
            //   return "userexamine";
            // case 121:
            //   return "userwaitexamine";
            // case 13:
            //   return "tradereply";
            // case 131:
            //   return "tradewaitexamine";
            // case 14:
            //   return "evaluatereply";
            // case 141:
            //   return "evaluatewaitexamine";
            case 21:
              return "upload";
            case 22:
              return "contentdetail";
            case 31:
              return "fundlist";
          }
        }
        // console.log(query);
        sonRouteRefresh(query); //子路由刷新
      }
    };

    /**
     * 判断标签页是否已经存在
     * @param {String} res 页面对应的key值
     * **/
    const repeatTabJudge = (res) => {
      let result = panes.value.some(function (item) {
        return item.key == res;
      });
      return result;
    };

    /**
     * 子路由刷新
     * **/
    const sonRouteRefresh = (query) => {
      let result = panes.value.findIndex(function (item) {
        return item.key == activeKey.value;
      });
      // console.log(result); console.log(panes.value);
      if (panes.value[result].detailpage == 'contentdetail') {
        router.replace({ name: panes.value[result].detailpage, query: query })
      } else {
        router.replace({ name: panes.value[result].detailpage })
      }
      // 修改vuex，同步面包屑
      vuex.commit("setBreadCrumbData", { value: Number(activeKey.value), query: query });
    };

    const remove = (targetKey) => {
      console.log(targetKey);
      let lastIndex = 0;
      panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      panes.value = panes.value.filter((pane) => pane.key !== targetKey);

      if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].key;
        } else {
          activeKey.value = panes.value[0].key;
        }
      }
    };

    const onEdit = (targetKey, action) => {
      if (action == "remove") {
        remove(targetKey);
        // 如果删除后，激活key等于当前的key说明是删的最后一个，原组件存在些问题，暂且这样判断解决
        if (targetKey == activeKey.value) {
          activeKey.value = "";
        }
        sonRouteRefresh();
        left.value.tabValueTransfer(panes.value[panes.value.length - 1].key, panes.value);
      }
    };
    // tab 被点击的回调,直接联动到left组件上
    const tabClick = (res) => {
      left.value.tabValueTransfer(res, panes.value);
    };

    // 切换左侧菜单栏是否折叠
    const toggleCollapsed = (res) => {
      left.value.toggleCollapsed(res);
    };
    // 判断时候登录
    const childremove = (targetKey) => {
      let lastIndex = 0;
      panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      panes.value = panes.value.filter((pane) => pane.key !== targetKey);
      if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].key;
        } else {
          activeKey.value = panes.value[0].key;
        }
      }
    }

    // const logout = debounce(() => {
    //   let data = {
    //     method: "passport.loginout",
    //     data: "",
    //   };
    //   HTTP_POST(data).then((res) => {
    //     message.success("退出登录成功", 2, function () {
    //       window.location.href = "/login";
    //     });
    //     // 删除所有localStorage
    //     window.localStorage.clear();
    //     // 删除面包屑
    //     vuex.commit("setBreadCrumbData", {});
    //   }).catch((res) => {
    //     window.location.href = "/login";
    //     // 删除所有localStorage
    //     window.localStorage.clear();
    //     // 删除面包屑
    //     vuex.commit("setBreadCrumbData", {});
    //   });
    // }, 200);

    return {
      panes,
      activeKey,
      left,
      onEdit,
      tabClick,
      addTab,
      toggleCollapsed,
      childremove,
      // logout,
    };
  },
});
</script>
<style>
/* 修改父容器的高度 */
.ant-tabs-content.ant-tabs-content-top {
  min-height: 100%;
}

.ant-tabs-nav::before {
  border-bottom: none !important;
}

.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #fff;
}

.ant-layout .ant-layout-header {
  background: #5194fb;
}
</style>