/**
 * 日志（log）工具类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
function typeColor(type = "default") {
  let color = ""
  switch (type) {
    case "default":
      color = "#35495E"
      break
    case "primary":
      color = "#3488ff"
      break
    case "success":
      color = "#43B883"
      break
    case "warning":
      color = "#e6a23c"
      break
    case "danger":
      color = "#f56c6c"
      break
    case "error":
      color = "#f56c6c"
      break
    default:
      break
  }
  return color
}
const log = {
  /**
   * @description 控制台打印一个 [ title | text ] 样式的信息
   * @param {String} title title text
   * @param {String} info info text
   * @param {String} type style
   */
  capsule: function (title, info, type = "primary") {
    console.log(`%c ${title} %c ${info} %c`, "background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;", `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`, "background:transparent")
  },
  /**
   * @description 控制台打印彩色文字
   */
  colorful: function (textArr) {
    console.log(`%c${textArr.map(t => t.text || "").join("%c")}`, ...textArr.map(t => `color: ${typeColor(t.type)};`))
  },
  /**
   * @description 控制台打印 default 样式的文字
   */
  default: function (text) {
    log.colorful([{ text }])
  },
  /**
   * @description 控制台打印 primary 样式的文字
   */
  primary: function (text) {
    log.colorful([{ text, type: "primary" }])
  },
  /**
   * @description 控制台打印 success 样式的文字
   */
  success: function (text) {
    log.colorful([{ text, type: "success" }])
  },
  /**
   * @description 控制台打印 warning 样式的文字
   */
  warning: function (text) {
    log.colorful([{ text, type: "warning" }])
  },
  /**
   * @description 控制台打印 danger 样式的文字
   */
  danger: function (text) {
    log.colorful([{ text, type: "danger" }])
  },
  /**
   * @description 控制台打印 error 样式的文字
   */
  error: function (text) {
    log.colorful([{ text, type: "error" }])
  }
}
export default log
