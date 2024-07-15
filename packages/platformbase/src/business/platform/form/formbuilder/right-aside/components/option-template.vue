<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="isTemplate?'60%':'40%'"
    class="option-template-dialog"
    top="10vh"
    append-to-body
    @close="closeDialog"
  >
    <div class="choices-content ">
      <el-alert type="warning" title="每行内容对应一个选项值和选项的标签值" />
      <el-row :gutter="10">
        <el-col v-if="isTemplate" :span="8">
          选项模版
          <ul>
            <li v-for="(choice,index) in choicesTemplate" :key="index" @click="clickChoice(choice)">{{ choice.name }}</li>
          </ul>
        </el-col>
        <el-col :span="isTemplate?8:12">
          选项值
          <el-input v-model="optionsValue" type="textarea" rows="12" />
        </el-col>
        <el-col :span="isTemplate?8:12">
          选项标签
          <el-input v-model="optionsLabel" type="textarea" rows="12" />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import ActionUtils from '@platform/utils/action'
// TODO: 目前先写死，后面可配置
const choicesTemplate = [{
  name: '是/否',
  label: ['是', '否'],
  value: ['Y', 'N']
}, {
  name: '性别',
  label: ['男', '女'],
  value: ['M', 'F']
}, {
  name: '星期',
  label: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  value: ['1', '2', '3', '4', '5', '6', '7']
}, {
  name: '月份',
  label: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  value: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
}, {
  name: '满意度',
  label: ['非常满意', '满意', '一般', '不满意', '非常不满意', '其他'],
  value: ['VerySatisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'VeryUnsatisfied', 'NA']
}]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    isTemplate: Boolean,
    options: Array
  },
  data() {
    return {
      dialogVisible: false,
      choicesTemplate: choicesTemplate,
      optionsValue: '',
      optionsLabel: '',
      toolbars: [
        { key: 'confirm' },
        { key: 'clean', type: 'info', icon: 'ibps-icon-clean', label: '重置' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    options: {
      handler: function(val, oldVal) {
        if (!this.options || this.options.length <= 0) {return}
        const values = []
        const labels = []
        this.options.forEach(option => {
          values.push(option.val)
          labels.push(option.label)
        })
        this.optionsValue = values.join('\n')
        this.optionsLabel = labels.join('\n')
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.toolbars = null
    this.choicesTemplate = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'clean':
          this.handleClean()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.optionsValue = ''
      this.optionsLabel = ''
      this.$emit('close', false)
    },
    handleConfirm() {
      if (this.$utils.isEmpty(this.optionsValue) || this.$utils.isEmpty(this.optionsLabel)) {
        ActionUtils.warning('值和标签不能为空')
        return
      }
      const values = this.optionsValue.split('\n')
      const labels = this.optionsLabel.split('\n')
      if (labels.length !== values.length) {
        ActionUtils.warning('值和标签长度不一致')
        return
      }
      // 检查重复key
      if (new Set(values).size !== values.length) {
        ActionUtils.warning('值有重复值，请检查')
        return
      }
      const labelAry = labels.map(function(n) {
        return n
      })
      const checkedMap = {}
      this.options.forEach(option => {
        checkedMap[option.val] = option.checked || false
      })
      const choices = values.map(function(v, i) {
        return {
          val: v,
          label: labelAry[i],
          checked: checkedMap[v] || false
        }
      })
      this.$emit('callback', choices)
      this.closeDialog()
    },
    handleClean() {
      this.optionsValue = ''
      this.optionsLabel = ''
    },
    clickChoice(choice) {
      this.optionsValue = choice.value.join('\n')
      this.optionsLabel = choice.label.join('\n')
    }
  }
}
</script>
<style lang="scss" >
.option-template-dialog{
  .el-dialog__body{
    padding-top:5px;
  }
}
.choices-content{
  padding: 15px 10px;
   ul{
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 250px;
    overflow-y: auto;
    line-height: 1.6;
    list-style: none;
    padding: 4px 0;
    margin: 0;
    border: 1px solid #C3C9D0
  }
  ul>li {
    padding: 0 6px;
    cursor: pointer
  }
  ul>li:hover,.choices-content ul>li.selected {
      background-color: #F1F1F1
  }
  textarea {
    display: inline-block;
    vertical-align: top;
    overflow-y: auto;
    line-height: 1.6;
    resize: none;
    &:not(:focus) {
      border-color: #C3C9D0
    }
  }
}
</style>
