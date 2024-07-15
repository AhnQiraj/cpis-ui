<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="formbuilder-dialog"
    fullscreen
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <div
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
    >
      <formbuilder
        v-if="dialogVisible"
        :id="id"
        :data="formDef"
        :bo="boData"
        :form-type="formType"
        :loading="dialogLoading"
        @callback="handleCallback"
        @close="closeDialog"
      />
    </div>
  </el-dialog>
</template>
<script>
import { getFormDataByFormDefId, design, buildTree } from '@platform/api/platform/form/formDef'
import { defaultsDeep } from 'lodash'
import { formButtonType } from '@platform/business/platform/form/constants/formButtonTypes'
import Formbuilder from './index'
export default {
  components: {
    Formbuilder
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    data: {
      type: Object
    },
    formType: { // form,detail
      type: String,
      default: 'form'
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {
        attrs: {
          inline: false, // 是否使用inline排版
          labelPosition: 'right', // 标签对齐方式
          labelWidth: '100', // 标签宽度
          labelWidthUnit: 'px', // 标签宽度单位
          size: 'small', // 尺寸
          statusIcon: false, // 显示验证图标
          descPosition: 'inline',
          verifys: [], // 表单提交校验
          script: '', // 表单脚本
          read_style: 'text',
          colon: false,
          labelSuffix: ':',
          same: true,
          buttons: []
        },
        fields: [] // 字段列表
      },
      formDef: null,
      boData: []
    }
  },
  computed: {
    formId() {
      return this.id
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
  created() {
    this.formDef = JSON.parse(JSON.stringify(this.defaultForm))
  },
  beforeDestroy() {
    this.defaultForm = null
    this.formDef = null
    this.boData = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.$emit('close', false)
    },
    handleCallback() {
      this.$emit('callback')
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      if (this.$utils.isEmpty(this.formId)) {
        if (this.formType === 'form') {
          design({
            mode: this.data.mode || 'bo',
            boCode: this.data.code,
            buildMode: this.data.buildMode || 'default',
            template: this.data.template || ''
          }).then(response => {
            this.dialogLoading = false
            const data = this.$utils.parseData(response.data)
            this.buildDefaultFormDef(data)
          }).catch((e) => {
            this.dialogLoading = false
            this.buildDefaultFormDef()
          })
        } else {
          this.dialogLoading = false
          this.buildDefaultFormDef()
        }
      } else {
        getFormDataByFormDefId({
          formDefId: this.formId
        }).then(response => {
          const data = this.$utils.parseJSON(response.data)
          this.buildDefaultFormDef(data)
          this.dialogLoading = false
        }).catch(() => {
          this.buildDefaultFormDef()
          this.dialogLoading = false
        })
      }
    },
    buildDefaultFormDef(data) {
      const defaultForm = JSON.parse(JSON.stringify(this.defaultForm))
      defaultForm.formType = this.formType
      let formDef = {}
      if (this.$utils.isNotEmpty(data)) {
        // 从后台获取数据
        formDef = defaultsDeep({}, data, defaultForm)
      } else {
        if (this.formType === 'detail') {
          defaultForm.attrs.buttons.push(formButtonType('close'))
        }
        formDef = defaultsDeep({}, defaultForm)
      }
      if (this.$utils.isNotEmpty(this.data)) {
        Object.assign(formDef, this.data)
      }
      this.formDef = formDef
      // 构建右边BO树
      if (this.formType !== 'combination') {
        this.buildBoTree(this.formDef)
      }
    },
    buildBoTree({ code, busId, mode }) {
      buildTree({
        boCode: code,
        boDefId: busId,
        mode: mode || ''
      }).then(response => {
        this.boData = response.data
      }).catch((e) => {
        //  loading.close()
      })
    }
  }
}
</script>
<style lang="scss" >
  .formbuilder-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
     padding: 0;
    }
    .is-fullscreen{
      overflow: hidden;
    }
  }
</style>
