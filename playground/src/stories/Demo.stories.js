/**
 *
 * ## 这是一个模版
 * ### 这里可以写 markdown 文档。用于介绍组件的用法
 **/

export default {
  title: '原子组件/模版',
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: `
        <div style="background-color: white; padding: 16px; position: relative; border: 1px solid #eee;">
          <story />
        </div>
      `
    })
  ]
}
export const 案例1 = {
  name: '案例1',
  parameters: {
    docs: {
      source: {
        code: `
如果自动生成的 Show Code 不满意，可以在这里重写
      `
      }
    }
  },
  render: (args, { argTypes }) => {
    // render 函数就相当于，我们平时学的vue的template + data + methods
    return {
      components: {},
      data: () => ({
        formData: {}
      }),
      methods: {},
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
