import 'element-ui/lib/theme-chalk/index.css'
import CpisTag from '../../../packages/cpis-ui/src/packages/tag/index'

/**
 * ## CpisTag 的状态 Mapping
 * 以下业务状态的值，会映射到 CpisTag 的 type 属性。举个例子： `<cpis-tag type="completed">`和 `<cpis-tag type="end">` 的颜色是同一个。不传就是默认发起
 *
 *
 * | 业务状态 | 对照字典值 |
 * |---------|---------|
 * | submitted, 默认,其他 | 发起，提交，其他状态 |
 * | draft | 拟定，拟稿 |
 * | completed， end | 结束，完成 |
 * | cancelled, cancel | 作废，取消 |
 * | overdue | 超期 |
 */

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/标签',
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

export const Default = {
  args: {
    label: '默认'
  },
  name: '默认'
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
