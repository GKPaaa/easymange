import { createStore } from "vuex";
// 刷新页面vuex的数据会丢失属于正常现象，因为JS的数据都是保存在浏览器的堆栈内存里面的，刷新浏览器页面，以前堆栈申请的内存被释放，这就是浏览器的运行机制，那么堆栈里的数据自然就清空了。
// 解决方法：放一份到sessionStorage
export default createStore({
  state: {
    breadCrumbData: JSON.parse(sessionStorage.getItem("breadCrumbData")) || [], //面包屑数据
  },
  getters: {},
  mutations: {
    // 修改面包屑
    setBreadCrumbData(state, obj) {
      let newbreadCrumb = []; //新面包屑
      switch (Number(obj.value)) {
        case 11:
          newbreadCrumb = [
            { name: "内容管理" },
            { key: "11", name: "内容列表", query: obj.query || {} },
          ];
          break;
        case 12:
          newbreadCrumb = [
            { name: "内容管理" },
            { key: "11", name: "内容列表", query: obj.query || {} },
            { key: "12", name: "内容编辑", query: obj.query || {} },
          ];
          break;
        // case 11:
        //   newbreadCrumb = [
        //     { name: "任务管理" },
        //     { key: "11", name: "任务列表", query: obj.query || {} },
        //   ];
        //   break;
        // case 111:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '111', name: "新增任务", query: obj.query || {} }];
        //   break;
        // case 12:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '12', name: "用户审核", query: obj.query || {} }];
        //   break;
        // case 121:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '121', name: "待审核", query: obj.query || {} }];
        //   break;
        // case 13:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '13', name: "任务回告列表", query: obj.query || {} }];
        //   break;
        // case 131:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '131', name: "待审核", query: obj.query || {} }];
        //   break;
        // case 14:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '14', name: "评价回告列表", query: obj.query || {} }];
        //   break;
        // case 141:
        //   newbreadCrumb = [{ name: "任务管理" }, { key: '141', name: "待审核", query: obj.query || {} }];
        //   break;
        // case 21:
        //   newbreadCrumb = [
        //     { name: "用户管理" },
        //     { key: "21", name: "用户列表" },
        //   ];
        //   break;
        case 21:
          newbreadCrumb = [
            { name: "问题汇总" },
            { key: "21", name: "问题列表" },
          ];
          break;
        case 22:
          newbreadCrumb = [
            { name: "问题汇总" },
            { key: "21", name: "问题列表" },
            { key: "22", name: "添加说明", query: obj.query || {} },
          ];
          break;
        case 31:
          newbreadCrumb = [
            { name: "资金管理" },
            { key: "31", name: "资金列表" },
          ];
          break;
      }
      state.breadCrumbData = newbreadCrumb;
      sessionStorage.setItem("breadCrumbData", JSON.stringify(newbreadCrumb));
    },
  },
  actions: {},
  modules: {},
});
