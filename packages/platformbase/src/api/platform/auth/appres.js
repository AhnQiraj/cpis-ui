import request from '@platform/utils/request'
import { AUTH_URL } from '@platform/api/baseUrl'
/**
 * 获取菜单数据
 * @param {*} params
 */
export function getMenuData(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/getMenuData',
    method: 'get',
    params: params
  })
}
/**
 * 获取资源下拉树
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/getTreeData',
    method: 'get',
    params: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/remove',
    method: 'post',
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
    url: AUTH_URL() + '/auth/appres/save',
    method: 'post',
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
    url: AUTH_URL() + '/auth/appres/get',
    method: 'get',
    params
  })
}
/**
 *  保存资源移动
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/saveMove',
    method: 'post',
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
    url: AUTH_URL() + '/auth/appres/sortSave',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 *  导入
 * @param {*} file
 * @param {*} appresId
 * @param {*} systemId
 */
export function importXml(file, appresId, systemId) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  data.append('appresId', appresId)
  data.append('systemId', systemId)
  return request({
    url: AUTH_URL() + '/auth/appres/importXml',
    method: 'post',
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
    url: AUTH_URL() + '/auth/appres/exportXml',
    method: 'get',
    responseType: 'arraybuffer',
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
    url: AUTH_URL() + '/auth/appres/findRolResTreeChecked',
    params: params
  })
}
export function updateResource(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/updateResource',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 更新节点数据
 */
export function updateNode(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/updateNode',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存app常用菜单
 */
export function saveFavorites(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/saveFavorites',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 删除app常用菜单
 */
export function removeFavorites(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/removeFavorites',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获取app常用菜单列表
 */
export function getMenuFavorites(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/getMenuFavorites',
    method: 'post',
    data: params
  })
}
/**
 * 常用app菜单排序
 */
export function sortFavorites(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/sortFavorites',
    method: 'post',
    isLoading: true,
    params: params
  })
}
export function findResTreeCheckedOfTenant(params) {
  return request({
    url: AUTH_URL() + '/auth/appres/findResTreeCheckedOfTenant',
    method: 'get',
    params: params
  })
}
