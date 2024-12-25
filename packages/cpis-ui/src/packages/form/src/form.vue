<script>
import { Form, Descriptions, DescriptionsItem } from 'element-ui'
export default {
  name: 'CpisForm',
  props: {
    column: {
      type: Number,
      default: 2
    },
    labelWidth: {
      type: [String, Number],
      default: 'auto'
    },
    contentWidth: {
      type: [String, Number],
      default: 'auto'
    }
  },
  render(h) {
    const { column } = this
    // 处理插槽内容，将每个 form-item 包装在 descriptions-item 中，并移除 form-item 的 label
    const wrappedSlots =
      this.$slots.default?.map(vnode => {
        if (vnode.componentOptions && vnode.componentOptions.propsData) {
          const label = vnode.componentOptions.propsData.label
          const prop = vnode.componentOptions.propsData.prop
          // 获取 span 属性，优先从 props 中获取，如果没有则从 attrs 中获取
          const span =
            vnode.componentOptions.propsData.span || vnode.data?.attrs?.span
          // 检查是否有必填规则
          const rules = this.$attrs.rules?.[prop]
          const isRequired = Array.isArray(rules)
            ? rules.some(rule => rule.required)
            : rules?.required

          delete vnode.componentOptions.propsData.label
          return h(
            DescriptionsItem,
            {
              props: {
                label: h('span', [
                  isRequired && h('span', { class: 'required-star' }, ' *'),
                  label
                ]),
                span: span || 1,
                labelStyle: {
                  fontSize: '14px',
                  width:
                    typeof this.labelWidth === 'number'
                      ? this.labelWidth + 'px'
                      : this.labelWidth,
                  background: '#f5f5f5',
                  textAlign: 'right',
                  color: '#595959'
                },
                contentStyle: {
                  width:
                    typeof this.contentWidth === 'number'
                      ? this.contentWidth + 'px'
                      : this.contentWidth
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
        attrs: this.$attrs,
        ref: 'elForm'
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
  },
  methods: {
    validate(...args) {
      return this.$refs.elForm.validate(...args)
    },
    validateField(...args) {
      return this.$refs.elForm.validateField(...args)
    },
    resetFields(...args) {
      return this.$refs.elForm.resetFields(...args)
    },
    clearValidate(...args) {
      return this.$refs.elForm.clearValidate(...args)
    }
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
.required-star {
  @apply text-error mr-1;
}
::v-deep .el-form-item__error {
  @apply text-error top-unset bottom-0;
}
</style>
