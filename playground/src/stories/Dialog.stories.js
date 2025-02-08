import CpisDialog from '../../../packages/cpis-ui/src/packages/dialog/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/Dialog',
  component: CpisDialog,
  layout: 'fullscreen',
  decorators: [
    () => ({
      template: `
        <div style="height: 400px; position: relative; border: 1px solid #eee;">
          <story />
        </div>
      `
    })
  ],
  argTypes: {
    visible: {
      description: '是否显示'
    }
  },
  args: {
    visible: false,
    'modal-append-to-body': false // 为所有故事添加默认参数
  },
  tags: ['autodocs']
}
export const Default = {
  name: '默认',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDialog, CpisButton },
      template: `
      <CpisDialog :visible="visible" :title="title" :modal-append-to-body="false">
        <div>
          <p>这里是内容</p>
        </div>
        <template #footer>
          <CpisButton>取消</CpisButton>
          <CpisButton type="primary">确定</CpisButton>
        </template>
      </CpisDialog>
      `
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  },
  name: '设置标题'
}
