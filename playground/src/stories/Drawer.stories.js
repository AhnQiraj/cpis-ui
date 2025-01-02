import CpisDrawer from '../../../packages/cpis-ui/src/packages/drawer/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
import CpisForm from '../../../packages/cpis-ui/src/packages/form/index'
import { FormItem, Input } from 'element-ui'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/抽屉',
  component: CpisDrawer,
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
    'modal-append-to-body': false // 为所有故事添加默认参数
  },
  tags: ['autodocs']
}
export const Default = {
  name: '默认',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer },
      template: `
      <CpisDrawer :visible="visible" :title="title" :modal-append-to-body="false">
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
        <CpisDrawer :visible="visible" :title="title">
          <div class="flex-1">body</div>
          <template #footer>
            <CpisButton type="primary">确定</CpisButton>
            <CpisButton>取消</CpisButton>
          </template>
        </CpisDrawer>`
      }
    }
  },

  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer, CpisButton, CpisForm },
      template: `
      <CpisDrawer :visible="visible" :title="title">
        <div class="flex-1">body</div>
        <template v-slot:footer>
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
        </CpisDrawer>`
      }
    }
  },

  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisDrawer, CpisButton, CpisForm },
      template: `
      <CpisDrawer :visible="visible" :title="title">
          <template #title>
            标题插槽 <span style="color: red;">我可以是任何内容</span>
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

export const TitleRightSlot = {
  name: '标题右侧插槽',
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
      components: { CpisDrawer, CpisButton, CpisForm },
      template: `
      <CpisDrawer :visible="visible" :title="title">
          <template #title>
            标题插槽
          </template>
          <template #title-right>
            右侧插槽
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
            name: [{ required: false, message: '请输入姓名' }],
            age: [{ required: true, message: '请输入年龄' }]
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
            <el-form-item label="联系电话" prop="phone">
              <el-input size="small" v-model="formData.phone" />
            </el-form-item>
            <el-form-item label="电子邮箱地址" prop="email">
              <el-input size="small" v-model="formData.email" />
            </el-form-item>
            <el-form-item label="居住地址" prop="address">
              <el-input size="small" v-model="formData.address" />
            </el-form-item>
            <el-form-item label="工作单位名称" prop="company">
              <el-input size="small" v-model="formData.company" />
            </el-form-item>
            <el-form-item label="所属部门" prop="department">
              <el-input size="small" v-model="formData.department" />
            </el-form-item>
            <el-form-item label="职务职称" prop="position">
              <el-input size="small" v-model="formData.position" />
            </el-form-item>
            <el-form-item label="最高学历" prop="education">
              <el-input size="small" v-model="formData.education" />
            </el-form-item>
            <el-form-item label="毕业院校" prop="school">
              <el-input size="small" v-model="formData.school" />
            </el-form-item>
            <el-form-item label="专业技能证书" prop="certificate">
              <el-input size="small" v-model="formData.certificate" />
            </el-form-item>
            <el-form-item label="工作经验年限" prop="experience">
              <el-input size="small" v-model="formData.experience" />
            </el-form-item>
            <el-form-item label="期望薪资范围" prop="salary">
              <el-input size="small" v-model="formData.salary" />
            </el-form-item>
            <el-form-item label="紧急联系人姓名" prop="emergencyContact">
              <el-input size="small" v-model="formData.emergencyContact" />
            </el-form-item>
            <el-form-item label="紧急联系人电话" prop="emergencyPhone">
              <el-input size="small" v-model="formData.emergencyPhone" />
            </el-form-item>
            <el-form-item label="社会保险参保情况" prop="insurance">
              <el-input size="small" v-model="formData.insurance" />
            </el-form-item>
            <el-form-item label="住房公积金缴纳情况" prop="housingFund">
              <el-input size="small" v-model="formData.housingFund" />
            </el-form-item>
            <el-form-item label="银行卡开户行" prop="bankName">
              <el-input size="small" v-model="formData.bankName" />
            </el-form-item>
            <el-form-item label="银行卡账号" prop="bankAccount">
              <el-input size="small" v-model="formData.bankAccount" />
            </el-form-item>
            <el-form-item label="身份证件号码" prop="idCard">
              <el-input size="small" v-model="formData.idCard" />
            </el-form-item>
            <el-form-item label="出生年月日" prop="birthday">
              <el-input size="small" v-model="formData.birthday" />
            </el-form-item>
            <el-form-item label="民族" prop="nationality">
              <el-input size="small" v-model="formData.nationality" />
            </el-form-item>
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-input size="small" v-model="formData.politicalStatus" />
            </el-form-item>
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-input size="small" v-model="formData.maritalStatus" />
            </el-form-item>
            <el-form-item label="户口所在地" prop="householdLocation">
              <el-input size="small" v-model="formData.householdLocation" />
            </el-form-item>
            <el-form-item label="现居住地详细地址" prop="currentAddress">
              <el-input size="small" v-model="formData.currentAddress" />
            </el-form-item>
            <el-form-item label="个人特长爱好" prop="hobbies">
              <el-input size="small" v-model="formData.hobbies" />
            </el-form-item>
            <el-form-item label="获奖情况说明" prop="awards">
              <el-input size="small" v-model="formData.awards" />
            </el-form-item>
            <el-form-item label="职业资格认证" prop="qualification">
              <el-input size="small" v-model="formData.qualification" />
            </el-form-item>
            <el-form-item label="外语水平等级" prop="languageLevel">
              <el-input size="small" v-model="formData.languageLevel" />
            </el-form-item>
            <el-form-item label="计算机等级证书" prop="computerCert">
              <el-input size="small" v-model="formData.computerCert" />
            </el-form-item>
            <el-form-item label="项目经验描述" prop="projectExp">
              <el-input size="small" v-model="formData.projectExp" />
            </el-form-item>
            <el-form-item label="工作业绩说明" prop="performance">
              <el-input size="small" v-model="formData.performance" />
            </el-form-item>
            <el-form-item label="培训经历记录" prop="training">
              <el-input size="small" v-model="formData.training" />
            </el-form-item>
            <el-form-item label="专业技术职称" prop="technicalTitle">
              <el-input size="small" v-model="formData.technicalTitle" />
            </el-form-item>
            <el-form-item label="研究成果发表" prop="publications">
              <el-input size="small" v-model="formData.publications" />
            </el-form-item>
            <el-form-item label="专利技术成果" prop="patents">
              <el-input size="small" v-model="formData.patents" />
            </el-form-item>
            <el-form-item label="社会兼职情况" prop="partTimeJob">
              <el-input size="small" v-model="formData.partTimeJob" />
            </el-form-item>
            <el-form-item label="家庭成员情况" prop="familyMembers">
              <el-input size="small" v-model="formData.familyMembers" />
            </el-form-item>
            <el-form-item label="健康状况说明" prop="healthStatus">
              <el-input size="small" v-model="formData.healthStatus" />
            </el-form-item>
            <el-form-item label="体检报告结果" prop="medicalReport">
              <el-input size="small" v-model="formData.medicalReport" />
            </el-form-item>
            <el-form-item label="违法违纪记录" prop="violations">
              <el-input size="small" v-model="formData.violations" />
            </el-form-item>
            <el-form-item label="信用记录情况" prop="creditRecord">
              <el-input size="small" v-model="formData.creditRecord" />
            </el-form-item>
            <el-form-item label="职业发展规划" prop="careerPlan">
              <el-input size="small" v-model="formData.careerPlan" />
            </el-form-item>
            <el-form-item label="自我评价描述" prop="selfEvaluation">
              <el-input size="small" v-model="formData.selfEvaluation" />
            </el-form-item>
            <el-form-item label="入职时间要求" prop="entryTimeReq">
              <el-input size="small" v-model="formData.entryTimeReq" />
            </el-form-item>
            <el-form-item label="工作地点要求" prop="workLocationReq">
              <el-input size="small" v-model="formData.workLocationReq" />
            </el-form-item>
            <el-form-item label="其他特殊说明" prop="otherNotes">
              <el-input size="small" v-model="formData.otherNotes" />
            </el-form-item>
            <el-form-item label="推荐人信息" prop="referrer">
              <el-input size="small" v-model="formData.referrer" />
            </el-form-item>
            <el-form-item label="面试评价记录" prop="interviewComments">
              <el-input size="small" v-model="formData.interviewComments" />
            </el-form-item>
            <el-form-item label="入职材料清单" prop="entryDocuments">
              <el-input size="small" v-model="formData.entryDocuments" />
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input size="small" v-model="formData.remarks" />
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
