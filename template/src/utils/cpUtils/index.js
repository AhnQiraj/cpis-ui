import Vue from "vue"
import SnowflakeId from "snowflake-id"
// 时间转换
export function resolvingDate(param) {
  let d = new Date(param)
  let month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
  let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
  let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
  let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
  let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()
  let times = d.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + min + ":" + sec
  return times
}
export function formatDate(date, fmt) {
  if (typeof date === "string") {
    return date
  }
  if (!fmt) {
    fmt = "yyyy-MM-dd hh:mm:ss"
  }
  if (!date || date == null) {
    return null
  }
  let o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
    }
  }
  return fmt
}
export function formatDateSub(date, fmt) {
  if (typeof date === "string") {
    return date
  }
  if (!fmt) {
    fmt = "yyyy-MM-dd hh:mm:ss"
  }
  if (!date || date == null) {
    return null
  }
  let o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate() - 30, // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
    }
  }
  return fmt
}
// 调用：parserDate("2015-03-19 12::00:00")
export function parserDate(date) {
  let t = Date.parse(date)
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, "/")))
  } else {
    return new Date()
  }
}
export function getSnakId() {
  const id = new SnowflakeId()
  return id.generate()
}
/**
 * 获取sql语句
 * @param {} uri
 */
export function getSql(uri) {
  // let auColumnSqlAll = Vue.prototype.store.state.ibps.authsql.auColumnSqlAll
  // let sql = auColumnSqlAll[uri]
  // return sql || ""
  return ""
}
// 获取当前登录所有信息
export function getLoginInfo() {
  return JSON.parse(sessionStorage.getItem('INFO'))
}
/**
 * 关闭页签
 * @param {Object} tagName 可传空
 * @param {Object} newObj {path:'/cycd/sbqxlcgl/qxlb'}
 */
export function closeTab(pageName) {
  // 清理页面缓存,重新刷新
  if (pageName !== undefined) {
    Vue.prototype.store.commit("ibps/page/keepAliveRemove", pageName)
  }
  Vue.prototype.store.dispatch("ibps/page/close", { pageSelect: Vue.prototype.store.state.ibps.page.current })
}
/**
 * 清楚指定的缓存组件
 * @param {Object} obj
 */
export function clearCache(obj) {
  try {
    if (obj.$vnode.parent && obj.$vnode.parent.componentInstance && obj.$vnode.parent.componentInstance.cache) {
      if (obj.$vnode.componentOptions) {
        let key = obj.$vnode.key == null ? obj.$vnode.componentOptions.Ctor.cid + (obj.$vnode.componentOptions.tag ? `::${obj.$vnode.componentOptions.tag}` : "") : obj.$vnode.key
        let cache = obj.$vnode.parent.componentInstance.cache
        let keys = obj.$vnode.parent.componentInstance.keys
        if (cache[key]) {
          if (keys.length) {
            let index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          delete cache[key]
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}
// 获取用户公司信息
export function getDepName() {
  let dep = {
    id: "",
    name: ""
  }
  let userDep = JSON.parse(localStorage.getItem("userinfo"))
  if (userDep.orgName) {
    dep.name = userDep.orgName.split(".")[0]
    let depInfo = JSON.parse(localStorage.getItem("depInfo"))
    if (depInfo) {
      depInfo.map(item => {
        if (item.name == dep.name) {
          dep = item
          return false
        }
      })
    }
  }
  return dep
}
// 生成随机字符串
export function randomString(e) {
  e = e || 32
  let t = "ABCDEFGHJKMNPQRSTWXYZ2345678"
  let a = t.length
  let n = ""
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}
export function getImage(type, data) {
  let bytes = new Uint8Array(data)
  let len = bytes.byteLength
  let binary = ""
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:${type};base64,` + window.btoa(binary)
}
export function downLoadFile(data, fileType, name) {
  let a = document.createElement("a")
  let blob = new Blob([data], { type: fileType })
  let objectUrl = URL.createObjectURL(blob)
  a.setAttribute("href", objectUrl)
  a.setAttribute("download", name)
  a.click()
}
export function toDetailPage(curObj, boTypeNo, boId, woType) {
  switch (boTypeNo) {
    case "ta_pw":
      curObj.$addMainRouter({
        name: "regularWork-woReguWorkListBrowse",
        params: {
          data: { planId: boId },
          type: "view"
        }
      })
      break
    case "ta_mp":
      curObj.$addMainRouter({
        name: "operatingRepairs-viewPlan",
        query: {
          id: boId,
          isView: 1
        }
      })
      break
    case "领料单":
      curObj.$addMainRouter({
        name: "materialsManagement-collarInfo",
        query: {
          id: boId,
          isView: 1
        }
      })
      break
    case "退料单":
      curObj.$addMainRouter({
        name: "materialsManagement-backInfo",
        query: {
          id: boId,
          isView: 1
        }
      })
      break
    default:
      break
  }
}
// 判断动态URL是否存在
export function pagePathUrl(pageCode) {
  let pagePathList = JSON.parse(sessionStorage.getItem('INFO')).pagePathList
  let page = pagePathList.find(p => p.pageCode === pageCode)
  if (page) {
    return page
  } else {
    return null
  }
}
// 公司编码
export const orgNo = "HNJX"
