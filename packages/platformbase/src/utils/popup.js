import Vue from "vue"
import { PopupManager } from "element-ui/lib/utils/popup"
import utils from "./util"
const popup = {
  /**
   *修复zindex 不是最高的被遮住
   */
  getZIndex() {
    let zIndex = this.getCurZindex()
    const z = PopupManager.zIndex
    if (zIndex >= z) {
      for (let i = 0; i < zIndex - z + 1; i++) {
        PopupManager.nextZIndex()
      }
      zIndex = PopupManager.zIndex
    } else {
      zIndex = z
    }
    return zIndex
  },
  getCurZindex() {
    let zIndex = (Vue.prototype.$ELEMENT || {}).zIndex || 2000
    const allEl = Array.from(document.body.querySelectorAll("*"))
    if (utils.isNotEmpty(allEl)) {
      if (Array.isArray(allEl)) {
        allEl.forEach(el => {
          const computedZIdex = Number(window.getComputedStyle(el).zIndex) || 0
          if (computedZIdex > zIndex) {
            zIndex = computedZIdex
          }
        })
      }
    }
    return
  },
  getFixedZIndex(zIndex = 0) {
    const z = PopupManager.zIndex
    if (zIndex > z) {
      for (let i = 0; i < zIndex - z + 1; i++) {
        PopupManager.nextZIndex()
      }
      zIndex = PopupManager.zIndex
    } else {
      zIndex = z
    }
    return zIndex
  }
}
export default popup
