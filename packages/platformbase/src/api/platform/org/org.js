import request from '@platform/utils/request'
import ActionUtils from '@platform/utils/action'
import { ORG_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL() + '/org/query',
    method: 'post',
    data: params
  })
}
/**
 * 获取所有组织数据
 * @param {*} params
 */
export function findAll() {
  return request({
    url: ORG_URL() + '/org/findAll',
    method: 'get'
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: ORG_URL() + '/org/remove',
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
    url: ORG_URL() + '/org/save',
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
    url: ORG_URL() + '/org/get',
    method: 'get',
    params
  })
}
/**
 * 获取数据(通过ID转换为名称)
 * @param {*} params
 */
export function transfer(params) {
  return request({
    url: ORG_URL() + '/org/transfer',
    method: 'post',
    data: params
  })
}
// 组织树信息
export function findTreeData(params) {
  return request({
    url: ORG_URL() + '/org/findTreeData',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
// 组织树信息
export function findTreeDataWithOrg(params) {
  return request({
    url: '/extend/v3/position/findTreeDataWithAuth',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
// 组织树信息
export function queryOrgListParameters(params) {
  return request({
    url: '/extend/v3/org/queryOrgListParameters',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
/**
 *  保存移动的组织
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: ORG_URL() + '/org/saveMove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 *  保存组织排序
 * @param {*} params
 */
export function saveSort(params) {
  return request({
    url: ORG_URL() + '/org/saveSort',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 添加组织角色
 * @param {*} params
 */
export function assignRole(params) {
  return request({
    url: ORG_URL() + '/org/assignRole',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 移除组织角色
 * @param {*} params
 */
export function removeRole(params) {
  return request({
    url: ORG_URL() + '/org/removeRole',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function findByUserId(params) {
  return request({
    url: ORG_URL() + '/org/findByUserId',
    method: 'get',
    params
  })
}
