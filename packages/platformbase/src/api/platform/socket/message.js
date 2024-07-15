import request from '@platform/utils/request'
import { SOCKET_URL } from '@platform/api/baseUrl'
/**
 * 消息发送列表接口
 * @param {*} params
 */
export function send(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/query/my/send',
    method: 'post',
    data: params
  })
}
/**
 * 消息接收列表接口
 * @param {*} params
 */
export function receive(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/query/my/receive',
    method: 'post',
    data: params
  })
}
/**
 * 消息标记已读接口
 * @param {*} params
 */
export function markRead(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/markRead',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 消息明细接口
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/get',
    method: 'get',
    params: params
  })
}
/**
 * 消息删除接口
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 首页右上角未读消息图标接口
 * @param {*} params
 */
export function unreadReceive(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/query/my/unread/receive',
    method: 'post',
    data: params
  })
}
