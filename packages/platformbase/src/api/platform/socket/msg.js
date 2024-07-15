import request from '@platform/utils/request'
import { SOCKET_URL } from '@platform/api/baseUrl'
/**
 * 标记为已读
 * @param {*} params
 */
export function markRead(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/markRead',
    method: 'post',
    data: params
  })
}
/**
 * 取我的消息列表
 * @param {*} params
 */
export function getMessageList(params) {
  return request({
    url: SOCKET_URL() + '/socket/message/query',
    method: 'post',
    data: params
  })
}
