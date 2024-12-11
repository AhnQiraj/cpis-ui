import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/按钮',
  component: CpisButton,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['type', 'loading', 'disabled']
    },
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisButton },
      template: '<cpis-button v-bind="$props">按钮</cpis-button>'
    }
  },
  argTypes: {
    loading: {
      description: '是否加载中',
      control: 'boolean'
    },
    disabled: {
      description: '是否禁用',
      control: 'boolean'
    },
    type: {
      description: '类型',
      control: 'select',
      options: ['primary', 'text']
    }
  }
}
export const Default = {
  name: 'Default'
}
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    type: 'primary'
  },
  name: 'Primary'
}

export const Text = {
  args: {
    type: 'text'
  },
  name: 'Text'
}
