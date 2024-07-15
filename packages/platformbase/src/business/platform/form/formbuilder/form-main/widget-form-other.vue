<template>
  <div>
    <!--描述-->
    <template v-if="fieldType==='desc'">
      <div class="title">{{ element.label }}</div>
      <div
        v-if="element&&element.field_options&&element.field_options.split_line"
        class="divider"
        :class="'ibps-'+element.field_options.line_style||'dashed'"
      />
      <div v-if="element&&element.desc" class="desc" v-html="$utils.formatText(element.desc )" />
    </template>
    <!--分割线-->
    <template v-else-if="fieldType==='divider'">
      <el-divider
        :content-position="element.field_options.content_position"
      >{{ element.field_options.hide_label? '':element.label }}</el-divider>
      <div v-if="element && element.desc" class="ibps-help-block">
        {{ element.desc }}
      </div>
    </template>
    <!--警告-->
    <template v-else-if="fieldType==='alert'">
      <el-alert
        ref="alert"
        :title="element.label"
        :description="element.desc"
        :type="element.field_options.type"
        :closable="element.field_options.closable"
        :close-text="element.field_options.close_text"
        :center="element.field_options.center"
        :show-icon="element.field_options.show_icon"
        :effect="element.field_options.effect"
        @close="handleClose"
      />
    </template>
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
      <template v-if="element && element.desc && descPosition==='inline' ">
        <div
          class="ibps-help-block"
          v-html="$utils.formatText(element.desc)"
        />
      </template>
    </div>
    <!-- 关联查询-->
    <template v-else-if="fieldType==='linkquery'">
      <el-form-item
        :label-width="element.field_options.is_label_width?element.field_options.label_width+(element.field_options.label_width_unit||'px'):null"
      >
        <template v-if="$utils.isNotEmpty(element.label)" slot="label">
          <span :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')">{{ element.label }}</span>
        </template>
        <el-select
          :value="''"
          style="width:100%"
          disabled
        />
      </el-form-item>
      <!--TODO: 文本只读显示样式切换对应展示,以及渲染表单时的类型展示 -->
      <el-form-item
        v-for="(e,i) in element.field_options.linkdataDisplayColumns"
        :key="i"
      >
        <template v-if="$utils.isNotEmpty(e.label)" slot="label">
          <span :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')">{{ e.label }}</span>
        </template>
        <el-input disabled />
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item
        :label-width="element.field_options.is_label_width?element.field_options.label_width+(element.field_options.label_width_unit||'px'):null"
      >
        <template v-if="$utils.isNotEmpty(element.label)" slot="label">
          <span :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')">{{ element.label }}</span>
        </template>
        <!-- 流程图-->
        <img
          v-if="fieldType==='flow_diagram'"
          :src="flowDiagramImage"
        >
        <!-- 审批历史-->
        <img
          v-else-if="fieldType==='approval_history'"
          :src="approvalHistoryImage"
          style="width: 100%;"
        >
        <template v-if="element && element.desc && descPosition==='inline' ">
          <div
            class="ibps-help-block"
            v-html="$utils.formatText(element.desc)"
          />
        </template>
      </el-form-item>
    </template>
  </div>
</template>
<script>
import FlowDiagramImage from '@platform/assets/images/form/flow_diagram.png'
import ApprovalHistoryImage from '@platform/assets/images/form/approval_history.png'
import Styles from '@platform/business/platform/form/utils/global-style'
import IbpsTag from '@platform/components/ibps-tag'
export default {
  components: {
    IbpsTag
  },
  props: {
    element: Object,
    data: Object,
    params: Object
  },
  data() {
    return {
      selectWidget: this.select,
      flowDiagramImage: FlowDiagramImage,
      approvalHistoryImage: ApprovalHistoryImage
    }
  },
  computed: {
    descPosition() {
      return this.params.descPosition || 'inline'
    },
    getDefaultValue() {
      const val = '标签'
      if (this.fieldOptions.default_value_type === 'fixed') {
        return this.fieldOptions.default_value || val
      }
      return val
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
      return this.element.field_options || {}
    },
    fieldType() {
      return this.element.field_type
    },
    fields() {
      if (this.isTable) {
        return this.data.field_options.columns
      } else {
        return this.data.fields
      }
    },
    isTable() {
      return this.data.field_type === 'table'
    }
  },
  watch: {
    fields: {
      handler(val, oldVal) {
        // console.log(val, 'fields')
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.flowDiagramImage = null
    this.approvalHistoryImage = null
  },
  methods: {
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
      this.$utils.isEmpty(this.params.formAttrs) ||
      this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    },
    handleClose() {
      this.$refs.alert.visible = true
    }
  }
}
</script>
