import CpisForm from '../../../packages/cpis-ui/src/packages/form/index'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/表单',
  component: CpisForm,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisForm },
      template: `
      <CpisForm>
      </CpisForm>
      `
    }
  },
  argTypes: {
    title: {
      description: '标题',
      control: 'string'
    },
    column: {
      description: '每一行数量',
      control: 'number'
    },
    visible: {
      description: '是否显示',
      control: 'boolean'
    }
  },
  args: {
    visible: false
  }
}
export const Default = {
  name: '一行显示一个',
  args: {
    visible: false
  }
}
