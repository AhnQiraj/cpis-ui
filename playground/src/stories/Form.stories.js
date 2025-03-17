import CpisForm from '../../../packages/cpis-ui/src/packages/form/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
import CpisFormSection from '../../../packages/cpis-ui/src/packages/form/src/form-section.vue'
import CpisFormItem from '../../../packages/cpis-ui/src/packages/form/src/form-item.vue'
import CpisInput from '../../../packages/cpis-ui/src/packages/input/index.js'
import { FormItem, Input } from 'element-ui'

/**
 *
 * CPIS Form 是一个基于 element-ui 的表单组件，其用法与 element-ui 的 Form 组件一致。
 *
 * 更多详情请参考 [Form](https://element.eleme.cn/#/zh-CN/component/form)
 *  但是，需要注意的一点，我司的UI样式，需要使用CpisFormSection组件包裹CpisFormItem组件，否则样式会不生效。
 *
 * ## 基础用法
 *
 * ```vue
 * <CpisForm :model="formData" :columns="2">
 *   <CpisFormSection>
 *     <CpisFormItem label="姓名" prop="name">
 *       <el-input v-model="formData.name" />
 *     </CpisFormItem>
 *   </CpisFormSection>
 * </CpisForm>
 * ```
 **/

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/表单',
  component: CpisForm,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: `
        <div style="background-color: white; padding: 16px; position: relative; border: 1px solid #eee;">
          <story />
        </div>
      `
    })
  ],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisFormItem
      },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm :column="column" :label-width="labelWidth" :content-width="contentWidth">
          <CpisFormItem label="姓名" prop="name">
            <el-input  v-model="formData.name" />
          </CpisFormItem>
          <CpisFormItem label="年龄" prop="age">
            <el-input v-model="formData.age" />
          </CpisFormItem>
          <CpisFormItem label="性别" prop="sex">
            <el-input  v-model="formData.sex" />
          </CpisFormItem>
          <CpisFormItem label="联系电话" prop="phone">
            <el-input  v-model="formData.phone" />
          </CpisFormItem>
          <CpisFormItem label="家庭住址" prop="address">
            <el-input v-model="formData.address" />
          </CpisFormItem>
          <CpisFormItem label="其他" prop="other">
            <el-input  v-model="formData.other" />
          </CpisFormItem>
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
  name: 'Default',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormItem,
        CpisFormSection
      },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm 
          ref="form"
          :model="formData"
          :column="column" 
          :label-width="labelWidth" 
          :content-width="contentWidth"
        >
        <CpisFormSection columns="2">
          <CpisFormItem label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </CpisFormItem>
          <CpisFormItem label="年龄" prop="age">
            <el-input v-model="formData.age" />
          </CpisFormItem>
          <CpisFormItem label="家庭住址" prop="address" :span="2">
            <el-input v-model="formData.address" />
          </CpisFormItem>
          <CpisFormItem label="textarea" prop="phone">
          <el-input v-model="formData.phone" type="textarea" />
          </CpisFormItem>
          <CpisFormItem label="数字" prop="number">
            <el-input type="number" v-model="formData.number"   />
          </CpisFormItem>
        </CpisFormSection>
        </CpisForm>
      </div>
      `
    }
  }
}
export const OneColumn = {
  name: '一行显示一个',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormItem
      },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm 
          ref="form"
          :model="formData"
          :column="column" 
          :label-width="labelWidth" 
          :content-width="contentWidth"
        >
        <CpisFormSection columns="2">
          <CpisFormItem label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </CpisFormItem>
          <CpisFormItem label="年龄" prop="age">
            <el-input v-model="formData.age" />
          </CpisFormItem>
          <CpisFormItem label="家庭住址" prop="address" :span="2">
            <el-input v-model="formData.address" />
          </CpisFormItem>
          <CpisFormItem label="手机号" prop="phone">
            <el-input v-model="formData.phone" />
          </CpisFormItem>
          <CpisFormItem label="座机" prop="number">
            <el-input v-model="formData.number"   />
          </CpisFormItem>
        </CpisFormSection>
        </CpisForm>
      </div>
      `
    }
  }
}

