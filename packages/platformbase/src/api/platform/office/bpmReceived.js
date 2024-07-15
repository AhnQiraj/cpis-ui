import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 我的待办列表
 * @param {*} params
 */
export function pending(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-待办事务-用户类型
 * @param {*} params
 */
export function pending4User(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/user',
    method: 'post',
    data: params
  })
}
/**
 * 代办事宜
 * @param {*} params
 */
export function pending4UserExtend(params) {
  return request({
    url: '/extend/v3/bpm/received/query/pending/userExtend',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-待办事务-组织类型
 * @param {*} params
 */
export function pending4Org(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/org',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-待办事务-组织负责人类型
 * @param {*} params
 */
export function pending4OrgManager(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/org/manager',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-待办事务-角色类型
 * @param {*} params
 */
export function pending4Role(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/role',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-待办事务-岗位类型
 * @param {*} params
 */
export function pending4Position(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/position',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-待办事务-用户组类型
 * @param {*} params
 */
export function pending4Group(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/group',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-转办事务
 * @param {*} params
 */
export function pending4Shift(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/shift',
    method: 'post',
    data: params
  })
}
/**
 * 个人中心-代理事务
 * @param {*} params
 */
export function pending4Assignee(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/pending/assignee',
    method: 'post',
    data: params
  })
}
/**
 * 我的办结列表
 * @param {*} params
 */
export function completed(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/completed',
    method: 'post',
    data: params
  })
}
/**
 * 我的已办事宜
 * @param {*} params
 */
export function handled(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/handled',
    method: 'post',
    data: params
  })
}
/**
 * 我的可撤销列表
 * @param {*} params
 */
export function revokable(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/handled/revokable',
    method: 'post',
    data: params
  })
}
/**
 * 已办任务列表
 * @param {*} params
 */
export function handledTask(params) {
  return request({
    url: BPMN_URL() + '/bpm/received/query/handled/task',
    method: 'post',
    data: params
  })
}
