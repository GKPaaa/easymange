import req from "./http.js";

export const HTTP_GET = (query) => req("get", "", query);
export const login = (query) => req("get", "/user/getDingTalkQrCode", query); // 登录接口

export const islogin = (query) =>
  req("get", "/robot/user/getDingTalkQrCode", query);

export const logincode = (query) =>
  req("get", "/user/getDingTalkQrCode", query);

export const loginout = (query) => req("get", "/user/logout", query); // 退出登录
export const getlogininfo = (query) => req("get", "/user/userInfo", query); // 获取登陆人的信息

export const exportquestion = (query) =>
  req("get", "/backend/export/question", query); // 导出问题
