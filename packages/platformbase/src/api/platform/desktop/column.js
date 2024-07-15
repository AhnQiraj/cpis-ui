import request from '@platform/utils/request'
import ActionUtils from '@platform/utils/action'
import { SYSTEM_URL, PLATFORM_BASE_URL, BUSINESS_BASE_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: SYSTEM_URL() + '/desktop/column/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SYSTEM_URL() + '/desktop/column/remove',
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
    url: SYSTEM_URL() + '/desktop/column/save',
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
    url: SYSTEM_URL() + '/desktop/column/get',
    method: 'get',
    params: params
  })
}
/**
 * 校验模板别名
 * @param {*} params
 */
export function checkCode(params) {
  return request({
    url: SYSTEM_URL() + '/desktop/column/checkCode',
    method: 'get',
    params: params
  })
}
/**
 * 初始化模版
 * @param {*} params
 */
export function initTemplate() {
  return request({
    url: SYSTEM_URL() + '/desktop/column/initTemplate',
    isLoading: true,
    method: 'post'
  })
}
/**
 * 设置 桌面栏目 启用/禁用
 * @param {*} params
 */
export function setEnable(params) {
  return request({
    url: SYSTEM_URL() + '/desktop/column/setEnable',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获得有权限的桌面栏目
 */
export function findHashRightsColumn(params) {
  return request({
    url: SYSTEM_URL() + '/desktop/column/findHashRightsColumn',
    method: 'get',
    params: params
  })
}
/**
 * 获取每个栏目的数据
 * @param {*} params 参数
 * <p>
 *    alias 栏目别名
 *    params 参数 包含分页或者其他固定参数
 * </p>
 */
export function getData({ alias, dataMode, dataFrom, dataMethod }, params, isQuery = true) {
  if (dataMode === 2) { // 后端的restful接口
    dataFrom = dataFrom.replace('{{PLATFORM_BASE_URL}}', PLATFORM_BASE_URL).replace('{{BUSINESS_BASE_URL}}', BUSINESS_BASE_URL)
    if (isQuery) {
      return request({
        url: dataFrom,
        method: dataMethod || 'get',
        params
      })
    } else {
      return request({
        url: dataFrom,
        method: dataMethod || 'post',
        data: params
      })
    }
  } else {
    return request({
      url: SYSTEM_URL() + '/desktop/column/getData',
      method: 'post',
      data: ActionUtils.formatParams({
        alias: alias,
        params: JSON.stringify(params)
      })
    })
  }
}
