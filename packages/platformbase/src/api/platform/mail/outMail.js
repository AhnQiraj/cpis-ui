import request from '@platform/utils/request'
import { MAIL_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: MAIL_URL() + +'/mail/outMail/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function deleted(params) {
  return request({
    url: MAIL_URL() + +'/mail/outMail/deleted',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 彻底删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: MAIL_URL() + +'/mail/outMail/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 同步外部邮件
 * @param {*} params
 */
export function sync(params) {
  return request({
    url: MAIL_URL() + +'/mail/outMail/sync',
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
    url: MAIL_URL() + +'/mail/outMail/save',
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
    url: MAIL_URL() + +'/mail/outMail/get',
    method: 'get',
    params
  })
}
// 获取邮件信息
export function getTreeData(params) {
  return request({
    url: MAIL_URL() + +'/mail/outMail/getTreeData',
    params: params
  })
}
/**
 * 查询常用联系人
 * @param {*} params
 */
export function getLinkManTreeData(params) {
  return request({
    url: MAIL_URL() + +'/mail/outMail/getLinkManTreeData',
    method: 'post',
    params
  })
}
