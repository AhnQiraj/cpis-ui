<script>
import { Tabs } from 'element-ui'
export default {
  extends: Tabs,
  name: 'CpisTabs',
  methods: {
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(
          vnode =>
            vnode.tag &&
            vnode.componentOptions &&
            vnode.componentOptions.Ctor.options.name === 'CpisTabPane'
        )
        // update indeed
        const panes = paneSlots.map(
          ({ componentInstance }) => componentInstance
        )
        const panesChanged = !(
          panes.length === this.panes.length &&
          panes.every((pane, index) => pane === this.panes[index])
        )
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-tabs__nav-wrap {
  @apply px-4;
}
::v-deep .el-tabs__item {
  height: 44px;
  line-height: 44px;
  font-weight: bold;
}
::v-deep .el-tabs__item.is-active {
  @apply text-primary-6;
}
::v-deep .el-tabs__item:hover {
  @apply text-primary-6 cursor-pointer;
}
::v-deep .el-tabs__active-bar {
  @apply bg-primary-6;
}
</style>
