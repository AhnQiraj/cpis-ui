<template>
  <li v-if="divided" class="ibps-contextmenu__divided" />
  <li v-else class="ibps-contextmenu__item" :class="classes" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click.prevent.stop="handleClick">
    <div class="ibps-contextmenu__left">
      <span class="ibps-contextmenu__icon">
        <ibps-icon v-if="iconProps" v-bind="iconProps" />
      </span>
      <span class="ibps-contextmenu__label">{{ label }}</span>
    </div>
    <div class="ibps-contextmenu__right">
      <span v-if="info" class="ibps-contextmenu__info">{{ info }}</span>
      <i v-if="hasChild" class="ibps-contextmenu__arrow el-icon-caret-right" />
    </div>
    <slot v-if="active" :active="active" :children="children" />
  </li>
</template>
<script>
export default {
  props: {
    icon: [String, Object],
    label: String,
    info: String,
    disabled: Boolean,
    divided: Boolean,
    children: Array
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    iconProps() {
      if (!this.icon) {
        return null
      }
      return typeof this.icon === 'object'
        ? this.icon
        : {
            name: this.icon
          }
    },
    classes() {
      return {
        'is-disabled': this.disabled,
        'is-has-child': this.hasChild
      }
    },
    hasChild() {
      return this.children && this.children.length > 0
    }
  },
  methods: {
    handleMouseEnter(e) {
      this.active = true
      if (this.hasChild) {
        this.$nextTick(() => {
          this.$emit('submenu', this)
        })
      }
    },
    handleMouseLeave(e) {
      this.active = false
    },
    handleClick(e) {
      if (this.disabled) {
        return
      }
      this.$emit('click', this)
    }
  }
}
</script>
