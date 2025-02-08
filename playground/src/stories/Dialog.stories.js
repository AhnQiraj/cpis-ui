/**
 * ## CpisDialog 的设计
 * 基于 Element-UI 的 Dialog 组件进行二次封装。解决统一的布局问题，新增了全屏功能。

 * 
 * ## CpisDialog 和 ElDialog 的不同
 * - 新增了 showFullscreen 属性，用于配置是否显示全屏按钮。
 * 
 * ## CpisDialog 参数
 ### CpisDialog Attributes
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | showFullscreen  | 是否显示全屏按钮 | boolean   | - |  false |
 */

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

export const ShowFullscreen = {
  name: '显示全屏按钮',
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
        <CpisDialog :visible="visible" :title="title" :modal-append-to-body="false" @close="visible = false" :show-fullscreen="true">
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
  }
}

// export const DialogTable = {
//   name: '对话框表格',
//   render: (args, { argTypes }) => {
//     return {
//       props: Object.keys(argTypes),
//       methods: {
//         handleClick() {
//           this.visible = true
//         }
//       },
//       template: `
//         <div><el-button type="primary" size="small" @click="handleClick">点击打开</el-button>
//         <CpisDialogTable :visible="visible" :title="title" :modal-append-to-body="false" @close="visible = false">
//           <div>
//             <p>这里是内容</p>
//           </div>
//           <template #footer>
//             <CpisButton @click="visible = false">取消</CpisButton>
//             <CpisButton type="primary">确定</CpisButton>
//           </template>
//         </CpisDialogTable>
//         </div>
//         `
//     }
//   },
//   args: {
//     visible: false,
//     title: '这里是标题'
//   },
//   name: '设置标题'
// }
