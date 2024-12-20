import CpisForm from '../../../packages/cpis-ui/src/packages/form/index'
import { FormItem, Input } from 'element-ui'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/表单',
  component: CpisForm,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisForm, ElFormItem: FormItem, ElInput: Input },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm :column="column" :label-width="labelWidth" :content-width="contentWidth">
          <el-form-item label="姓名" prop="name">
            <el-input  v-model="formData.name" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="formData.age" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input  v-model="formData.sex" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input  v-model="formData.phone" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email" />
          </el-form-item>
          <el-form-item label="家庭住址" prop="address">
            <el-input v-model="formData.address" />
          </el-form-item>
        </CpisForm>
      </div>
      `
    }
  },
  argTypes: {
    column: {
      description: '列数',
      control: 'number'
    },
    labelWidth: {
      description: '标签宽度',
      control: 'number'
    },
    contentWidth: {
      description: '内容宽度',
      control: 'number'
    }
  }
}
export const Default = {
  name: '一行显示一个',
  args: {
    column: 1
  }
}
export const TwoColumns = {
  name: '一行显示2个',
  args: {
    column: 2
  }
}
