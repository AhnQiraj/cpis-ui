<template>
  <div>
    <!-- 单行文本-->
    <el-input
      v-if="fieldType === 'text'"
      :value="defaultValue"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!--多行文本-->
    <el-input
      v-else-if="fieldType === 'textarea'"
      :value="defaultValue"
      type="textarea"
      :rows="fieldOptions.rows||5"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 数字 -->
    <el-input
      v-else-if="fieldType === 'number'"
      :value="defaultValue"
      type="number"
      :controls-position="fieldOptions.controls_position"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 计数器 -->
    <el-input-number
      v-else-if="fieldType === 'inputNumber'"
      :value="defaultValue"
      :max="fieldOptions.max"
      :min="fieldOptions.min"
      :step="fieldOptions.step"
      :controls="fieldOptions.controls"
      :controls-position="fieldOptions.controls_position"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 单选 -->
    <el-radio-group
      v-else-if="fieldType === 'radio'"
      :value="defaultValue"
      disabled
    >
      <component
        :is="fieldOptions.option_style==='button'?'el-radio-button':'el-radio'"
        v-for="(o, i) in options"
        :key="o.val+i"
        :label="i"
        :border="fieldOptions.border"
        :style="{
          marginTop: '5px',
          display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
      >
        <span :style="getStyleByName('valTypeface', 'valFontSize', 'valBold', 'valColor')">{{ o.label }}</span>
      </component>
    </el-radio-group>
    <!-- 多选 -->
    <el-checkbox-group
      v-else-if="fieldType === 'checkbox'"
      :value="defaultValue"
      disabled
    >
      <component
        :is="fieldOptions.option_style==='button'?'el-checkbox-button':'el-checkbox'"
        v-for="(o,i) in options"
        :key="o.val+i"
        :label="i"
        :border="fieldOptions.border"
        :style="{ display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
        disabled
      >
        <span :style="getStyleByName('valTypeface', 'valFontSize', 'valBold', 'valColor')">{{ o.label }}</span>
      </component>
    </el-checkbox-group>
    <!-- 下拉 -->
    <el-select
      v-else-if="fieldType === 'select'"
      :value="defaultValue"
      :multiple="fieldOptions.multiple"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    >
      <el-option
        v-for="(o ,i) in fieldOptions.options"
        :key="o.val+i"
        :value="o.val"
        :label="o.label"
        disabled
      />
    </el-select>
    <!-- 日期控件 || 当前日期 || 当前时间 -->
    <el-date-picker
      v-else-if="fieldType === 'datePicker'||fieldType === 'currentTime'||fieldType === 'currentDate'"
      :value="defaultValue"
      :type="fieldOptions.subtype||'date'"
      :value-format="fieldOptions.valueFormat"
      :format="fieldOptions.viewFormat||fieldOptions.valueFormat"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 开关 -->
    <template v-else-if="fieldType == 'switch'">
      <el-checkbox
        v-if="fieldOptions.appearance==='checkbox'"
        :value="defaultValue"
        disabled
      />
      <el-switch
        v-else
        :value="defaultValue"
        :width="fieldOptions.width"
        :active-value="fieldOptions.active_value"
        :inactive-value="fieldOptions.inactive_value"
        :active-text="showText?fieldOptions.active_text:''"
        :inactive-text="showText?fieldOptions.inactive_text:''"
        :active-color="fieldOptions.active_color"
        :inactive-color="fieldOptions.inactive_color"
        disabled
      />
    </template>
    <!-- 滑块 -->
    <template v-else-if="fieldType === 'slider'">
      <el-slider
        :value="defaultValue"
        :max="fieldOptions.max"
        :min="fieldOptions.min"
        :step="fieldOptions.step"
        :show-input="fieldOptions.show_input"
        disabled
      />
    </template>
    <!-- 评分-->
    <template v-else-if="fieldType === 'rate'">
      <el-rate
        :value="defaultValue"
        :max="fieldOptions.max"
        :allow-half="fieldOptions.allow_half"
        :show-text="fieldOptions.show_text"
        :show-score="fieldOptions.show_score"
        disabled
      />
    </template>
    <!-- 隐藏域 -->
    <template v-else-if="fieldType === 'hidden'">
      <el-input
        :value="defaultValue"
        disabled
      >
        <i slot="prefix" class="ibps-icon-eye-slash red" />
      </el-input>
    </template>
    <!-- =======================增强字段==============================-->
    <!--富文本框-->
    <template v-else-if="fieldType === 'editor'">
      <ibps-ueditor
        :value="defaultValue"
        :config="ueditorConfig"
        :z-index="2000"
        destroy
        readonly
        disabled
        @click="()=>{$emit('click')}"
      />
    </template>
    <!--数据字典-->
    <ibps-dictionary
      v-else-if="fieldType==='dictionary'"
      :value="defaultValue"
      :type-key="fieldOptions.dictionary"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 自动编号-->
    <el-input
      v-else-if="fieldType==='autoNumber'"
      :value="defaultValue"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      prefix-icon="ibps-icon-list-ol"
      disabled
    />
    <!-- 上传附件-->
    <ibps-attachment
      v-else-if="fieldType==='attachment'"
      :value="defaultValue"
      :placeholder="fieldOptions.placeholder"
      :multiple="fieldOptions.multiple"
      :style="{width:width}"
      disabled
    />
    <!-- 选择器-->
    <ibps-user-selector
      v-else-if="fieldType==='selector'"
      :value="defaultValue"
      store="id"
      :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'请选择'"
      :style="{width:width}"
      disabled-icon
      disabled
      show-placeholder
    />
    <!-- 自定义对话框-->
    <el-input
      v-else-if="fieldType==='customDialog'"
      :value="''"
      :placeholder="fieldOptions.placeholder"
      :prefix-icon="icon"
      :style="{width:width}"
      type="text"
      disabled
    />
    <!-- 关联数据-->
    <el-select
      v-else-if="fieldType==='linkdata'"
      :value="''"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 级联-->
    <el-cascader
      v-else-if="fieldType==='cascader'"
      :value="defaultValue"
      :options="options"
      :placeholder="fieldOptions.placeholder"
      :style="{width:width}"
      disabled
    />
    <!-- 地址-->
    <div
      v-else-if="fieldType==='address'"
    >
      <ibps-address
        :value="defaultValue"
        :size="fieldOptions.size"
        :top-val="topVal||'0'"
        :top="fieldOptions.top || 'country'"
        :level="fieldOptions.level||'district'"
        data-type="code"
        :style="{width:width}"
        disabled
      />
      <template v-if="fieldOptions.is_street">
        <p />
        <el-input
          v-model="fieldOptions.stree"
          :placeholder="fieldOptions.street_placeholder"
          :style="{width:width}"
          type="textarea"
          disabled
        />
      </template>
    </div>
    <!-- 签名-->
    <div
      v-else-if="fieldType==='signature'"
      class="fr-signature-outer"
    >
      <div class="fr-signature-header">
        <div class="fr-signature-label">{{ fieldOptions.placeholder }}</div>
        <div class="fr-signature-toolbar">
          <a href="javascript:void(0);" data-toggle="signature-clear">清除</a>
        </div>
      </div>
      <div class="fr-signature-div" />
    </div>
    <!-- 图片控件 -->
    <ibps-image
      v-else-if="fieldType==='image'"
      :value="defaultValue"
      :width="fieldOptions.width"
      :height="fieldOptions.height"
      :limit="fieldOptions.limit"
      :accept="fieldOptions.accept"
      :tip="fieldOptions.tip"
      :size="fieldOptions.size"
      :upload-type="fieldOptions.uploadType"
      readonly
    />
    <!-- 条形码 -->
    <vue-barcode
      v-else-if="fieldType==='barcode'"
      :value="defaultValue||''"
      :format="fieldOptions.format"
      :width="fieldOptions.barcode_width"
      :height="fieldOptions.barcode_height"
      :background="fieldOptions.background"
      :line-color="fieldOptions.line_color"
      :display-value="fieldOptions.display_value"
    />
    <!-- 二维码 -->
    <template v-else-if="fieldType==='qrcode'">
      <vue-qrcode
        v-if="defaultValue"
        :value="defaultValue||''"
        :version="fieldOptions.version"
        :error-correction-level="fieldOptions.error_correction_level"
        :mask-pattern="fieldOptions.mask_pattern"
        :width="fieldOptions.size"
        :quality="fieldOptions.quality"
        :margin="fieldOptions.margin"
        :scale="fieldOptions.scale"
        :color="{
          dark: fieldOptions.color_dark?fieldOptions.color_dark:'',
          light:fieldOptions.color_light?fieldOptions.color_light:''
        }"
      />
    </template>
    <template v-else-if="fieldType==='location'">
      <el-button type="primary" disabled icon="ibps-icon-map-marker">{{ fieldOptions.placeholder }}</el-button>
      <div>PC端获取当前位置为不准，请移动端打开获取当前位置。</div>
    </template>
    <!-- =======================系统字段==============================-->
    <!-- 当前用户-->
    <ibps-user-selector
      v-else-if="fieldType==='currentUser'"
      :placeholder="'自动获取当前用户'"
      disabled-icon
      disabled
      show-placeholder
    />
    <!-- 当前组织-->
    <ibps-user-selector
      v-else-if="fieldType==='currentOrg'"
      :placeholder="'自动获取当前组织'"
      disabled-icon
      disabled
      show-placeholder
    />
    <!-- =======================流程字段==============================-->
    <!-- 流程实例 -->
    <ibps-bpm-inst-his
      v-else-if="fieldType==='bpmInstHis'"
      :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'请选择'"
      disabled
    />
    <!-- 流程关联 -->
    <div v-else-if="fieldType==='bpmLink'">
      <el-table
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="subject"
          label="实例标题"
        />
        <el-table-column
          prop="procDefName"
          label="流程名称"
          width="150"
        />
        <el-table-column
          prop="procDefKey"
          label="流程Key"
          width="120"
        />
        <el-table-column
          prop="status"
          label="流程状态"
          width="120"
        />
        <el-table-column
          prop="creator"
          label="发起人"
          width="120"
        />
        <el-table-column
          prop="createTime"
          label="发起时间"
          width="150"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          width="150"
        />
        <el-table-column
          width="50"
          label="操作"
        />
      </el-table>
    </div>
    <!-- 审批意见-->
    <approval-opinion
      v-else-if="fieldType==='approval_opinion'"
      :enable-common="fieldOptions.common_statment"
      disabled
    />
    <!-- =======================自定义控件==============================-->
    <!-- 自定义组件-->
    <div v-else-if="fieldType==='component'">
      【自定义组件】{{ showLabel }}
    </div>
    <!-- 自定义控件-->
    <div v-else-if="fieldType==='control'">
      【自定义控件】{{ showLabel }}
    </div>
    <!-- =======================组合字段==============================-->
    <div v-else-if="fieldType==='combinationField'">
      组合字段
    </div>
    <div
      v-else-if="combinations.includes(fieldType)"
      :style="{
        height:fieldOptions.height?fieldOptions.height+'px':null
      }"
    >
      【{{ combinationFormTypeMap[fieldType] }}】 {{ showLabel }}
    </div>
    <div v-else-if="fieldType==='tag'" />
    <!-- =======================其它字段==============================-->
    <!-- 文本-->
    <span v-else-if="fieldType==='label'">
      <template v-if="defaultValue">
        {{ defaultValue }}
      </template>
      <template v-else>
        {{ fieldOptions.placeholder|| '用于展示文本或者公式计算的值,且数据不会保存' }}
      </template>
    </span>
    <!-- 链接-->
    <ibps-link
      v-else-if="fieldType==='hyperlink'|| fieldType==='button'"
      :text="hyperlinkText"
      :link="fieldOptions.link"
      :show-type="fieldOptions.showType"
      :text-type="fieldOptions.textType"
      :link-type="fieldOptions.linkType"
      :type="fieldOptions.type"
      :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
      :position="fieldOptions.position"
    />
    <span v-else>未知控件类型</span>
  </div>
