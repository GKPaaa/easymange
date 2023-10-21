import req from "./http.js";

export const HTTP_POST = (query) => req("post", "", query);

// 内容管理
export const getcontentdel = (query) => req("post", "/content/delete", query);
export const getcontentdetail = (query) => req("post", "/content/one?" + query); //获取内容详情
export const getcontentlist = (query) => req("post", "/content/list", query); // 获取内容列表
export const delcontentlist = (query) => req("post", "/content/delete", query); // 批量删除内容列表
export const changecontentlist = (query) => req("post", "/content/save", query); // 修改或者新增内容列表

export const importcontentlist = (query) =>
  req("post", "/backend/content/import", query); // 导入内容列表

// 问题管理
export const questionlist = (query) => req("post", "/question/list", query); // 问题管理列表
export const delquestionlist = (query) =>
  req("post", "/question/batchDelete", query); // 批量删除问题管理
export const answerquestion = (query) => req("post", "/question/addAns", query); // 问题管理回答

export const uploadimg = (query) => req("post", "/upload", query); // 上传图片
