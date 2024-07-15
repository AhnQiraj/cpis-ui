import request from '@platform/utils/request'
import { SOCKET_URL } from '@platform/api/baseUrl'
/**
 * 根据伪链下载
 * @param {*} params
 */
export function enabled(params) {
  return request({
    url: SOCKET_URL() + '/socket/enabled',
    method: 'get',
    params: params
  })
}
