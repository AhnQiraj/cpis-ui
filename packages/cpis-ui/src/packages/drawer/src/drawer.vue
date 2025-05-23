<template>
  <transition name="el-drawer-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div class="el-drawer__wrapper" tabindex="-1" v-show="visible">
      <div
        class="el-drawer__container"
        :class="visible && 'el-drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1"
      >
        <div
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          :aria-label="title"
          class="el-drawer cpis-drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${drawerSize}` : `height: ${drawerSize}`"
          ref="drawer"
          role="dialog"
          tabindex="-1"
        >
          <header class="el-drawer__header" id="el-drawer__title" v-if="withHeader">
            <div class="drawer-title">
              <slot name="title">
                <span role="heading" :title="title">{{ title }}</span>
              </slot>
            </div>
            <div class="drawer-title-right title-right">
              <slot name="title-right"></slot>
            </div>
            <button
              :aria-label="`close ${title || 'drawer'}`"
              class="el-drawer__close-btn"
              type="button"
              v-if="showClose"
              @click="closeDrawer"
            >
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </header>
          <section class="el-drawer__body" v-if="rendered">
            <slot></slot>
          </section>
          <footer class="drawer-footer" v-if="rendered && $slots.footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/lib/utils/popup'
import emitter from 'element-ui/lib/mixins/emitter'

export default {
  name: 'CpisDrawer',
  mixins: [Popup, emitter],
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    beforeClose: {
      type: Function
    },
    customClass: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'rtl',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      }
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: [Number, String],
      default: '30%'
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean
    },
    wrapperClosable: {
      type: Boolean,
      default: true
    },
    withHeader: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr'
    },
    drawerSize() {
      return typeof this.size === 'number' ? `${this.size}px` : this.size
    }
  },
  data() {
    return {
      closed: false,
      prevActiveElement: null
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
        this.prevActiveElement = document.activeElement
      } else {
        if (!this.closed) {
          this.$emit('close')
          if (this.destroyOnClose === true) {
            this.rendered = false
          }
        }
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus()
          }
        })
      }
    }
  },
  methods: {
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        if (this.destroyOnClose === true) {
          this.rendered = false
        }
        this.closed = true
      }
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    handleClose() {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      this.closeDrawer()
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

<style>
.cpis-drawer.el-drawer .el-drawer__header {
  @apply h-[42px] px-2 p-0 flex items-center;
  margin-bottom: 0 !important;
  background-color: #f5f5f5;
  border-bottom: 1px solid #d9d9d9;
  color: #262626;
}
.cpis-drawer.el-drawer .drawer-title {
  @apply text-base font-bold;
}
.cpis-drawer.el-drawer .el-drawer__header > :first-child {
  @apply !flex-none;
}
.cpis-drawer.el-drawer .drawer-footer {
  display: flex;
  justify-content: flex-start;
  padding: 8px;
  border-top: 1px solid #d9d9d9;
  position: sticky; /* 添加固定定位 */
  bottom: 0; /* 固定在底部 */
  background: #fff; /* 添加背景色防止内容透过 */
}
.cpis-drawer.el-drawer .drawer-content {
  flex: 1;
  overflow-y: auto; /* 添加滚动 */
  overflow-x: hidden;
}
.cpis-drawer.el-drawer .el-drawer__body {
  display: flex;
  flex-direction: column;
}
</style>
