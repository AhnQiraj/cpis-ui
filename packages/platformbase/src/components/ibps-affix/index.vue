<template>
  <div ref="placeholderNode" class="ibps-affix__placeholder" :style="placeholderStyle">
    <div ref="fixedNode" :class="{'ibps-affix':!!affixStyle}" :style="affixStyle">
      <slot />
    </div>
  </div>
</template>
<script>
/**
   * 图钉组件
   *
   */
import { on, off } from 'element-ui/lib/utils/dom'
import { throttle, isEqual } from 'lodash'
import PopupManager from '@platform/utils/popup'
function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : { top: 0, left: 0, bottom: 0 }
}
function getScroll(target, top) {
  if (typeof window === 'undefined') {
    return 0
  }
  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'
  const isWindow = target === window
  let ret = isWindow ? target[prop] : target[method]
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== 'number') {
    ret = window.document.documentElement[method]
  }
  return ret
}
function getOffset(element, target) {
  const elemRect = element.getBoundingClientRect()
  const targetRect = getTargetRect(target)
  const scrollTop = getScroll(target, true)
  const scrollLeft = getScroll(target, false)
  const docElem = window.document.body
  const clientTop = docElem.clientTop || 0
  const clientLeft = docElem.clientLeft || 0
  return {
    top: elemRect.top - targetRect.top + scrollTop - clientTop,
    left: elemRect.left - targetRect.left + scrollLeft - clientLeft,
    width: elemRect.width,
    height: elemRect.height
  }
}
function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null
}
/**
   * 插槽
   * @member slots
   * @property {string} default 默认插槽，定义内容
   */
