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
  name: '配合表单',
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
