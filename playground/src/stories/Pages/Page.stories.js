import MarginView from './Components/margin-view.vue'
import PaddingView from './Components/padding-view.vue'
export default {
  title: '界面/样式规范',
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: () => {
    return {
      template: '<div>123</div>'
    }
  }
}

// 创建一个模板组件
export const Margin = {

  render: (args, { argTypes, parameters }) => {    
    return {
      components: { MarginView },
      template:
        '<MarginView />'
    }
  },
  name: '外间距'
}

export const Padding = {
  render: () => {
    return {
      components: { PaddingView },
      template: '<PaddingView />'
    }
  },
  name: '内间距'
}