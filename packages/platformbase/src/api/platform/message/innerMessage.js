import request from '@platform/utils/request'
import { MSG_URL } from '@platform/api/baseUrl'
/**
 * 查询收到的内部消息
 * @param {*} params
 */
export function queryReceivePageList(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/receive',
    method: 'post',
    data: params
  })
}
/**
 * 查询发送的内部消息
 * @param {*} params
 */
export function querySentPageList(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/sent',
    method: 'post',
    data: params
  })
}
/**
 * 查询已回复列表数据
 * @param {*} params
 */
export function getReplyPageList(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessageReply/query',
    method: 'post',
    data: params
  })
}
/**
 * 查询已读取列表数据
 * @param {*} params
 */
export function getReadPageList(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessageRead/query',
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
    url: MSG_URL() + '/msg/innerMessage/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 标记为已读
 * @param {*} params
 */
export function markRead(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/markRead',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 回复
 * @param {*} params
 */
export function saveReply(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/saveReply',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 获取数据(包含列表数据)
 * @param {*} params
 */
export function get(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/get',
    method: 'get',
    params
  })
}
/**
 * 保存内部消息
 * @param {*} params
 */
export function save(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 取我的消息列表
 * @param {*} params
 */
export function getMsgList(params) {
  return request({
    url: MSG_URL() + '/msg/innerMessage/msgList',
    method: 'get',
    data: params
  })
}
