import CpisForm from '../../../packages/cpis-ui/src/packages/form/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
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
          <el-form-item label="家庭住址" prop="address" :span="2">
            <el-input v-model="formData.address" />
          </el-form-item>
          <el-form-item label="其他" prop="other">
            <el-input  v-model="formData.other" />
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

export const Validation = {
  name: '表单校验',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <div>
    <CpisForm 
      ref="form"
      :model="formData"
      :rules="rules"
      :column="2"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="formData.age" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
    </CpisForm>
    <div>
      <CpisButton type="primary" @click="submitForm">提交</CpisButton>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        age: '',
        phone: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', message: '年龄必须为数字值', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              if (value < 0 || value > 120) {
                callback(new Error('年龄必须在 0-120 之间'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3-9]\\d{9}$/,
            message: '请输入正确的手机号格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('表单验证通过', this.formData)
          this.$message.success('提交成功！')
        } else {
          this.$message.error('请检查表单填写是否正确！')
          return false
        }
      })
    }
  }
}
</script>
`
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton
      },
      data: () => ({
        formData: {},
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
            { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式',
              trigger: 'blur'
            }
          ]
        }
      }),
      methods: {
        submitForm() {
          this.$refs.form.validate(valid => {
            if (valid) {
              alert('提交成功！')
            } else {
              alert('请检查表单填写是否正确！')
              return false
            }
          })
        }
      },
      template: `
      <div>
        <CpisForm 
          ref="form"
          :model="formData"
          :rules="rules"
          :column="column" 
          :label-width="labelWidth" 
          :content-width="contentWidth"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formData.age" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" />
          </el-form-item>
        </CpisForm>
        <div class="mt-4 p-4 flex justify-center bg-gray-50 border-t border-gray-200">
          <CpisButton type="primary" @click="submitForm" class="w-32 h-9">提交</CpisButton>
        </div>
      </div>
      `
    }
  }
}