export const TwoColumn = {
  name: '一行显示两个',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormItem,
        CpisFormSection
      },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm 
          ref="form"
          :model="formData"
          :column="column" 
          :label-width="labelWidth" 
          :content-width="contentWidth"
        >
        <CpisFormSection columns="2">
          <CpisFormItem label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </CpisFormItem>
          <CpisFormItem label="年龄" prop="age">
            <el-input v-model="formData.age" />
          </CpisFormItem>
          <CpisFormItem label="家庭住址" prop="address">
            <el-input v-model="formData.address" />
          </CpisFormItem>
          <CpisFormItem label="手机号" prop="phone">
            <el-input v-model="formData.phone" />
          </CpisFormItem>
          <CpisFormItem label="座机" prop="number">
            <el-input v-model="formData.number" />
          </CpisFormItem>
        </CpisFormSection>
        </CpisForm>
      </div>
      `
    }
  }
}

export const Span = {
  name: '某一行设置水平列数',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormItem,
        CpisFormSection
      },
      data: () => ({
        formData: {}
      }),
      template: `

        <CpisForm 
          ref="form"
          :model="formData"
        >
        <CpisFormSection title="基础信息" columns="2">
          <CpisFormItem label="姓名1" prop="name">
            <el-input v-model="formData.name" />
          </CpisFormItem>
          <CpisFormItem label="年龄" prop="age">
            <el-input v-model="formData.age" />
          </CpisFormItem>
          <CpisFormItem label="家庭住址" prop="address" :span="2">
            <el-input v-model="formData.address" />
          </CpisFormItem>
          <CpisFormItem label="手机号" prop="phone">
            <el-input v-model="formData.phone" />
          </CpisFormItem>
          <CpisFormItem label="座机" prop="number">
            <el-input v-model="formData.number"   />
          </CpisFormItem>
        </CpisFormSection>
        </CpisForm>
      `
    }
  }
}

export const RowSpan = {
  name: '某一行设置垂直列数',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormItem,
        CpisFormSection
      },
      data: () => ({
        formData: {}
      }),
      template: `

        <CpisForm 
          ref="form"
          :model="formData"
        >
        <CpisFormSection title="基础信息" columns="2">
          <CpisFormItem label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </CpisFormItem>
          <CpisFormItem label="头像" prop="age" rowSpan="2">
            <el-upload v-model="formData.age"/>
          </CpisFormItem>
          <CpisFormItem label="家庭住址" prop="address">
            <el-input v-model="formData.address" />
          </CpisFormItem>
          
        </CpisFormSection>
        </CpisForm>
      `
    }
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
    <CpisFormSection title="基础信息" columns="2">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="formData.age" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
    </CpisFormSection>
  </CpisForm>
  <CpisButton type="primary" @click="submitForm">提交</CpisButton>
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
        CpisButton,
        CpisFormItem
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
              return false
            }
          })
        }
      },
      template: `
        <template>
          <div>
            <CpisForm
              ref="form"
              :model="formData"
              :rules="rules"
              :column="column"
              :label-width="labelWidth"
              :content-width="contentWidth"
            >
              <CpisFormSection title="基础信息" columns="2">
                <CpisFormItem label="姓名" prop="name">
                  <el-input v-model="formData.name" />
                </CpisFormItem>
                <CpisFormItem label="年龄" prop="age">
                  <el-input v-model.number="formData.age" />
                </CpisFormItem>
                <CpisFormItem label="手机号" prop="phone">
                  <el-input v-model="formData.phone" />
                </CpisFormItem>
              </CpisFormSection>
            </CpisForm>
            <div class="mt-4 p-4 flex justify-center bg-gray-50 border-t border-gray-200">
              <CpisButton type="primary" @click="submitForm" class="w-32 h-9">提交</CpisButton>
            </div>
          </div>
        </template>
      `
    }
  }
}

export const Section = {
  name: '表单分区',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormSection,
        CpisFormItem
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
      template: `
        <CpisForm 
          ref="form"
          :model="formData"
          :rules="rules"
          :column="column" 
          :label-width="labelWidth" 
          :content-width="contentWidth"
        >
        <CpisFormSection title="基础信息" columns="2">
          <CpisFormItem label="入职日期" prop="entryDate">
            <el-input v-model="formData.entryDate" />
          </CpisFormItem>
          <CpisFormItem label="入职时间" prop="entryTime">
            <el-input v-model="formData.entryTime" />
          </el-form-item>
          </CpisFormSection>
          <CpisFormSection title="基础信息" columns="2">
            <CpisFormItem label="姓名" prop="name">
              <el-input v-model="formData.name" />
            </CpisFormItem>
            <CpisFormItem label="年龄" prop="age">
              <el-input v-model="formData.age" />
            </CpisFormItem>
            <CpisFormItem label="性别" prop="sex">
              <el-input v-model="formData.sex" />
            </CpisFormItem>
            <CpisFormItem label="联系电话" prop="phone">
              <el-input v-model="formData.phone" />
            </CpisFormItem>
              <CpisFormItem label="家庭住址" prop="address">
              <el-input v-model="formData.address" />
            </CpisFormItem>
          </CpisFormSection>
          <CpisFormSection title="其他信息">
            <CpisFormItem label="其他" prop="other">
              <el-input v-model="formData.other" />
            </CpisFormItem>
          </CpisFormSection>
        </CpisForm>
      `
    }
  }
}
export const SectionCustomRightSlot = {
  name: '表单分区自定义右侧内容',
  parameters: {
    docs: {
      source: {
        code: `<template>
  <CpisFormSection title="基础信息" columns="1">
    <template #right>
      右侧内容
    </template>
  </CpisFormSection>
