import 'element-ui/lib/theme-chalk/index.css'
import { CpisTag } from '@cpis/cpis-ui'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '容器组件/伸缩容器',
  component: CpisTag,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisTag },
      template: '<CpisTag :type="type" >{{label}}</CpisTag>'
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
  args: {
    type: 'submitted',
    label: '提交'
  },
  name: '提交'
}

export const Draft = {
  args: {
    type: 'draft',
    label: '拟稿'
  },
  name: '拟稿'
}

export const Completed = {
  args: {
    type: 'completed',
    label: '完成'
  },
  name: '完成'
}

export const Cancelled = {
  args: {
    type: 'cancelled',
    label: '取消'
  },
  name: '取消'
}
export const Overdue = {
  args: {
    type: 'overdue',
    label: '超期'
  },
  name: '超期'
}
