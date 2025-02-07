import CpisTabs from '../../../packages/cpis-ui/src/packages/tabs/index'
import CpisTabPane from '../../../packages/cpis-ui/src/packages/tab-pane/index'

export default {
  title: '原子组件/tabs',
  component: CpisTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '标签页，用法直接参考https://element.eleme.cn/#/zh-CN/component/tabs,二次封装只是解决了样式的共性问题'
      }
    }
  }
}

// 基础用法
export const Basic = () => ({
  components: { CpisTabs, CpisTabPane },
  data() {
    return {}
  },
  template: `
    <CpisTabs>
      <CpisTabPane label="标签页1">
        <div>标签页1内容</div>
      </CpisTabPane>
      <CpisTabPane label="标签页2">
        <div>标签页2内容</div>
      </CpisTabPane>
    </CpisTabs>
  `,
  methods: {}
})
