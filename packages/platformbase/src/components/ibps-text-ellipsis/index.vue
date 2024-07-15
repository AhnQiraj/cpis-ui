<template>
  <div class="ibps-text-ellipsis" :style="{ width: setPx(width, '100%') }">
    <slot name="before" class="ibps-text-ellipsis__before" />
    <el-tooltip :content="text" :disabled="!(useTooltip && isHide)" :placement="placement">
      <span>
        <span ref="text" :key="keyIndex" class="ibps-text-ellipsis__text">{{ text }}</span>
      </span>
    </el-tooltip>
    <span ref="more" class="ibps-text-ellipsis__more">
      <slot v-show="oversize" name="more" />
    </span>
    <slot name="after" class="ibps-text-ellipsis__after" />
  </div>
</template>
<script>
export default {
  name: "IbpsTextEllipsis",
  props: {
    text: String,
    height: Number,
    width: Number,
    isLimitHeight: {
      type: Boolean,
      default: true
    },
    useTooltip: {
      type: Boolean,
      default: false
    },
    placement: String,
    moreText: {
      type: String,
      default: "..."
    }
  },
  data() {
    return {
      keyIndex: 0,
      oversize: false,
      isHide: false
    }
  },
  watch: {
    isLimitHeight() {
      this.init()
    },
    text() {
      this.init()
    },
    height() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.oversize = false
      this.keyIndex += 1
      const more = this.$refs.more
      more.style.display = "none"
      if (this.isLimitHeight) {
        this.limitShow()
      }
    },
    /**
     * 设置px像素
     */
    setPx(val, defval = "") {
      if (this.$utils.isEmpty(val)) {
        val = defval
      }
      if (this.$utils.isEmpty(val)) {
        return ""
      }
      val = val + ""
      if (val.indexOf("%") === -1) {
        val = val + "px"
      }
      return val
    },
    limitShow() {
      this.$nextTick(() => {
        const textDom = this.$refs.text
        const title = this.$el
        const more = this.$refs.more
        if (textDom) {
          if (title.offsetHeight > this.height) {
            let n = 1000
            more.style.display = "inline-block"
            let text = this.text
            while (title.offsetHeight > this.height && n > 0) {
              if (title.offsetHeight > this.height * 3) {
                textDom.innerText = text = text.substring(0, Math.floor(text.length / 2))
              } else {
                textDom.innerText = text = text.substring(0, text.length - 1)
              }
              n--
            }
            this.$emit("hide")
            this.isHide = true
          } else {
            this.$emit("show")
            this.isHide = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.ibps-text-ellipsis {
  &__more {
    padding: 0 2px;
  }
}
</style>