</template>
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
        CpisButton,
        CpisFormSection,
        CpisFormItem
      },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm 
        >
          <CpisFormSection title="基础信息" columns="1">
          <template #right>
            右侧内容
          </template>
          <CpisFormItem label="入职日期" prop="entryDate">
            <el-input v-model="formData.entryDate" />
          </CpisFormItem>
          </CpisFormSection>
        </CpisForm>
      </div>
      `
    }
  }
}

export const SectionCustomSlot = {
  name: '表单分区完全自定义标题',
  parameters: {
    docs: {
      source: {
        code: `<template>
  <CpisFormSection title="基础信息" columns="1">
    <template #title>
      <div class="cpis-form-section__title">
        基础信息
        <CpisButton type="text">按钮1</CpisButton>
        <CpisButton type="text">按钮2</CpisButton>
      </div>
    </template>
  </CpisFormSection>
</template>
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
        CpisButton,
        CpisFormSection,
        CpisFormItem
      },
      data: () => ({
        formData: {}
      }),
      template: `
      <div>
        <CpisForm 
        >
        <CpisFormSection title="基础信息" columns="1">
          <template #title>
            <div class="cpis-form-section__title">基础信息
              <CpisButton type="text">按钮1</CpisButton>
              <CpisButton type="text">按钮2</CpisButton>
            </div>
          </template>
          <CpisFormItem label="入职日期" prop="entryDate">
            <el-input v-model="formData.entryDate" />
          </CpisFormItem>
          </CpisFormSection>
        </CpisForm>
      </div>
      `
    }
  }
}

export const Disabled = {
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisForm,
        ElFormItem: FormItem,
        ElInput: Input,
        CpisButton,
        CpisFormItem
      },
      data: () => ({
        disabled: false,
        formData: {}
      }),
      template: `
      <div>
        <cpis-button @click="disabled = !disabled">切换状态</cpis-button>
        <CpisForm 
          ref="form"
          :model="formData"
          :column="column" 
          :label-width="labelWidth" 
          :content-width="contentWidth"
          :disabled="disabled"
        >
        <CpisFormSection columns="1">
          <CpisFormItem label="输入框" prop="input">
            <cpis-input v-model="formData.input" placeholder="请输入" />
          </CpisFormItem>
          <CpisFormItem label="文本域" prop="textarea">
            <cpis-input type="textarea" v-model="formData.textarea" placeholder="请输入" />
          </CpisFormItem>
          <CpisFormItem label="选择器" prop="select">
            <el-select v-model="formData.select" placeholder="请选择">
              <el-option label="选项1" value="1" />
              <el-option label="选项2" value="2" />
            </el-select>
          </CpisFormItem>
          <CpisFormItem label="单选框" prop="radio">
            <el-radio-group v-model="formData.radio">
              <el-radio label="1">选项1</el-radio>
              <el-radio label="2">选项2</el-radio>
            </el-radio-group>
          </CpisFormItem>
          <CpisFormItem label="开关" prop="switch">
            <el-switch v-model="formData.switch" />
          </CpisFormItem>
          <CpisFormItem label="日期选择器" prop="date">
            <cpis-date-picker v-model="formData.date" type="date" placeholder="选择日期" />
          </CpisFormItem>
        </CpisFormSection>
        </CpisForm>
      </div>
      `
    }
  }
}
