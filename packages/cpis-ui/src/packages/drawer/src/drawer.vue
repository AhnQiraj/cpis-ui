<script>
import { Drawer } from 'element-ui'
export default {
  components: { ELDrawer: Drawer },
  name: 'CpisDrawer',
  render(h) {
    const slots = this.$slots
    return h(
      Drawer,
      {
        props: this.$attrs,
        on: this.$listeners
      },
      [
        slots.default
          ? h('div', { class: 'drawer-content' }, [slots.default])
          : null,
        slots.footer
          ? h('div', { class: 'drawer-footer' }, [slots.footer])
          : null
      ]
    )
  }
}
</script>

<style scoped>
::v-deep .el-drawer .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #d9d9d9;
  font-size: 16px;
  line-height: 24px;
  color: #262626;
  font-weight: 700;
}
.drawer-footer {
  display: flex;
  justify-content: flex-start;
  padding: 8px;
  border-top: 1px solid #d9d9d9;
}
.drawer-content {
  flex: 1;
}
::v-deep .el-drawer__body {
  display: flex;
  flex-direction: column;
}
</style>
