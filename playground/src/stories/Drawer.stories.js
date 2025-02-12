import { FormItem, Input } from 'element-ui'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/抽屉',
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
    },
    title: {
      description: '标题'
    }
  },
  args: {
    visible: false,
    'modal-append-to-body': false
  },
  tags: ['autodocs']
}
export const Default = {
  name: '默认',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      template: `
      <div>
        <CpisButton @click="visible = true">打开</CpisButton>
        <CpisDrawer :visible.sync="visible" :title="title" />
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

export const Footer = {
  name: '设置底部',
  parameters: {
    docs: {
      source: {
        code: `
<CpisDrawer :visible="visible" :title="title">
  <template #footer>
    <CpisButton type="primary">确定</CpisButton>
    <CpisButton>取消</CpisButton>
  </template>
</CpisDrawer>
      `
      }
    }
  },

  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      template: `
      <div>
        <CpisButton @click="visible = true">打开</CpisButton>
        <CpisDrawer :visible="visible" :title="title">
          <div class="flex-1">body</div>
          <template v-slot:footer>
            <CpisButton type="primary">确定</CpisButton>
            <CpisButton>取消</CpisButton>
          </template>
        </CpisDrawer>
      </div>
      `
    }
  },
  argTypes: {
    visible: {
      description: '是否显示',
      control: 'boolean'
    },
    title: {
      description: '标题',
      control: 'string'
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  }
}

export const TitleSlot = {
  name: '标题插槽',
  parameters: {
    docs: {
      transform: (code, story) => {
        // 自定义源码转换逻辑
        return code
      }
    }
  },
  parameters: {
    docs: {
      source: {
        code: `
<CpisDrawer :visible="visible">
  <template #title>
    标题插槽 <span>我可以是任何内容</span>
  </template>
</CpisDrawer>
        `
      }
    }
  },

  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      template: `
      <div>
        <CpisButton @click="visible = true">打开</CpisButton>
        <CpisDrawer :visible="visible" :title="title" :modal-append-to-body="false">
          <template #title>
            标题插槽 <span style="color: red;">我可以是任何内容</span>
          </template>
        </CpisDrawer>
      </div>
      `
    }
  },
  argTypes: {
    visible: {
      description: '是否显示',
      control: 'boolean'
    },
    title: {
      description: '标题',
      control: 'string'
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  }
}

export const TitleRightSlot = {
  name: '标题右侧插槽',
  parameters: {
    docs: {
      source: {
        code: `
        <CpisDrawer :visible="visible">
          <template #title>
            标题插槽 <span>我可以是任何内容</span>
          </template>
          <template #title-right>
            标题右侧插槽 <span>我可以是任何内容</span>
          </template>
        </CpisDrawer>`
      }
    }
  },

  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      template: `
      <div>
        <CpisButton @click="visible = true">打开</CpisButton>
        <CpisDrawer :visible.sync="visible" title="标题11">
            <template #title-right>
              右侧插槽
            </template>
        </CpisDrawer>
      </div>
      `
    }
  },
  argTypes: {
    visible: {
      description: '是否显示',
      control: 'boolean'
    },
    title: {
      description: '标题',
      control: 'string'
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  }
}

export const DrawerForm = {
  name: '配合表单-一行一个',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          formData: {
            name: '',
            age: ''
          },
          rules: {
            name: [{ required: false, message: '请输入姓名' }],
            age: [{ required: true, message: '请输入年龄' }]
          }
        }
      },
      template: `
      <div>
        <CpisButton @click="visible = true">打开</CpisButton>
        <CpisDrawer :visible.sync="visible" :title="title">
          <CpisForm :rules="rules" :column="column" ref="formRef">
            <cpis-form-section>
              <cpis-form-item label="姓名" prop="name">
                <el-input size="small" v-model="formData.name" />
              </cpis-form-item>
              <cpis-form-item label="年龄" prop="age">
                <el-input size="small" v-model="formData.age" />
              </cpis-form-item>
              <cpis-form-item label="联系电话" prop="phone">
                <el-input size="small" v-model="formData.phone" />
              </cpis-form-item>
              <cpis-form-item label="电子邮箱地址" prop="email">
                <el-input size="small" v-model="formData.email" />
              </cpis-form-item>
              <cpis-form-item label="居住地址" prop="address">
                <el-input size="small" v-model="formData.address" />
              </cpis-form-item>
              <cpis-form-item label="工作单位名称" prop="company">
                <el-input size="small" v-model="formData.company" />
              </cpis-form-item>
              <cpis-form-item label="所属部门" prop="department">
                <el-input size="small" v-model="formData.department" />
              </cpis-form-item>
              <cpis-form-item label="职务职称" prop="position">
                <el-input size="small" v-model="formData.position" />
              </cpis-form-item>
              <cpis-form-item label="最高学历" prop="education">
                <el-input size="small" v-model="formData.education" />
              </cpis-form-item>
              <cpis-form-item label="毕业院校" prop="school">
                <el-input size="small" v-model="formData.school" />
              </cpis-form-item>
              <cpis-form-item label="专业技能证书" prop="certificate">
                <el-input size="small" v-model="formData.certificate" />
              </cpis-form-item>
              <cpis-form-item label="工作经验年限" prop="experience">
                <el-input size="small" v-model="formData.experience" />
              </cpis-form-item>
              <cpis-form-item label="期望薪资范围" prop="salary">
                <el-input size="small" v-model="formData.salary" />
              </cpis-form-item>
            </cpis-form-section>
          </CpisForm>
          <template #footer>
            <CpisButton type="primary" @click="handleConfirm">确定</CpisButton>
            <CpisButton>取消</CpisButton>
          </template>
        </CpisDrawer>
      </div>
      `,
      methods: {
        handleConfirm() {
          this.$refs.formRef.validate(valid => {
            console.log(valid)
          })
        }
      }
    }
  },
  argTypes: {
    visible: {
      description: '是否显示',
      control: 'boolean'
    },
    title: {
      description: '标题',
      control: 'string'
    },
    column: {
      description: '列数',
      control: 'number'
    }
  },
  args: {
    visible: false,
    title: '这里是标题',
    column: 1
  }
}

export const DrawerFormTwo = {
  name: '配合表单-一行两个',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          formData: {
            name: '',
            age: ''
          }
        }
      },
      template: `
      <div>
        <CpisButton @click="visible = true">打开</CpisButton>
        <cpis-drawer :visible.sync="visible" :title="title">
          <cpis-form>
            <cpis-form-section :columns="2">
              <cpis-form-item label="姓名" prop="name">
                <el-input size="small" v-model="formData.name" />
              </cpis-form-item>
              <cpis-form-item label="年龄" prop="age">
                <el-input size="small" v-model="formData.age" />
              </cpis-form-item>
            </cpis-form-section>
          </cpis-form>
          <template #footer>
            <CpisButton type="primary">确定</CpisButton>
            <CpisButton>取消</CpisButton>
          </template>
        </cpis-drawer>
      </div>
      `
    }
  },
  argTypes: {
    visible: {
      description: '是否显示',
      control: 'boolean'
    },
    title: {
      description: '标题',
      control: 'string'
    },
    column: {
      description: '列数',
      control: 'number'
    }
  },
  args: {
    visible: false,
    title: '这里是标题',
    column: 1
  }
}

// export const DrawerFormCustomWidth = {
//   name: '配合表单-自定义宽度',
//   render: (args, { argTypes }) => {
//     return {
//       props: Object.keys(argTypes),
//       data() {
//         return {
//           formData: {
//             name: '',
//             age: ''
//           }
//         }
//       },
//       template: `
//       <div>
//         <cpis-button @click="visible = true">打开</cpis-button>
//         <cpis-drawer :visible.sync="visible" :title="title">
//           <cpis-form :column="column" :label-width="labelWidth">
//             <cpis-form-section>
//               <cpis-form-item label="姓名" prop="name">
//                 <el-input size="small" v-model="formData.name" />
//               </cpis-form-item>
//               <cpis-form-item label="年龄" prop="age">
//                 <el-input size="small" v-model="formData.age" />
//               </cpis-form-item>
//             </cpis-form-section>
//           </cpis-form>
//           <template #footer>
//             <cpis-button type="primary">确定</cpis-button>
//             <cpis-button>取消</cpis-button>
//           </template>
//         </cpis-drawer>
//       </div>
//       `
//     }
//   },
//   argTypes: {
//     visible: {
//       description: '是否显示',
//       control: 'boolean'
//     },
//     title: {
//       description: '标题',
//       control: {
//         type: 'text'
//       }
//     },
//     column: {
//       description: '列数',
//       control: 'number'
//     },
//     labelWidth: {
//       description: '标签宽度',
//       control: {
//         type: 'text'
//       }
//     },
//     contentWidth: {
//       description: '内容宽度',
//       control: {
//         type: 'text'
//       }
//     }
//   },
//   args: {
//     visible: false,
//     title: '这里是标题',
//     column: 1,
//     labelWidth: '200'
//   }
// }
