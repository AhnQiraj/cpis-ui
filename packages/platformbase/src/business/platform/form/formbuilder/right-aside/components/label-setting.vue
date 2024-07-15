<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="label-setting"
    top="5vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form :ref="formName" :model="formData" label-width="150px" size="mini" @submit.native.prevent>
      <!--统计数据的格式-->
      <el-form-item>
        <template slot="label">统计格式<help-tip prop="labelSettingFormat" /></template>
        <combination-field
          v-if="dialogVisible"
          v-model="formData.format"
          :fields="fields"
          label="文本"
          size="medium"
          tips="必须选择当前选项中的[总数统计]进行格式的配置，否则将无法正常显示表单的数据个数统计。"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import CombinationField from '@platform/business/platform/form/components/combination-field'
export default {
  components: {
    CombinationField
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '自定义标签配置'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      formName: 'labelForm',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {},
      fields: [{
        id: 'identification',
        value: 'statistics',
        label: '总数统计'
      }]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.toolbars = null
    this.formData = null
  },
  methods: {
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
      const data = JSON.parse(JSON.stringify(this.formData))
      this.closeDialog()
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.formData = {}
    },
    getFormData() {
      if (this.$utils.isEmpty(this.data)) {
        this.formData = {
          format: ''
        }
      } else {
        this.formData = JSON.parse(JSON.stringify(this.data))
      }
    }
  }
}
</script>
