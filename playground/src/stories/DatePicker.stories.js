import CpisDatePicker from '../../../packages/cpis-ui/src/packages/date-picker/index.js'
/**
 *
 * CPIS DatePicker 是一个基于 element-ui 的日期选择器组件，除了统一解决了一下的样式问题外，其余和 Element-ui 的 DatePicker 组件一致。
 * 1. 日期图标位置放在后面，当存在清楚图标时候，隐藏日期图标
 * 2. 调整了输入框的 padding-left 为 10px
 * 3. border 会随着主题色变更而变更
 * 更多详情请参考 [DatePicker](https://element.eleme.cn/#/zh-CN/component/date-picker)

 **/
export default {
  title: '原子组件/日期选择器',
  component: CpisDatePicker,
  argTypes: {
    type: {
      control: 'select',
      options: [
        'date',
        'daterange',
        'datetime',
        'datetimerange',
        'month',
        'year'
      ]
    },
    size: {
      control: 'select',
      options: ['large', 'default', 'small']
    },
    placeholder: {
      control: 'text'
    },
    format: {
      control: 'text'
    },
    readonly: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    }
  },
  tags: ['autodocs'],
  args: {
    size: 'default'
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDatePicker },
      template: `<CpisDatePicker v-model="value" :size="size" :placeholder="placeholder" :format="format" :readonly="readonly" :disabled="disabled" />`
    }
  }
}

// 基础日期选择器
export const Basic = () => ({
  components: {
    CpisDatePicker
  },
  template: `
    <cpis-date-picker
      v-model="value"
      type="date"
      clearable
      placeholder="选择日期">
    </cpis-date-picker>
  `,
  data() {
    return {
      value: ''
    }
  }
})
