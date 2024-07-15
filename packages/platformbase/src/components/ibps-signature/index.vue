<!--
******************
采用vue-signature v2.7.0 https://github.com/WangShayne/vue-signature
hugh zhuang 修改功能
1、加入监听事件  v-on="listeners
2、增加props 的format
 -->
<template>
  <div :style="style" @touchmove.prevent>
    <canvas
      :id="uid"
      :data-uid="uid"
      :disabled="disabled"
      class="ibps-signature-canvas"
      v-on="listeners"
    />
  </div>
</template>
<script>
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import { isEqual } from 'element-ui/lib/utils/util'
import emitter from 'element-ui/lib/mixins/emitter'
import SignaturePad from 'signature_pad'
export default {
  name: 'IbpsSignature',
  mixins: [emitter],
  props: {
    sigOptions: {
      type: Object,
      default: () => {
        return {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0, 0, 0)'
        }
      }
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: '150px'
    },
    clearOnResize: {
      type: Boolean,
      default: false
    },
    waterMark: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    format: String,
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sig: null,
      init: false,
      canvas: null,
      option: {
        backgroundColor: 'rgb(255,255,255)',
        penColor: 'rgb(0, 0, 0)'
      },
      uid: ''
    }
  },
  computed: {
    style() {
      const style = {}
      const width = parseInt(this.width)
      const height = parseInt(this.height)
      Object.assign(style, {
        width: width <= 100 ? `${width}%` : `${width}px`,
        height: height <= 100 ? `${height}%` : `${height}px`
      })
      return style
    },
    listeners() {
      return {
        ...this.$listeners,
        touchend: this.onChange, // 触摸结束
        mouseout: this.onChange // 某个鼠标按键被松开
      }
    }
  },
  watch: {
    disabled(val) {
      this.handleDisabled()
    },
    value(val, oldVal) {
      if (!isEqual(val, oldVal)) {
        this.handleValue()
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    }
  },
  created() {
    this.uid = 'canvas' + this._uid
    const sigOptions = Object.keys(this.sigOptions)
    for (let item of sigOptions) {
      this.option[item] = this.sigOptions[item]
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.draw()
      this.timer = setInterval(() => {
        if (this.init) {
          clearInterval(this.timer)
        } else {
          if (this.canvas && !(this.canvas.offsetWidth === 0 || this.canvas.offsetHeight === 0)) {
            this.draw()
          }
        }
      }, 500)
    })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    removeResizeListener(this.$el, this.handleResize)
    this.canvas = null
    this.sig = null
  },
  methods: {
    onChange() {
      if (this.disabled) {return}
      this.$emit('input', this.getData())
      this.$emit('change', this.getData())
    },
    getData() {
      if (this.isEmpty()) {
        return ''
      }
      return this.sig ? this.sig.toDataURL(this.format) : ''
    },
    handleDisabled() {
      if (this.disabled) {
        this.sig.off()
      } else {
        this.sig.on()
      }
    },
    handleValue() {
      const val = this.value
      if (val === '' || val === null || val === undefined) {
        this.clear()
      } else {
        this.fromDataURL(val)
      }
    },
    draw() {
      if (this.init) {
        return
      }
      this.canvas = document.getElementById(this.uid)
      // 是否初始化
      this.init = !(this.canvas.offsetWidth === 0 || this.canvas.offsetHeight === 0)
      this.sig = new SignaturePad(this.canvas, this.option)
      addResizeListener(this.$el, this.resizeCanvas)
      this.resizeCanvas()
      this.handleValue()
      this.handleDisabled()
    },
    resizeCanvas() {
      let ratio = Math.max(window.devicePixelRatio || 1, 1)
      this.canvas.width = this.canvas.offsetWidth * ratio
      this.canvas.height = this.canvas.offsetHeight * ratio
      this.canvas.getContext('2d').scale(ratio, ratio)
      this.clear()
      !this.clearOnResize && this.handleValue()
      Object.keys(this.waterMark).length && this.addWaterMark(this.waterMark)
    },
    clear() {
      if (this.sig) {this.sig.clear()}
    },
    save(format) {
      return format ? this.sig.toDataURL(format) : this.sig.toDataURL()
      // signaturePad.toDataURL(); // save image as PNG
      // signaturePad.toDataURL("image/jpeg"); // save image as JPEG
      // signaturePad.toDataURL("image/svg+xml"); // save image as SVG
    },
    fromDataURL(url) {
      if (this.sig) {this.sig.fromDataURL(url)}
    },
    isEmpty() {
      return this.sig ? this.sig.isEmpty() : true
    },
    undo() {
      const data = this.sig.toData()
      if (data) {
        data.pop()
        this.sig.fromData(data)
      }
    },
    addWaterMark(data) {
      if (!(Object.prototype.toString.call(data) === '[object Object]')) {
        throw new Error('Expected Object, got ' + typeof data + '.')
      } else {
        let vCanvas = document.getElementById(this.uid)
        let textData = {
          text: data.text || '',
          x: data.x || 20,
          y: data.y || 20,
          sx: data.sx || 40,
          sy: data.sy || 40
        }
        let ctx = vCanvas.getContext('2d')
        ctx.font = data.font || '20px sans-serif'
        ctx.fillStyle = data.fillStyle || '#333'
        ctx.strokeStyle = data.strokeStyle || '#333'
        if (data.style === 'all') {
          ctx.fillText(textData.text, textData.x, textData.y)
          ctx.strokeText(textData.text, textData.sx, textData.sx)
        } else if (data.style === 'stroke') {
          ctx.strokeText(textData.text, textData.sx, textData.sx)
        } else {
          ctx.fillText(textData.text, textData.x, textData.y)
        }
        this.sig._isEmpty = false
      }
    }
  }
}
</script>
