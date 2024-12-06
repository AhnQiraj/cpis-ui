import 'element-ui/lib/theme-chalk/index.css'
import TableContainer from './TableContainer.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '容器组件/表格容器',
  component: TableContainer,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { TableContainer },
      template: '<TableContainer />'
    }
  },
  argTypes: {
    type: {
      description: '状态',
      control: 'select',
      options: ['submitted', 'draft', 'completed', 'cancelled', 'overdue']
    },
    label: {
      description: '标签内文字',
      control: 'text'
    }
  },
  args: {
    type: 'submitted',
    label: '文字'
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Submitted = {
  name: '燃料案例'
}
