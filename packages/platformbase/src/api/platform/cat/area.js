import request from '@platform/utils/request'
import { CAT_URL } from '@platform/api/baseUrl'
export function getAreaData(params = {}) {
  return request({
    url: CAT_URL() + '/cat/area/getData',
    method: 'post',
    data: params
  })
}
export function get(params = {}) {
  return request({
    url: CAT_URL() + '/cat/area/get',
    method: 'get',
    params
  })
}
