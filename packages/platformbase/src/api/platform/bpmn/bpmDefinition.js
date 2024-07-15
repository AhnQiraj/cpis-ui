import request from "@platform/utils/request"
import { BPMN_URL } from "@platform/api/baseUrl"
import qs from "qs"
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/query",
    method: "post",
    data: params
  })
}
/**
 * 根据表单key获取列表数据
 * @param {*} params
 */
export function queryByFormKey(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/queryByFormKey",
    method: "post",
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/remove",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/get",
    method: "get",
    params: params
  })
}
/**
 * 通过流程定义Key获取数据
 * @param {*} params
 */
export function getByDefKey(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/getByDefKey",
    method: "get",
    params: params
  })
}
/**
 * 通过流程定义Key获取数据
 * @param {*} params
 */
export function checkExist(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/checkExist",
    method: "get",
    params: params
  })
}
/**
 * 发布流程定义
 * @param {*} params
 */
export function deploy(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/deploy",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 清除流程定义
 * @param {*} params
 */
export function cleanData(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/cleanData",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 获取流程变量树
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/buildFormVars",
    method: "get",
    params: params
  })
}
/**
 * 导入文件
 * @param {*} file
 */
export function importBpm(file) {
  const data = new FormData() // 创建form对象
  data.append("multipartFile", file)
  return request({
    url: BPMN_URL() + "/bpm/definition/importBpm",
    isLoading: true,
    method: "post",
    gateway: true,
    data: data
  })
}
/**
 * 导出文件
 * @param {*} params
 */
export function exportFile(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/export",
    method: "post",
    responseType: "arraybuffer",
    params: params
  })
}
/**
 * 获取流程定义设置的数据
 * @param {*} params
 */
export function setting(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/setting",
    method: "get",
    params: params
  })
}
/**
 * 保存设置的数据
 * @param {*} params
 */
export function saveSetting(data) {
  return request({
    url: BPMN_URL() + "/bpm/definition/saveSetting/vo",
    method: "post",
    isLoading: true,
    data: data
  })
}
/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/setCategory",
    method: "post",
    isLoading: true,
    params
  })
}
/**
 * 批量挂起
 * @param {*} params
 */
export function batchSuspend(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/batchSuspend",
    method: "post",
    isLoading: true,
    params
  })
}
/**
 * 批量恢复
 * @param {*} params
 */
export function batchRecover(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/batchRecover",
    method: "post",
    isLoading: true,
    params
  })
}
/**
 * 复制【流程定义】信息
 * @param {*} params
 */
export function copy(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/copy",
    method: "post",
    isLoading: true,
    params
  })
}
/**
 * 节点下的按钮初始化
 * @param {*} params
 */
export function initButton(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/initButton",
    method: "get",
    params
  })
}
/**
 * 节点下的按钮
 * @param {*} params
 */
export function getButton(params) {
  return request({
    url: BPMN_URL() + "/bpm/definition/editButton",
    method: "get",
    params
  })
}
/**
 * 获取xml
 * @param {*} params
 */
export function getXml(params) {
  return window.config.VUE_APP_BASE_API + BPMN_URL() + "/bpm/definition/bpmnXml?" + qs.stringify(params)
}
