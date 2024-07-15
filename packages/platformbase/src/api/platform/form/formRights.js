import request from '@platform/utils/request'
import { FORM_URL } from '@platform/api/baseUrl'
/**
 * 获取表单权限
 * @param {*} data
 */
export function getPermission(data) {
  return request({
    // url: FORM_URL() + '/form/rights/getPermission',
    url: FORM_URL() + '/form/rights/getPermissionMap',
    method: 'post',
    data: data
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: FORM_URL() + '/form/rights/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
// 表单模块
/**
 * 保存表单权限信息
 * @param {*} params
 */
export function savePermission(params) {
  return request({
    url: FORM_URL() + '/form/rights/savePermission',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 重置表单权限设置
 * @param {*} params
 */
export function resetRights(params) {
  return request({
    url: FORM_URL() + '/form/rights/resetRights',
    method: 'post',
    isLoading: true,
    data: params
  })
}
// 流程模块
/**
 * 保存流程表单权限
 * @param {*} params
 */
export function saveFlowPermission(params) {
  return request({
    url: FORM_URL() + '/form/rights/saveFlowPermission',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 重置流程表单权限
 * @param {*} params
 */
export function resetFlowPermission(params) {
  return request({
    url: FORM_URL() + '/form/rights/resetFlowPermission',
    method: 'post',
    isLoading: true,
    data: params
  })
}
