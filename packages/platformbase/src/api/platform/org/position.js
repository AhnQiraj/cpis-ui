import request from '@platform/utils/request'
import { ORG_URL } from '@platform/api/baseUrl'
import ActionUtils from '@platform/utils/action'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL() + '/position/query',
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
    url: ORG_URL() + '/position/remove',
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
    url: ORG_URL() + '/position/save',
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
    url: ORG_URL() + '/position/get',
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
    url: ORG_URL() + '/position/transfer',
    method: 'post',
    data: params
  })
}
/**
 * 通过别名获取数据
 * @param {*} params
 */
export function getByAlias(params) {
  return request({
    url: ORG_URL() + '/position/getByAlias',
    method: 'get',
    params
  })
}
/**
 * 岗位树信息
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: ORG_URL() + '/position/findAll',
    params: params
  })
}
/**
 * 保存移动的岗位
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: ORG_URL() + '/position/saveMove',
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
    url: ORG_URL() + '/position/saveSort',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获取岗位的组织和等级信息
 * @param {*} params
 */
export function getOrgInfo(params) {
  return request({
    url: ORG_URL() + '/position/load',
    method: 'get',
    params: params
  })
}
/**
 * 根据条件查询有组织岗位
 * @param {*} params
 */
export function queryWithOrg(params) {
  return request({
    url: ORG_URL() + '/position/queryWithOrg',
    method: 'post',
    data: params
  })
}
/**
 *  根据用户id查询岗位信息列表分页(带等级值、组织)
 * @param {*} params
 */
export function queryWithOrgByIds(params) {
  return request({
    url: ORG_URL() + '/position/queryWithOrgByIds',
    method: 'post',
    data: params
  })
}
/**
 *  根据orgId查询带等级值的岗位信息
 * @param {*} params
 */
export function queryWithLevelByOrgId(params) {
  return request({
    url: ORG_URL() + '/position/queryWithLevelByOrgId',
    method: 'post',
    data: params
  })
}
/**
 *  岗位加入组织
 * @param {*} params
 */
export function assignOrg(params) {
  return request({
    url: ORG_URL() + '/position/assignOrg',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 *  组织移除岗位
 * @param {*} params
 */
export function removeOrg(params) {
  return request({
    url: ORG_URL() + '/position/removeOrg',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 添加岗位角色
 * @param {*} params
 */
export function assignRole(params) {
  return request({
    url: ORG_URL() + '/position/assignRole',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 移除岗位角色
 * @param {*} params
 */
export function removeRole(params) {
  return request({
    url: ORG_URL() + '/position/removeRole',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 查询岗位信息
 * @param {*} params
 */
export function findWithOrgByIds(params) {
  return request({
    url: ORG_URL() + '/position/findWithOrgByIds',
    method: 'post',
    params: params
  })
}
/**
 * 查询岗位树【懒加载】
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: ORG_URL() + '/position/findTreeData',
    // url: '/extend/v3/position/findTreeDataWithAuth',
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
