<template>
  <transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible" class="el-dialog__wrapper .cpis-dialog__wrapper" @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'el-dialog flex flex-col min-w-[560px]',
          {
            'max-h-[80vh]': !fullscreen,
            'is-fullscreen': fullscreen,
            'el-dialog--center': center,
            'aspect-video': keepAspectRatio
          },
          customClass
        ]"
        ref="dialog"
        :style="style"
      >
        <div class="el-dialog__header cpis-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="el-dialog__headerbtn"
              aria-label="Fullscreen"
              v-if="showFullscreen"
              @click="fullscreen = !fullscreen"
            >
              <i class="el-dialog__close el-icon el-icon-full-screen"></i>
            </button>
            <button type="button" class="el-dialog__headerbtn" aria-label="Close" v-if="showClose" @click="handleClose">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
        </div>
        <div class="el-dialog__body cpis-dialog__body" v-if="rendered">
          <slot></slot>
        </div>
        <div class="el-dialog__footer cpis-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/lib/utils/popup'
import Migrating from 'element-ui/lib/mixins/migrating'
import emitter from 'element-ui/lib/mixins/emitter'

export default {
  name: 'CpisDialog',

  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },
    showFullscreen: {
      type: Boolean,
      default: false
    },

    width: String,
    size: {
      type: String,
      default: 'medium',
      validator(value) {
        // 40 60 80
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    keepAspectRatio: {
      type: Boolean,
      default: true
    },

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },

    destroyOnClose: Boolean
  },

  data() {
    return {
      closed: false,
      key: 0,
      fullscreen: false
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        this.$el.addEventListener('scroll', this.updatePopper)
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper)
        if (!this.closed) this.$emit('close')
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++
          })
        }
      }
    }
  },

  computed: {
    computedFullscreen() {
      // 外部没传 就data中定义的fullscreen
      return this.$attrs.fullscreen === undefined ? this.fullscreen : this.$attrs.fullscreen
    },
    style() {
      let style = {}
      if (!this.fullscreen) {
        style.marginTop = this.top
        if (this.width || this.size) {
          style.width =
            this.width === undefined
              ? {
                  small: '40%',
                  medium: '60%',
                  large: '80%'
                }[this.size]
              : this.width
        }
      }
      return style
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          size: 'size is removed.'
        }
      }
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return
      this.handleClose()
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper')
      this.broadcast('ElDropdownMenu', 'updatePopper')
    },
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss">
.cpis-dialog__footer.el-dialog__footer {
  @apply flex items-center justify-center border-t border-t-solid border-t-gray-3 p-0 h-[64px];
}
// 头部样式
.el-dialog__header.cpis-dialog__header {
  @apply flex items-center justify-between h-[40px] border-b border-b-solid border-b-gray-3 p-x-4 p-y-0 bg-gray-2;
  & .el-dialog__headerbtn {
    top: unset;
    right: unset;
    position: unset;
  }
}
// 标题样式
.el-dialog__header.cpis-dialog__header .el-dialog__title {
  @apply text-base font-bold;
}
.el-dialog__body.cpis-dialog__body {
  @apply flex-1 bg-gray-2 overflow-hidden p-2;
}
</style>
