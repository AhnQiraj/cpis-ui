<template>
  <!--描述-->
  <ibps-desc
    v-if="fieldType==='desc'"
    :item="field"
  />
  <!--分隔线-->
  <div v-else-if="fieldType==='divider'">
    <el-divider
      :content-position="field.field_options.content_position"
    >{{ field.field_options.hide_label?'': field.label }}
    </el-divider>
    <div v-if="field && field.desc" class="ibps-help-block">
      {{ field.desc }}
    </div>
  </div>
  <!--警告-->
  <div v-else-if="fieldType==='alert'" class="ibps-pb-10">
    <el-alert
      :title="field.label"
      :description="field.desc"
      :type="field.field_options.type"
      :closable="field.field_options.closable"
      :close-text="field.field_options.close_text"
      :center="field.field_options.center"
      :show-icon="field.field_options.show_icon"
      :effect="field.field_options.effect"
    />
  </div>
  <!--流程图-->
  <div v-else-if="fieldType==='flow_diagram' && showFlowDiagram">
    <div class="ibps-page-header-title" :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')">
      流程图
    </div>
    <flow-diagram
      ref="flowDiagram"
      :biz-key="bizKey"
      :def-id="defId"
      :task-id="taskId"
      :inst-id="instanceId"
      @error="()=>showFlowDiagram=false"
    />
  </div>
  <!--审批历史-->
  <div v-else-if="fieldType==='approval_history' && showApprovalHistory">
    <div class="ibps-page-header-title" :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')">
      审批历史
    </div>
    <approval-history
      ref="approvalHistory"
      :biz-key="bizKey"
      :task-id="taskId"
      :inst-id="instanceId"
      @error="()=>showApprovalHistory=false"
    />
  </div>
  <!--标签-->
  <div v-else-if="fieldType==='tag'" :class="position">
    <ibps-tag
      v-if="getDefaultValue"
      :shape="fieldOptions.shape"
      :size="fieldOptions.dimensions"
      :effect="fieldOptions.effect"
      :type="fieldOptions.type"
      :data="getDefaultValue"
      :config="fieldOptions"
    />
    <!-- ######描述属性###### -->
    <div
      v-if="field && field.desc && descPosition==='inline'"
      class="ibps-help-block"
      style="line-height: 32px;"
      v-html="$utils.formatText(field.desc )"
    />
  </div>
</template>
<script>
import IbpsDesc from './components/desc'
import FlowDiagram from '@platform/business/platform/bpmn/components/flow-diagram'
import ApprovalHistory from '@platform/business/platform/bpmn/components/approval-history'
import Styles from '@platform/business/platform/form/utils/global-style'
import IbpsTag from '@platform/components/ibps-tag'
export default {
  components: {
    IbpsDesc,
    FlowDiagram,
    ApprovalHistory,
    IbpsTag
  },
  props: {
    models: Object, // 所有对象数据
    field: Object, // 字段
    params: Object,
    value: [String, Number]
  },
  data() {
    return {
      showApprovalHistory: false,
      showFlowDiagram: false,
      fieldData: {
        name: '标签'
      }
    }
  },
  computed: {
    descPosition() {
      return this.params.descPosition || 'inline'
    },
    getDefaultValue() {
      if (this.fieldOptions.default_value_type === 'fixed') {
        return this.fieldOptions.default_value
      }
      return this.value + ''
    },
    position() {
      let _class = ''
      if (this.$utils.isEmpty(this.fieldOptions.position)) {return _class}
      if (this.fieldOptions.position === 'left') {
        _class = 'ibps-tl'
      } else if (this.fieldOptions.position === 'center') {
        _class = 'ibps-tc'
      } else if (this.fieldOptions.position === 'right') {
        _class = 'ibps-tr'
      }
      return _class
    },
    fieldOptions() {
      return this.field.field_options || {}
    },
    fieldType() {
      return this.field.field_type
    },
    defId() {
      return this.params ? this.params.defId : null
    },
    taskId() {
      return this.params ? this.params.taskId : null
    },
    instanceId() {
      return this.params ? this.params.instanceId : null
    },
    bizKey() {
      return this.params ? this.params.bizKey : null
    }
  },
  watch: {
    params: {
      handler(val, oldVal) {
        if (val !== oldVal) {
        // 是否显示审批历史
          this.showApprovalHistory = !!(this.taskId || this.instanceId || this.bizKey)
          // 是否显示流程图
          this.showFlowDiagram = !!(this.defId || this.taskId || this.instanceId || this.bizKey)
          if (this.field.field_type === 'flow_diagram' && this.showFlowDiagram) {
            this.$nextTick(() => {
              this.$refs.flowDiagram.getFormData()
            })
          }
          if (this.field.field_type === 'approval_history' && this.showApprovalHistory) {
            this.$nextTick(() => {
              this.$refs.approvalHistory.getFormData()
            })
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
      this.$utils.isEmpty(this.params.formAttrs) ||
      this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    }
  }
}
</script>
