import request from '@platform/utils/request'
import { MAIL_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: MAIL_URL() + +'/mail/mailConfig/query',
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
    url: MAIL_URL() + +'/mail/mailConfig/remove',
    method: 'get',
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
    url: MAIL_URL() + +'/mail/mailConfig/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 测试
 * @param {*} params
 */
export function test(params) {
  return request({
    url: MAIL_URL() + +'/mail/mailConfig/test',
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
    url: MAIL_URL() + +'/mail/mailConfig/get',
    method: 'get',
    params: params
  })
}
/**
 * 获取用户配置
 * @param {*} params
 */
export function findConfigList(params) {
  return request({
    url: MAIL_URL() + +'/mail/mailConfig/findConfigList',
    method: 'get',
    params: params
  })
}
