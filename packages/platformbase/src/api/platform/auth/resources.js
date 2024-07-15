import request from "@platform/utils/request"
import { AUTH_URL } from "@platform/api/baseUrl"
/**
 * 获取菜单数据
 * @param {*} params
 */
export function getMenuData(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/getMenuData",
    method: "get",
    params: params
  })
}
/**
 * 获取资源下拉树
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/getTreeData",
    method: "get",
    params: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/query",
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
    url: AUTH_URL() + "/auth/resources/remove",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/save",
    method: "post",
    isLoading: true,
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/get",
    method: "get",
    params
  })
}
/**
 *  保存资源移动
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/saveMove",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 *  保存资源移动
 * @param {*} params
 */
export function sortSave(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/sortSave",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 *  导入
 * @param {*} file
 * @param {*} resourceId
 * @param {*} systemId
 */
export function importXml(file, resourceId, systemId) {
  const data = new FormData() // 创建form对象
  data.append("file", file)
  data.append("resourceId", resourceId)
  data.append("systemId", systemId)
  return request({
    url: AUTH_URL() + "/auth/resources/importXml",
    method: "post",
    isLoading: true,
    gateway: true,
    data: data
  })
}
/**
 * 导出
 * @param {*} params
 */
export function exportXml(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/exportXml",
    method: "get",
    responseType: "arraybuffer",
    isLoading: true,
    params: params
  })
}
/** 根据角色ID分配资源管理树
 *
 * @param {*} params
 */
export function findRoleResTreeChecked(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/findRoleResTreeChecked",
    params: params
  })
}
/**
 * 通过角色ID,系统ID,获取资源,附带资源下的操作类型(有选择信息)
 * @param {*} params
 */
export function findRoleResAndResOptypeTreeChecked(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/findRoleResAndResOptypeTreeChecked",
    params: params
  })
}
export function updateResource(data) {
  return request({
    url: AUTH_URL() + "/auth/resources/update/resource",
    method: "post",
    isLoading: true,
    data: data
  })
}
/**
 * 更新节点数据
 */
export function updateNode(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/updateNode",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 保存常用菜单
 */
export function saveFavorites(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/saveFavorites",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 删除常用菜单
 */
export function removeFavorites(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/removeFavorites",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 获取常用菜单列表
 */
export function getMenuFavorites(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/getMenuFavorites",
    method: "post",
    data: params
  })
}
/**
 * 常用菜单排序
 */
export function sortFavorites(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/sortFavorites",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 获取当前用户菜单资源
 */
export function findUserResTreeChecked(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/findUserResTreeChecked",
    method: "get",
    params: params
  })
}
/**
 * 根据系统id获取当前用户菜单资源
 */
export function findUserResTreeCheckedBySys(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/findUserResTreeCheckedBySys",
    method: "get",
    params: params
  })
}
/**
 * 根据系统id和租户id获取菜单资源
 */
export function findResTreeCheckedOfTenant(params) {
  return request({
    url: AUTH_URL() + "/auth/resources/findResTreeCheckedOfTenant",
    method: "get",
    params: params
  })
}