export default {
  name: 'IbpsAffix',
  /**
     * 属性参数
     * @member props
     * @property {Number} [offsetTop] 距离窗口顶部达到指定偏移量后触发
     * @property {Number} [offsetBottom] 距离窗口底部达到指定偏移量后触发
     * @property {Function} [target] 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
     */
  props: {
    // 距离窗口顶部达到指定偏移量后触发
    offsetTop: Number,
    offsetBottom: Number,
    target: Function,
    mode: String // default 默认模式，就不更新位置
  },
  data() {
    this.events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load']
    this.eventHandlers = {}
    return {
      affixStyle: null,
      placeholderStyle: null,
      zIndex: (this.$ELEMENT || {}).zIndex || 2000
    }
  },
  watch: {
    target(val) {
      this.clearEventListeners()
      this.setTargetEventListeners(val)
      // Mock Event object.
      this.updatePosition()
    },
    offsetTop() {
      this.updatePosition()
    },
    offsetBottom() {
      this.updatePosition()
    }
  },
  beforeMount() {
    this.updatePosition = throttle(this.updatePosition, this)
  },
  mounted() {
    const target = this.target || getDefaultTarget
    this.$nextTick(() => {
      // Wait for parent component ref has its value
      this.timeout = setTimeout(() => {
        this.setTargetEventListeners(target)
        // Mock Event object.
        this.updatePosition()
      }, 16)
    })
  },
  beforeDestroy() {
    this.clearEventListeners()
    clearTimeout(this.timeout)
    this.affixStyle = null
    this.placeholderStyle = null
  },
  methods: {
    setAffixStyle(e, affixStyle) {
      const { target = getDefaultTarget } = this
      const originalAffixStyle = this.affixStyle
      const isWindow = target() === window
      if (e.type === 'scroll' && originalAffixStyle && affixStyle && isWindow) {
        return
      }
      if (isEqual(affixStyle, originalAffixStyle)) {
        return
      }
      this.affixStyle = affixStyle
      /**
         * 固定状态改变时触发
         * @event change
         * @param {boolean} fixed 是否固定
         */
      this.$emit('change', !!this.affixStyle)
    },
    setPlaceholderStyle(placeholderStyle) {
      const originalPlaceholderStyle = this.placeholderStyle
      if (isEqual(placeholderStyle, originalPlaceholderStyle)) {
        return
      }
      this.placeholderStyle = placeholderStyle
    },
    syncPlaceholderStyle(e) {
      const { affixStyle, placeholderStyle } = this
      if (!affixStyle) {
        return
      }
      this.$refs.placeholderNode.style.cssText = ''
      this.setAffixStyle(e, {
        ...affixStyle,
        width: this.$refs.placeholderNode.offsetWidth + 'px'
      })
      this.setPlaceholderStyle({
        zIndex: this.zIndex,
        ...placeholderStyle,
        width: this.$refs.placeholderNode.offsetWidth + 'px'
      })
    },
    updatePosition(e = {}) {
      const { offsetBottom, offset, target = getDefaultTarget } = this
      let { offsetTop } = this
      const targetNode = target()
      // Backwards support
      // Fix: if offsetTop === 0, it will get undefined,
      //   if offsetBottom is type of number, offsetMode will be { top: false, ... }
      offsetTop = typeof offsetTop === 'undefined' ? offset : offsetTop
      if (!this.$refs.fixedNode) {
        return
      }
      const scrollTop = getScroll(targetNode, true)
      const affixNode = this.$el
      const elemOffset = getOffset(affixNode, targetNode)
      const elemSize = {
        width: this.$refs.fixedNode.offsetWidth,
        height: this.$refs.fixedNode.offsetHeight
      }
      const offsetMode = {
        top: false,
        bottom: false
      }
      // Default to `offsetTop=0`.
      if (typeof offsetTop !== 'number' && typeof offsetBottom !== 'number') {
        offsetMode.top = true
        offsetTop = 0
      } else {
        offsetMode.top = typeof offsetTop === 'number'
        offsetMode.bottom = typeof offsetBottom === 'number'
      }
      this.zIndex = PopupManager.getFixedZIndex(this.zIndex)
      const targetRect = getTargetRect(targetNode)
      const targetInnerHeight = targetNode.innerHeight || targetNode.clientHeight
      // Fixed Top
      if (offsetMode.top && scrollTop >= elemOffset.top - offsetTop) {
        const width = `${elemOffset.width}px`
        const top = `${targetRect.top + offsetTop}px`
        this.setAffixStyle(e, {
          position: 'fixed',
          top,
          left: `${targetRect.left + elemOffset.left}px`,
          width
        })
        this.setPlaceholderStyle({
          zIndex: this.zIndex,
          width,
          height: `${elemSize.height}px`
        })
        // Fixed Bottom
      } else if (
        offsetMode.bottom && scrollTop <= elemOffset.top + elemSize.height + offsetBottom - targetInnerHeight
      ) {
        const targetBottomOffet = targetNode === window ? 0 : window.innerHeight - targetRect.bottom
        const width = `${elemOffset.width}px`
        this.setAffixStyle(e, {
          position: 'fixed',
          bottom: targetBottomOffet + offsetBottom + 'px',
          left: targetRect.left + elemOffset.left + 'px',
          width
        })
        this.setPlaceholderStyle({
          zIndex: this.zIndex,
          width,
          height: elemOffset.height + 'px'
        })
      } else {
        const { affixStyle } = this
        // Fixed resize
        if (e.type === 'resize' &&
            affixStyle &&
            affixStyle.position === 'fixed' &&
            affixNode.offsetWidth
        ) {
          this.setAffixStyle(e, { ...affixStyle, width: affixNode.offsetWidth + 'px', zIndex: this.zIndex })
        } else {
          this.setAffixStyle(e, null)
        }
        this.setPlaceholderStyle(null)
      }
      if (e.type === 'resize') {
        this.syncPlaceholderStyle(e)
      }
      this.$emit('view-update', this)
    },
    setTargetEventListeners(getTarget) {
      const target = getTarget()
      if (!target) {
        return
      }
      this.clearEventListeners()
      this.events.forEach(eventName => {
        on(target, eventName, this.updatePosition)
        this.eventHandlers[eventName] = {
          target,
          eventName,
          handler: this.updatePosition
        }
      })
    },
    clearEventListeners() {
      this.events.forEach(eventName => {
        const handler = this.eventHandlers[eventName]
        if (handler) {
          off(handler.target, handler.eventName, handler.handler)
        }
      })
    }
  }
}
</script>
