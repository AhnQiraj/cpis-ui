<script>
import { Form, Descriptions, DescriptionsItem } from 'element-ui'
export default {
  name: 'CpisForm',
  props: {
    column: {
      type: Number,
      default: 2
    }
  },
  render(h) {
    const { column } = this
    // 处理插槽内容，将每个 form-item 包装在 descriptions-item 中，并移除 form-item 的 label
    const wrappedSlots =
      this.$slots.default?.map(vnode => {
        if (vnode.componentOptions && vnode.componentOptions.propsData) {
          // 从 form-item 中获取 label 值并删除它
          const label = vnode.componentOptions.propsData.label
          delete vnode.componentOptions.propsData.label
          return h(
            DescriptionsItem,
            {
              props: {
                label,
                labelStyle: {
                  fontSize: '14px',
                  background: '#f5f5f5',
                  width: '220px',
                  textAlign: 'right',
                  color: '#595959'
                }
              }
            },
            [vnode]
          )
        }
        return vnode
      }) || []

    return h(
      Form,
      {
        class: 'cpis-form',
        props: {
          ...this.$props,
          labelWidth: '0px',
          labelPosition: 'right'
        },
        on: this.$listeners,
        attrs: this.$attrs
      },
      [
        h(
          Descriptions,
          {
            props: {
              column,
              border: true,
              size: 'mini'
            }
          },
          wrappedSlots
        )
      ]
    )
  }
}
</script>
<style scoped>
::v-deep .el-form-item {
  margin-bottom: 0 !important;
}
::v-deep .el-input__inner {
  border: none !important;
  padding: 0 !important;
}
.cpis-form {
  flex: 1;
}
::v-deep .el-descriptions-item__content {
  padding: 0px 10px !important;
}
</style>
