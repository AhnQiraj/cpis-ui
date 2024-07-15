<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="参数设置"
    append-to-body
    top="5vh"
    width="70%"
    class="ibps-params-setting ibps-dialog-70"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-button type="primary" icon="ibps-icon-add" @click="addParam">添加参数</el-button>
    <fieldset class="ibps-fieldset ibps-fieldset--solid">
      <legend style="width: 90px;border-bottom:0;margin-bottom:10px;">
        <span :style="'marginLeft:8px;font-size:16px;'">参数设置 </span>
      </legend>
      <template v-if="formData && formData.length >0">
        <el-card v-for="(param,i) in formData" :key="i" class="ibps-m-10">
          <div slot="header" class="clearfix">
            <span>参数信息({{ i+1 }})</span>
            <el-link class="ibps-pr-5 ibps-fr" type="danger" @click="removeParam(i)">删除</el-link>
          </div>
          <el-form-item label="参数键">
            <el-input v-model="formData[i].key" placeholder="参数键" />
          </el-form-item>
          <el-form-item label="参数类型">
            <el-select v-model="formData[i].type" placeholder="请选择" style="width:100%">
              <el-option value="varchar" label="字符串" />
              <el-option value="number" label="数字" />
              <el-option value="date" label="日期" />
            </el-select>
          </el-form-item>
          <el-form-item label="值来源">
            <el-select
              v-model="formData[i].valueType"
              placeholder="请选择"
              style="width:100%"
              @change="changeValueType(i)"
            >
              <el-option
                v-for="item in valueTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="参数值">
            <el-input
              v-if="formData[i].valueType === 'fixed'"
              v-model="formData[i].value"
              placeholder="参数值"
            />
            <el-select
              v-else-if="formData[i].valueType === 'bo'"
              v-model="formData[i].value"
              placeholder="请选择参数值"
              style="width:100%"
            >
              <el-option
                v-for="item in boFields"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              >
                <span class="ibps-fl">{{ item.name }}</span>
                <span class="casade-field__desc">{{ item.key }}</span>
              </el-option>
            </el-select>
            <el-button
              v-else-if="formData[i].valueType === 'script'"
              type="primary"
              @click="handleDynamicScript(i)"
            >设置参数脚本</el-button>
          </el-form-item>
        </el-card>
      </template>
      <ibps-empty v-else desc="暂无设置参数" />
    </fieldset>
    <!--动态脚本-->
    <dynamic-script
      :visible="dynamicScriptVisible"
      label="设置脚本"
      :bo-data="boData"
      :data="dynamicScriptValue"
      @callback="setDynamicScriptValue"
      @close="visible => dynamicScriptVisible = visible"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import DynamicScript from './dynamic-script'
const valueTypeOptions = [
  {
    value: 'fixed',
    label: '固定值'
  }, {
    value: 'bo',
    label: '业务对象'
  }, {
    value: 'script',
    label: '动态脚本'
  }
]
export default {
  components: {
    DynamicScript
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    boData: Array,
    boFields: Array,
    data: Array
  },
  data() {
    return {
      dialogVisible: this.visible,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: [],
      dynamicScriptVisible: false,
      dynamicScriptValue: '',
      dynamicScriptIndex: -1,
      dynamicScriptType: 'params'
    }
  },
  computed: {
    valueTypeOptions() {
      return this.$utils.isEmpty(this.boData) ? valueTypeOptions.filter((item) => item.value !== 'bo') : valueTypeOptions
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {
    // 添加参数
    addParam() {
      if (this.$utils.isEmpty(this.formData)) {
        this.formData = []
      }
      const data = {
        key: '',
        type: 'varchar',
        valueType: 'fixed',
        value: ''
      }
      this.formData.push(data)
    },
    removeParam(index) {
      this.formData.splice(index, 1)
    },
    changeValueType(i) {
      this.formData[i].value = ''
    },
    handleDynamicScript(i) {
      this.dynamicScriptValue = this.formData[i].value
      this.dynamicScriptIndex = i
      this.dynamicScriptVisible = true
    },
    setDynamicScriptValue(val) {
      this.formData[this.dynamicScriptIndex].value = val
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      if (this.$utils.isNotEmpty(this.formData)) {
        for (let i = 0; i < this.formData.length; i++) {
          const data = this.formData[i]
          if (this.$utils.isEmpty(data.key)) {
            this.$message({
              message: '请输入参数键',
              type: 'warning'
            })
            return
          }
          if (this.$utils.isEmpty(data.value)) {
            this.$message({
              message: '请输入参数值',
              type: 'warning'
            })
            return
          }
        }
      }
      const data = JSON.parse(JSON.stringify(this.formData))
      this.closeDialog()
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isEmpty(this.data)) {
        this.formData = []
        return
      }
      this.formData = JSON.parse(JSON.stringify(this.data))
    }
  }
}
</script>
