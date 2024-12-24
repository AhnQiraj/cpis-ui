import CpisDrawer from '../../../packages/cpis-ui/src/packages/drawer/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
import CpisForm from '../../../packages/cpis-ui/src/packages/form/index'
import { FormItem, Input } from 'element-ui'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/抽屉',
  component: CpisDrawer,
  tags: ['autodocs'],
  layout: 'fullscreen',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer, CpisButton },
      template: `
      <CpisDrawer :visible="false" :title="title">
      </CpisDrawer>
      `
    }
  },
  argTypes: {
    visible: {
      description: '是否显示'
    },
    title: {
      description: '标题'
    }
  },
  args: {
    visible: false
  }
}
export const Demo = {
  name: '不要点上面那个，从这个下面开始点，进去以后点击visible开关，展示抽屉',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer, CpisButton, CpisForm },
      template: `
      <CpisDrawer :visible="visible" :title="title">
        <div class="flex-1">body</div>
        <template #footer>
          <CpisButton type="primary">确定</CpisButton>
          <CpisButton>取消</CpisButton>
        </template>
      </CpisDrawer>
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
export const Default = {
  name: '默认',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer },
      template: `
      <CpisDrawer :visible="visible" :title="title">
      </CpisDrawer>
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
  },
  name: '设置标题'
}

export const Footer = {
  name: '设置底部',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer, CpisButton, CpisForm },
      template: `
      <CpisDrawer :visible="visible" :title="title">
        <div class="flex-1">body</div>
        <template #footer>
          <CpisButton type="primary">确定</CpisButton>
          <CpisButton>取消</CpisButton>
        </template>
      </CpisDrawer>
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
      components: {
        CpisDrawer,
        CpisForm,
        CpisButton,
        ElFormItem: FormItem,
        ElInput: Input
      },
      data() {
        return {
          formData: {
            name: '',
            age: ''
          },
          rules: {
            name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
            age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
          }
        }
      },
      template: `
      <CpisDrawer :visible="visible" :title="title">
        <div class="p-2">
          <CpisForm :rules="rules" :column="column" ref="formRef">
            <el-form-item label="姓名" prop="name">
              <el-input size="small" v-model="formData.name" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input size="small" v-model="formData.age" />
            </el-form-item>
          </CpisForm>
        </div>
        <template #footer>
          <CpisButton type="primary" @click="handleConfirm">确定</CpisButton>
          <CpisButton>取消</CpisButton>
        </template>
      </CpisDrawer>
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
      components: {
        CpisDrawer,
        CpisForm,
        CpisButton,
        ElFormItem: FormItem,
        ElInput: Input
      },
      data() {
        return {
          formData: {
            name: '',
            age: ''
          }
        }
      },
      template: `
      <CpisDrawer :visible="visible" :title="title">
        <div class="p-2">
          <CpisForm :column="column">
            <el-form-item label="姓名" prop="name">
              <el-input size="small" v-model="formData.name" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input size="small" v-model="formData.age" />
            </el-form-item>
          </CpisForm>
        </div>
        <template #footer>
          <CpisButton type="primary">确定</CpisButton>
          <CpisButton>取消</CpisButton>
        </template>
      </CpisDrawer>
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

export const DrawerFormCustomWidth = {
  name: '配合表单-自定义宽度',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisDrawer,
        CpisForm,
        CpisButton,
        ElFormItem: FormItem,
        ElInput: Input
      },
      data() {
        return {
          formData: {
            name: '',
            age: ''
          }
        }
      },
      template: `
      <CpisDrawer :visible="visible" :title="title">
        <div class="p-2">
          <CpisForm :column="column" :label-width="labelWidth" :content-width="contentWidth">
            <el-form-item label="姓名" prop="name">
              <el-input size="small" v-model="formData.name" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input size="small" v-model="formData.age" />
            </el-form-item>
          </CpisForm>
        </div>
        <template #footer>
          <CpisButton type="primary">确定</CpisButton>
          <CpisButton>取消</CpisButton>
        </template>
      </CpisDrawer>
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
      control: {
        type: 'text'
      }
    },
    column: {
      description: '列数',
      control: 'number'
    },
    labelWidth: {
      description: '标签宽度',
      control: {
        type: 'text'
      }
    },
    contentWidth: {
      description: '内容宽度',
      control: {
        type: 'text'
      }
    }
  },
  args: {
    visible: false,
    title: '这里是标题',
    column: 1,
    labelWidth: '100px',
    contentWidth: '200px'
  }
}
