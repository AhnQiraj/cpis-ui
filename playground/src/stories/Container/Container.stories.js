import 'element-ui/lib/theme-chalk/index.css'
import CpisPageContainer from '../../../../packages/cpis-ui/src/packages/page-container/index.js'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  components: { CpisPageContainer },
  title: '容器组件/页容器',
  component: CpisPageContainer,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisPageContainer
      },
      template:
        '<div style="height: 500px; padding: 16px; background-color: #f5f5f5;">' +
        '<CpisPageContainer :title="title" :layout="layout">' +
        '<div slot="aside">侧边栏</div>' +
        '<div slot="main">主内容</div>' +
        '<div slot="footer">页脚</div>' +
        '</CpisPageContainer>' +
        '</div>'
    }
  },
  argTypes: {
    title: {
      description: '标题',
      control: 'text'
    },
    layout: {
      description:
        '布局，支持["header", "main", "footer"] 或 ["aside", ["header", "main", "footer"]]',
      control: 'array'
    }
  },
  args: {
    title: '标题，主内容和页脚',
    layout: ['header', 'main', 'footer']
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    title: '标题，主内容和页脚',
    layout: ['header', 'main', 'footer']
  },
  name: '上中下'
}

export const HeaderMain = {
  args: {
    title: '标题和主内容',
    layout: ['header', 'main']
  },
  name: '上中'
}

export const CustomHeader = {
  args: {
    title: '标题和主内容',
    layout: ['header', 'main']
  },
  name: '自定义标题',
  render: args => ({
    components: { CpisPageContainer },
    template:
      '<div style="height: 500px; padding: 16px; background-color: #f5f5f5;">' +
      '<CpisPageContainer :layout="["header", "main"]">' +
      '<div slot="header">自定义标题</div>' +
      '<div slot="main">主内容</div>' +
      '</CpisPageContainer>' +
      '</div>'
  })
}

export const AsideHeaderMain = {
  args: {
    title: '侧边栏，标题和主内容',
    layout: ['aside', ['header', 'main', 'footer']]
  },
  name: '侧边栏 + 上中下'
}
