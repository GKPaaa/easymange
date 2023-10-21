<template>
  <a-layout-sider theme="light" :collapsible="true" :collapsed="collapsed" :trigger="null" width="180">
    <div class="pr">
      <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" @click="toggleMenuItem">
        <a-sub-menu key="1">
          <!-- <template #icon>
            <img :src="dealIcon(1)">
          </template>
          <template #title>任务管理</template>
          <a-menu-item key="11">任务列表</a-menu-item>
          <a-menu-item key="12">用户审核</a-menu-item>
          <a-menu-item key="13">任务回告</a-menu-item>
          <a-menu-item key="14">评价回告</a-menu-item> -->
          <template #icon>
            <img :src="dealIcon(1)">
          </template>
          <template #title>内容管理</template>
          <a-menu-item key="11">内容列表</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="2">
          <template #icon>
            <img :src="dealIcon(2)">
          </template>
          <!-- <template #title>用户管理</template>
          <a-menu-item key="21">用户列表</a-menu-item> -->
          <template #title>问题汇总</template>
          <a-menu-item key="21">问题列表</a-menu-item>
        </a-sub-menu>
        <!-- <a-sub-menu key="3">
          <template #icon>
            <img :src="dealIcon(3)">
          </template>
          <template #title>资金管理</template>
          <a-menu-item key="31">资金列表</a-menu-item>
        </a-sub-menu> -->
      </a-menu>
    </div>
  </a-layout-sider>
</template>
<script>
import { defineComponent, reactive, toRefs, onMounted, watchEffect, watch } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  // 子父传值
  emits: ["toggleMenuItem"],
  // 在组件被创建之前执行
  setup(props, ctx) {
    const vuex = useStore();
    /*--定义data--*/
    const state = reactive({
      collapsed: false, //折叠态

      selectedKeys: [], // 当前选中的菜单项 key 数组

      panes: [],

      openKeys: ["1", "2", "3"], // 当前展开的 SubMenu 菜单项 key 数组
    });
    // 监视reactive所定义的一个响应式数据中的某个属性
    watchEffect(() => {
    });
    /*--处理生命周期--*/
    onMounted(() => {
      // 根据vuex--breadCrumbData初始化数据
      let pathObject = vuex.state.breadCrumbData[vuex.state.breadCrumbData.length - 1]; //面包屑
      // console.log(pathObject);
      // console.log(vuex.state.breadCrumbData);
      if (pathObject != undefined) {
        switch (pathObject.name) {
          case "内容列表":
            toggleMenuItem({ key: "11", query: pathObject.query || {} });
            break;
          case "内容编辑":
            toggleMenuItem({ key: "12", query: pathObject.query || {} });
            break;

          // case "新增任务":
          //   toggleMenuItem({ key: "111", query: pathObject.query || {} });
          //   break;
          // case "用户审核":
          //   toggleMenuItem({ key: "12", query: pathObject.query || {} });
          //   break;
          // case "待审核":
          //   if (pathObject.key == '121') {
          //     toggleMenuItem({ key: "121", query: pathObject.query || {} });
          //   } else if (pathObject.key == '131') {
          //     toggleMenuItem({ key: "131", query: pathObject.query || {} });
          //   } else if (pathObject.key == '141') {
          //     toggleMenuItem({ key: "141", query: pathObject.query || {} });
          //   }
          //   break;
          // case "任务回告列表":
          //   toggleMenuItem({ key: "13", query: pathObject.query || {} });
          //   break;
          // case "评价回告列表":
          //   toggleMenuItem({ key: "14", query: pathObject.query || {} });
          //   break;
          // case "用户列表":
          //   toggleMenuItem({ key: "21" });
          //   break;
          case "问题列表":
            toggleMenuItem({ key: "21" });
            break;
          case "添加说明":
            toggleMenuItem({ key: "22", query: pathObject.query || {} });
            break;
          case "资金列表":
            toggleMenuItem({ key: "31" });
            break;
        }
      } else {
        let time = Date.parse(new Date()) / 1000;
        toggleMenuItem({ key: "11", query: { id: time } });
      }
    });
    // 处理menu图标
    const dealIcon = (type) => {
      let str = String(state.selectedKeys[0]);
      if (type == 1) {
        if (str.substring(0, 1) == "1") {
          return require('@/assets/left/task1.png');
        } else {
          return require('@/assets/left/task.png');
        }
      } else if (type == 2) {
        if (str.substring(0, 1) == "2") {
          return require('@/assets/left/user1.png');
        } else {
          return require('@/assets/left/user.png');
        }
      } else if (type == 3) {
        if (str.substring(0, 1) == "3") {
          return require('@/assets/left/money1.png');
        } else {
          return require('@/assets/left/money.png');
        }
      } else {
        return ""
      }
    };
    /**
       * 切换折叠态
       * @param {Boolean} res 父组件由Header组件中接受的控制折叠态的参数
    **/
    const toggleCollapsed = (res) => {
      state.collapsed = res;
    };
    /**
     * 切换菜单栏
     * @param {Object} res 被点击的菜单项
     * 备注：还有就是点标签栏在对应切换回来
    **/
    const toggleMenuItem = (res) => {
      let query = {};
      if (state.panes && state.panes.length > 0) {
        query = state.panes.find(v => v.key == res.key) || {};
      } else {
        query = vuex.state.breadCrumbData[vuex.state.breadCrumbData.length - 1] || {};
      }
      let resName = ""; //菜单栏名
      switch (Number(res.key)) {
        case 11:
          resName = "内容列表";
          break;
        case 12:
          resName = "内容编辑";
          break;
        // case 111:
        //   resName = "新增任务";
        //   break;
        // case 12:
        //   resName = "用户审核";
        //   break;
        // case 121:
        //   resName = "待审核";
        //   break;
        // case 13:
        //   resName = "任务回告列表";
        //   break;
        // case 131:
        //   resName = "待审核";
        //   break;
        // case 14:
        //   resName = "评价回告列表";
        //   break;
        // case 141:
        //   resName = "待审核";
        //   break;
        // case 21:
        //   resName = "用户列表";
        //   break;
        case 21:
          resName = "问题列表";
          break;
        case 22:
          resName = "添加说明";
          break;
        case 31:
          resName = "资金列表";
          break;
        default:
          resName = "其他";
          break;
      }
      // console.log(res.key)

      switch (Number(res.key)) {
        case 12:
          state.selectedKeys = ['11'];
          break;
        case 111:
          state.selectedKeys = ['11'];
          break;
        case 12:
          state.selectedKeys = ['11'];
          break;
        case 22:
          state.selectedKeys = ['21'];
          break;
        case 121:
          state.selectedKeys = ['12'];
          break;
        case 131:
          state.selectedKeys = ['13'];
          break;
        case 141:
          state.selectedKeys = ['14'];
          break;
        default:
          state.selectedKeys = [res.key];
          break;
      }
      ctx.emit("toggleMenuItem", res.key, resName, query.query || {});
    };
    /**
     * 父组件标签页传来的值
     * @param {String} res 页面对应的key值
    * **/
    const tabValueTransfer = (res, panes) => {
      state.selectedKeys = [res];
      state.panes = JSON.parse(JSON.stringify(panes)) || [];
      toggleMenuItem({ key: res });
    };
    return {
      ...toRefs(state),
      toggleCollapsed,
      toggleMenuItem,
      tabValueTransfer,
      dealIcon,
    };
  },
});
</script>