</template>
<script>
import IbpsDictionary from '@platform/business/platform/cat/dictionary/select'
import IbpsAttachment from '@platform/business/platform/file/attachment/selector'
import IbpsImage from '@platform/business/platform/file/image'
import IbpsUserSelector from '@platform/business/platform/org/selector'
import IbpsAddress from '@platform/components/ibps-address/cascader'
import IbpsLink from '@platform/components/ibps-link'
import ApprovalOpinion from '@platform/business/platform/bpmn/components/approval-opinion'
import IbpsBpmInstHis from '@platform/business/platform/bpmn/components/bpm-inst-his'
import VueBarcode from 'vue-barcode'
import VueQrcode from 'vue-qrcode'
import Styles from '@platform/business/platform/form/utils/global-style'
import { combinationFormTypeMap } from '@platform/business/platform/form/constants/fieldOptions'
export default {
  components: {
    IbpsDictionary,
    IbpsAttachment,
    IbpsImage,
    IbpsUserSelector,
    IbpsAddress,
    IbpsLink,
    ApprovalOpinion,
    IbpsBpmInstHis,
    VueBarcode,
    VueQrcode
  },
  props: {
    element: Object,
    params: Object
  },
  data() {
    return {
      field: this.element,
      ajaxOptions: [{
        value: '0',
        label: '动态获取'
      }],
      combinations: ['detailForm', 'onlineForm', 'dataTemplate'],
      combinationFormTypeMap: combinationFormTypeMap
    }
  },
  computed: {
    fieldType() {
      return this.field.field_type
    },
    fieldOptions() {
      return this.field.field_options || {}
    },
    width() {
      return this.fieldOptions.is_width ? (this.fieldOptions.width || 100) + (this.fieldOptions.width_unit || '%') : '100%'
    },
    options() {
      if (this.field.field_options.datasource === 'valuesource') {
        return this.ajaxOptions
      } else {
        return this.field.field_options.options
      }
    },
    defaultValue() {
      if (this.field.field_options.default_value_type === 'fixed') {
        if (this.fieldType === 'radio' || this.fieldType === 'checkbox') {
          const defaultValue = []
          this.options.forEach((option, i) => {
            if (option.checked === true) {
              defaultValue.push(i)
            }
          })
          if (this.fieldType !== 'checkbox') {
            return defaultValue.length > 0 ? defaultValue[0] : void 0
          }
          return defaultValue
        } else if (this.fieldType === 'select') {
          const defaultValue = []
          this.options.forEach((option, i) => {
            if (option.checked === true) {
              defaultValue.push(option.label)
            }
          })
          if (this.fieldOptions.multiple) {
            return defaultValue
          } else {
            return defaultValue.length > 0 ? defaultValue[0] : void 0
          }
        } else if (this.fieldType === 'inputNumber') {
          const value = this.field.field_options.default_value
          if (!this.$utils.isValidNumber(value)) {return void 0}
          return Number(value)
        } else if (this.fieldType === 'selector') {
          return void 0
        } else if (this.fieldType === 'barcode' || this.fieldType === 'qrcode') {
          return this.field.field_options.default_value ? this.field.field_options.default_value : ''
        } else {
          return this.field.field_options.default_value
        }
      } else {
        return void 0
      }
    },
    autosize() {
      let autosize = this.field.field_options.autosize
      if (this.field.field_options.autosize && (this.field.field_options.min_rows || this.field.field_options.max_rows)) {
        const row = {}
        row.minRows = this.field.field_options.min_rows ? this.field.field_options.min_rows : null
        row.maxRows = this.field.field_options.max_rows ? this.field.field_options.max_rows : null
        autosize = row
      }
      return autosize
    },
    ueditorConfig() {
      const config = {
        initialContent: this.field.field_options.placeholder,
        toolbars: []
      }
      const toolbars = this.field.field_options.toolbars
      if (toolbars && toolbars.length > 0) {
        config.toolbars.push(toolbars)
      }
      return config
    },
    showText() {
      return this.$utils.toBoolean(this.field.field_options.show_text, true)
    },
    icon() {
      return 'ibps-icon-' + (this.field.field_options.icon || 'search')
    },
    topVal() {
      if (this.field.field_options.top === 'country') {
        return '0'
      }
      if (this.field.field_options.topval) {
        return this.field.field_options.topval[this.field.field_options.topval.length - 1]
      } else {
        return void 0
      }
    },
    hyperlinkText() {
      const text = this.fieldType === 'hyperlink' ? '链接' : '按钮'
      return this.field.field_options.textType === 'fixed' ? this.field.field_options.text || '' : '动态' + text
    },
    showLabel() {
      if (this.fieldOptions.hide_label) {
        return this.field.label
      }
      return ''
    }
  },
  watch: {
    element: {
      handler(val) {
        this.field = val
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.field = null
    this.ajaxOptions = null
  },
  methods: {
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
      this.$utils.isEmpty(this.params.formAttrs) ||
      this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    },
    getInstHis(data) {
      this.instHisTableData = JSON.parse(JSON.stringify(data))
    }
  }
}
</script>
