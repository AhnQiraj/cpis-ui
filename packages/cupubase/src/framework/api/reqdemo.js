import { businessRequest, systemRequest } from '@cupu/plugins/axios/index.js';

/**
 * 根据数据模板key值，获取对应数据
 * @param {Object} query
 */
export function findDataByKey (param) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: param
  });
}

/**
 * 根据数据模板key值，获取对应数据
 * @param {Object} query
 */
export function queryTreeData (param) {
  return systemRequest({
    url: '/business/v3/data/template/queryTreeData',
    method: 'post',
    data: param
  });
}
/**
 * 组织请求表单数据
 * @param {*} param
 */
export function getTreeData (param) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: param
  });
}
/**
 * 请求表单数据
 * @param {*} param
 */
export function getTable (param) {
  return systemRequest({
    // url: '/platform/v3/employee/queryOrgUser',
    url: '/platform/v3/employee/query',
    method: 'post',
    data: param
  });
}

/**
 * 全部测点查询  根据设备位置测点查询
 * @param {*} param
 */
export function getPoint (param) {
  return systemRequest({
    url: '/equipment/v3/eqMeaPoint/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 组织人员列表
 * @param {Object} param
 */
export function getUserInfoByOrgId (param) {
  return systemRequest({
    url: '/employee/queryOrgUser',
    method: 'post',
    data: param
  });
}

/**
 * 平台组织接口    获取部门,可以是多个部门
 * @param {Object} param
 */
export function getDeptId (param) {
  return systemRequest({
    url: '/extend/v3/entity/getDepIdList',
    method: 'get',
    params: param
  });
}

/**
 * 平台组织接口    获取部门,单个部门
 * @param {Object} param
 */
export function getdeptId (param) {
  return systemRequest({
    url: '/extend/v3/entity/getDepId',
    method: 'get',
    params: param
  });
}

