import request from '@platform/utils/request'
import { ORG_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageListWithOrg(params) {
  return request({
    url: '/extend/v3/role/queryWithSysBySysIdAndOrg',
    method: 'post',
    data: params
  })
}
// 旧的
export function queryPageList(params) {
  return request({
    url: ORG_URL() + '/role/queryWithSysBySysId',
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
    url: ORG_URL() + '/role/remove',
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
    url: ORG_URL() + '/role/save',
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
    url: ORG_URL() + '/role/get',
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
    url: ORG_URL() + '/role/transfer',
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
    url: ORG_URL() + '/role/getByAlias',
    method: 'get',
    params
  })
}
/**
 * 根据角色ID查询角色-子系统数据
 * @param {*} params
 */
export function getRoleSystem(params) {
  return request({
    url: ORG_URL() + '/role/getRoleSystem',
    method: 'get',
    params
  })
}
// 角色树信息
export function getTreeData(params) {
  return request({
    url: ORG_URL() + '/role/queryWithSys',
    method: 'post',
    data: params || {}
  })
}
// 角色树信息[范围]
export function queryBySubSysIdOrName(params) {
  return request({
    url: ORG_URL() + '/role/findTreeData',
    method: 'post',
    data: params || {}
  })
}
// 角色选择器信息[范围]
export function queryRoleScope(params) {
  return request({
    url: ORG_URL() + '/role/query',
    method: 'post',
    data: params || {}
  })
}
/**
 * 获取人员列表
 * @param {*} params
 */
export function queryUsePageList(params) {
  return request({
    url: ORG_URL() + '/role/queryUseList',
    method: 'post',
    params
  })
}
/**
 * 查询组织角色以及父级组织的角色
 * @param {*} params
 */
export function queryByOrgId(params) {
  return request({
    url: ORG_URL() + '/role/queryByOrgId',
    method: 'post',
    data: params
  })
}
/**
 * 查询岗位角色以及岗位所在组织的角色
 * @param {*} params
 */
export function queryByPositionId(params) {
  return request({
    url: ORG_URL() + '/role/queryByPositionId',
    method: 'post',
    data: params
  })
}
/**
 * 根据用户ID查询用户角色
 * @param {*} params
 */
export function findAssignedByUserId(params) {
  return request({
    url: ORG_URL() + '/role/findAssignedByUserId',
    method: 'get',
    params: params
  })
}
/**
 * 分级管理查询组织角色
 * @param {*} params
 */
export function queryWithGrade(params) {
  return request({
    url: ORG_URL() + '/role/queryWithGrade',
    method: 'post',
    data: params
  })
}
/**
 * 复制角色信息
 * @param {*} params
 */
export function copy(params) {
  return request({
    url: ORG_URL() + '/role/copy',
    method: 'post',
    params,
    isLoading: true
  })
}
