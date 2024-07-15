import request from "@platform/utils/request"
import { ORG_URL } from "@platform/api/baseUrl"
/**
 * 获取所有员工信息
 */
export function findAll() {
	return request({
		url: ORG_URL() + "/employee/findAll",
		method: "get",
	})
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
	return request({
		url: ORG_URL() + "/employee/query",
		method: "post",
		data: params,
	})
}
/**
 * 查询列表数据
 * @param {*} params
 */
 export function queryUserList(params) {
  return request({
    url: ORG_URL() + "/employee/query",
    method: "post",
    data: params,
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
	return request({
		url: ORG_URL() + "/employee/remove",
		method: "post",
		isLoading: true,
		params: params,
	})
}
/**
 * 创建数据
 * @param {*} data
 */
export function create(data) {
	return request({
		url: ORG_URL() + "/employee/create",
		method: "post",
		isLoading: true,
		data,
	})
}
/**
 * 保存数据
 * @param {*} params
 */
export function update(data) {
	return request({
		url: ORG_URL() + "/employee/update",
		method: "post",
		isLoading: true,
		data,
	})
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
	return request({
		url: ORG_URL() + "/employee/get",
		method: "get",
		params,
	})
}
/**
 * 获取数据
 * @param {*} params
 */
export function load(params) {
	return request({
		url: ORG_URL() + "/employee/load",
		method: "get",
		params,
	})
}
/**
 * 获取数据(通过ID转换为名称)
 * @param {*} params
 */
export function transfer(params) {
	return request({
		url: ORG_URL() + "/employee/transfer",
		method: "post",
		data: params,
	})
}
/**
 * 用户激活
 * @param {*} params
 */
export function active(params) {
	return request({
		url: ORG_URL() + "/employee/active",
		method: "post",
		isLoading: true,
		params: params,
	})
}
/**
 * 用户禁用
 * @param {*} params
 */
export function disable(params) {
	return request({
		url: ORG_URL() + "/employee/disable",
		method: "post",
		isLoading: true,
		params: params,
	})
}
/**
 * 员工列表分页(带组织名称)
 * @param {*} params
 */
export function queryWithOrg(params) {
	return request({
		url: ORG_URL() + "/employee/queryWithOrg",
		method: "post",
		data: params,
	})
}
/**
 * 添加岗位人员
 * @param {*} params
 */
export function addPositionUser(params) {
	return request({
		url: ORG_URL() + "/employee/addPositionUser",
		method: "post",
		isLoading: true,
		data: params,
	})
}
/**
 * 移除岗位人员
 * @param {*} params
 */
export function removePositionUser(params) {
	return request({
		url: ORG_URL() + "/employee/removePositionUser",
		method: "post",
		isLoading: true,
		params: params,
	})
}
// ==========================组织人员======================
/**
 * 获取组织人员
 * @param {*} params
 */
export function queryOrgUser(params) {
	return request({
		url: ORG_URL() + "/employee/queryOrgUser",
		method: "post",
		data: params,
	})
}
/**
 * 移除组织人员
 * @param {*} params
 */
export function removeOrgUser(params) {
	return request({
		url: ORG_URL() + "/employee/removeOrgUser",
		method: "post",
		isLoading: true,
		params: params,
	})
}
/**
 * 添加组织人员数据
 * @param {*} params
 */
export function addOrgUser(params) {
	return request({
		url: ORG_URL() + "/employee/addOrgUser",
		method: "post",
		isLoading: true,
		data: params,
	})
}
/**
 * 获取未分配组织人员列表
 * @param {*} params
 */
export function queryWoutOrg(params) {
	return request({
		url: ORG_URL() + "/employee/queryWoutOrg",
		method: "post",
		data: params,
	})
}
// ==========================上下级======================
// 员工下属列表分页
export function queryUnderPageList(params) {
	return request({
		url: ORG_URL() + "/employee/queryUnder",
		method: "post",
		data: params,
	})
}
// 员工上级列表分页
export function querySuperiorPageList(params) {
	return request({
		url: ORG_URL() + "/employee/querySuperior",
		method: "post",
		data: params,
	})
}
// 添加员工下属
export function addUnder(params) {
	return request({
		url: ORG_URL() + "/employee/addUnder",
		method: "post",
		isLoading: true,
		data: params,
	})
}
// 移除员工下属
export function removeUnder(params) {
	return request({
		url: ORG_URL() + "/employee/removeUnder",
		method: "post",
		isLoading: true,
		params: params,
	})
}
// 查询用户上级
export function findSuperiors(params) {
	return request({
		url: ORG_URL() + "/employee/findSuperiors",
		method: "get",
		params,
	})
}
// ===================组织负责人管理============================================
/**
 * 查询组织负责人数据
 * @param {*} params
 */
export function queryOrgManager(params) {
	return request({
		url: ORG_URL() + "/employee/queryOrgManager",
		method: "post",
		data: params,
	})
}
/**
 * 删除组织负责人数据
 * @param {*} params
 */
export function removeOrgManager(params) {
	return request({
		url: ORG_URL() + "/employee/removeOrgManager",
		method: "post",
		isLoading: true,
		params: params,
	})
}
/**
 * 添加组织负责人数据
 * @param {*} params
 */
export function addOrgManager(params) {
	return request({
		url: ORG_URL() + "/employee/addOrgManager",
		method: "post",
		isLoading: true,
		data: params,
	})
}
// ===================角色人员管理============================================
/**
 * 获取角色人员数据
 * @param {*} params
 */
export function queryByRoleId(params) {
	return request({
		url: ORG_URL() + "/employee/queryByRoleId",
		method: "post",
		data: params,
	})
}
/**
 * 员工列表分页
 * @param {*} params
 */
export function queryWithOrg4Position(params) {
	return request({
		url: ORG_URL() + "/employee/queryWithOrg4Position",
		method: "post",
		data: params,
	})
}
/**
 * 添加角色人员数据
 * @param {*} params
 */
export function addRoleUser(params) {
	return request({
		url: ORG_URL() + "/role/addUser",
		method: "post",
		isLoading: true,
		params: params,
	})
}
/**
 * 移除角色人员
 * @param {*} params
 */
export function removeRoleUser(params) {
	return request({
		url: ORG_URL() + "/role/removeUser",
		method: "post",
		isLoading: true,
		params: params,
	})
}
