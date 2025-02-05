export default {
  inject: ['rootMenu'],
  computed: {
    indexPath() {
      const path = [this.index]
      let parent = this.$parent
      while (parent.$options.componentName !== 'ElMenu') {
        if (parent.index) {
          path.unshift(parent.index)
        }
        parent = parent.$parent
      }
      return path
    },
    parentMenu() {
      let parent = this.$parent
      while (
        parent &&
        ['ElMenu', 'ElSubmenu'].indexOf(parent.$options.componentName) === -1
      ) {
        parent = parent.$parent
      }
      return parent
    },
    paddingStyle() {
      if (this.rootMenu.mode !== 'vertical') return {}
      const step = 10
      let padding = step
      let parent = this.$parent

      if (this.rootMenu.collapse) {
        padding = step
      } else {
        while (parent && parent.$options.componentName !== 'ElMenu') {
          if (parent.$options.componentName === 'ElSubmenu') {
            padding += step
          }
          parent = parent.$parent
        }
      }
      return { paddingLeft: padding + 'px' }
    }
  }
}
