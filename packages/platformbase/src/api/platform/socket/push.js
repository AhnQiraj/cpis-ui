import request from '@platform/utils/request'
import { SOCKET_URL } from '@platform/api/baseUrl'
/**
 * 获取 socket 用户凭证
 * @param {*} params
 */
export function getToken(params) {
  return request({
    url: SOCKET_URL() + '/socket/push/getToken',
    method: 'get',
    params: params
  })
}
/**
 * 给所有人推送一条相同的消息
 * @param {*} params
 */
export function pushEverybodyMessage(params) {
  return request({
    url: SOCKET_URL() + '/socket/push/pushEverybodyMessage',
    method: 'post',
    data: params
  })
}
/**
 * 给所有人推送多条不同的消息
 * @param {*} params
 */
export function pushEverybodyMessages(params) {
  return request({
    url: SOCKET_URL() + '/socket/push/pushEverybodyMessages',
    method: 'post',
    data: params
  })
}
/**
 * 给多人推送一条相同的消息
 * @param {*} params
 */
export function pushSomebodiesMessage(params) {
  return request({
    url: SOCKET_URL() + '/socket/push/pushSomebodiesMessage',
    method: 'post',
    data: params
  })
}
/**
 * 给多个人推送多条不同的消息
 * @param {*} params
 */
export function pushSomebodiesMessages(params) {
  return request({
    url: SOCKET_URL() + '/socket/push/pushSomebodiesMessages',
    method: 'post',
    data: params
  })
}
/**
 * 给某个人推送多条不同的消息
 * @param {*} params
 * @param {*} data
 */
export function pushSomebodyMessages(params, data) {
  return request({
    url: SOCKET_URL() + '/socket/push/pushSomebodyMessages',
    method: 'post',
    params: params,
    data: data
  })
}
