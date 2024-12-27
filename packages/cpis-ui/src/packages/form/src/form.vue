<script>
import { Form, Descriptions, DescriptionsItem } from 'element-ui'
import CpisFormSection from './form-section.vue'
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
    // 找出所有 section 和 其他（form-item）
    const { sections = [], otherSlots } = this.splitSlots(this.$slots.default)
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
      // 每一个section 都通过Descriptions 包裹并渲染。因element-ui 的Descriptions 组件内部过滤了非DescriptionsItem 的子节点
      sections?.length > 0
        ? sections.map(section => {
            return h(
              Descriptions,
              {
                props: {
                  title: section?.componentOptions?.propsData?.title,
                  column,
                  border: true,
                  size: 'mini'
                }
              },
              [
                // 将 section 内部的（form-item） 传入函数
                ...this.getWrappedSlots(h, section?.componentOptions?.children),
                ...this.getWrappedSlots(h, otherSlots)
              ]
            )
          })
        : [
            h(
              Descriptions,
              {
                props: {
                  column,
                  border: true,
                  size: 'mini'
                }
              },
              this.getWrappedSlots(h, this.$slots.default)
            )
          ]
    )
  },
  methods: {
    splitSlots(nodes) {
      const sections = []
      const otherSlots = []
      nodes.forEach(vnode => {
        if (
          vnode.componentOptions &&
          vnode.componentOptions.Ctor?.options?.name === 'CpisFormSection'
        ) {
          sections.push(vnode)
        } else {
          otherSlots.push(vnode)
        }
      })
      return { sections, otherSlots }
    },
    getWrappedSlots(h, nodes) {
      return (
        nodes?.map(vnode => {
          if (
            vnode.componentOptions &&
            vnode.componentOptions.propsData &&
            vnode.componentOptions.Ctor?.options?.name === 'ElFormItem'
          ) {
            const label = vnode.componentOptions.propsData.label
            const prop = vnode.componentOptions.propsData.prop
            const span =
              vnode.componentOptions.propsData.span || vnode.data?.attrs?.span
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
      )
    },
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
<style scoped lang="scss">
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
::v-deep .el-descriptions {
  &:not(:first-child) {
    margin-top: 16px;
  }
}
::v-deep .el-descriptions__header {
  @apply bg-blue-1 mb-2 h-[32px];
  & > .el-descriptions__title {
    @apply text-base font-bold relative ml-[10px];
    &::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background-color: var(--level-6);
    }
  }
}
</style>
