import JsCookies from "js-cookie"
import setting from "@/setting.js"
const cookies = {
  /**
   * @description 存储 cookie 值
   * @param {String} name cookie name
   * @param {String} value cookie value
   * @param {Object} setting cookie setting
   * @param {Boolean} Whether the prefix
   *
   */
  set: function (name = "default", value = "", cookieSetting = {}, isPrefix = true) {
    const currentCookieSetting = {
      expires: null
    }
    Object.assign(currentCookieSetting, cookieSetting)
    JsCookies.set(isPrefix ? setting.globalKey + "-" + name : name, value || "", currentCookieSetting)
  },
  /**
   * @description 获取 cookie 值
   * @param {String} name cookie name
   * @param {Boolean} Whether the prefix
   */
  get: function (name = "default", isPrefix = true) {
    //qiankun子应用跟主应用不共用cookie，顾需要用document.cookie在主应用中获取cookie
    let microsCookies
    if (document.cookie) {
      let bomCookies = document.cookie.replaceAll(" ", "")
      bomCookies = bomCookies.split(";")
      bomCookies.map(item => {
        if (item.indexOf(name) !== -1) {
          //token和refresh_token会重复
          if (name === "token") {
            if (item.indexOf("refresh_token") === -1) {
              microsCookies = item.split("=")[1]
            }
          } else {
            microsCookies = item.split("=")[1]
          }
        }
      })
    }
    return microsCookies
  },
  /**
   * @description 获取 cookie 全部的值
   */
  getAll: function () {
    return JsCookies.get()
  },
  /**
   * @description 删除 cookie
   * @param {String} name cookie name
   * @param {Boolean} Whether the prefix
   */
  remove: function (name = "default", isPrefix = true) {
    return JsCookies.remove(isPrefix ? setting.globalKey + "-" + name : name)
  }
}
export default cookies
