// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/Dialog',
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
    'modal-append-to-body': false, // 为所有故事添加默认参数
    visible: false
  },
  tags: ['autodocs']
}
export const Default = {
  name: '默认',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      methods: {
        handleClick() {
          this.visible = true
        }
      },
      template: `
      <div><el-button type="primary" size="small" @click="handleClick">点击打开</el-button>
      <CpisDialog :visible="visible" :title="title" :modal-append-to-body="false" @close="visible = false">
        <div>
          <p>这里是内容</p>
        </div>
        <template #footer>
          <CpisButton @click="visible = false">取消</CpisButton>
          <CpisButton type="primary">确定</CpisButton>
        </template>
      </CpisDialog>
      </div>
      `
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  },
  name: '设置标题'
}
