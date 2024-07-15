import request from '@platform/utils/request'
import { SOCKET_URL } from '@platform/api/baseUrl'
/**
 * 根据伪链下载
 * @param {*} params
 */
export function downloadByLink(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/download',
    method: 'post',
    params: params
  })
}
/**
 * 标记为已下载
 * @param {*} params
 */
export function markDownloaded(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/markDownloaded',
    method: 'post',
    params: params
  })
}
/**
 * 取我的消息列表
 * @param {*} params
 */
export function getDownloadList(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/query',
    method: 'post',
    data: params
  })
}
/**
 * 文件接收列表接口
 * @param {*} params
 */
export function receive(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/query/my/receive',
    method: 'post',
    data: params
  })
}
/**
 * 文件明细接口
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/get',
    method: 'get',
    params: params
  })
}
/**
 * 文件删除接口
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/remove',
    method: 'post',
    params: params
  })
}
/**
 * 首页右上角未下载文件图标接口
 * @param {*} params
 */
export function unreadReceive(params) {
  return request({
    url: SOCKET_URL() + '/socket/file/query/my/unread/receive',
    method: 'post',
    data: params
  })
}
