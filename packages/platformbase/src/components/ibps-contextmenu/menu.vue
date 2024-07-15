<template>
  <ul v-if="items && items.length >0" class="ibps-contextmenu__menu">
    <ibps-menu-item
      v-for="(item, index) in items"
      :key="index"
      v-bind="item"
      @click="handleClick(item, $event)"
      @submenu="handleActive"
    >
      <template #default="{children, active}">
        <ibps-menu v-if="children && active" :items="children" :class="menuClass" />
      </template>
    </ibps-menu-item>
  </ul>
</template>
<script>
import IbpsMenuItem from './menu-item'
export default {
  name: 'IbpsMenu',
  components: {
    IbpsMenuItem
  },
  inject: ['wrapper'],
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    this.rect = null
    return {
      left: false,
      bottom: false
    }
  },
  computed: {
    menuClass() {
      return {
        'is-left': this.left,
        'is-bottom': this.bottom
      }
    }
  },
  mounted() {
    this.rect = this.$el ? this.$el.getBoundingClientRect && this.$el.getBoundingClientRect() : null
  },
  methods: {
    handleClick(item, e) {
      /**
         * 点击菜单项时触发
         * @event click
         * @param {Object} item 菜单项数据
         * @param {Object} vm 菜单项实例
         */
      this.wrapper.$emit('click', item, e)
      this.wrapper.visible = false
    },
    handleActive(vm) {
      const itemRect = vm.$el.getBoundingClientRect()
      const rect = this.rect
      const targetRect = this.wrapper.triggerTarget.getBoundingClientRect()
      const x = itemRect.x + itemRect.width
      const y = itemRect.y
      this.bottom = rect.height + y - targetRect.top >= targetRect.height
      this.left = rect.width + x - targetRect.left >= targetRect.width
    }
  }
}
</script>
