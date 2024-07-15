<template>
  <div :style="getRuleStyle()">
    <!-- 单行文本、 多行文本 -->
    <template v-if="fieldType==='text'||fieldType==='textarea'">
      <template v-if="readonlyText ">
        <div
          v-if="fieldType==='textarea'"
          class="ibps-field-text"
          v-html="$utils.formatText(dataModel)"
        />
        <div v-else class="ibps-field-text">{{ dataModel }}</div>
      </template>
      <el-input
        v-else
        v-model="dataModel"
        :placeholder="placeholder"
        :type="fieldType"
        :name="field.name"
        :autosize="autosize"
        :rows="fieldOptions.rows||3"
        :readonly="readonly"
        :clearable="clearable"
        :style="{width:width}"
        v-on="$listeners"
      />
    </template>
    <!-- 数字 -->
    <template v-else-if="fieldType==='number'">
      <template v-if="readonlyText ">
        <div class="ibps-field-text">{{ showModel(dataModel) }}</div>
      </template>
      <ibps-number
        v-else
        v-model="dataModel"
        :placeholder="placeholder"
        :name="field.name"
        :readonly="readonly"
        :width="width"
        :clearable="clearable"
        :precision="fieldOptions.decimal_places"
        :decimal-scale="fieldOptions.decimal_scale"
        :keep-decimals="fieldOptions.keep_decimals"
        :number-format="fieldOptions.number_format"
        :is-rounding="fieldOptions.is_rounding"
        :currency="fieldOptions.units"
        :thousands="fieldOptions.thousands"
        :step="fieldOptions.step"
        :controls="fieldOptions.controls"
        :position="isPosition?fieldOptions.position:null"
        v-on="$listeners"
      />
    </template>
    <!-- 计数器 -->
    <template v-else-if="fieldType === 'inputNumber'">
      <template v-if="readonlyText">
        <div class="ibps-field-text">{{ dataModel }}</div>
      </template>
      <el-input-number
        v-else
        v-model="numberDataModel"
        :max="fieldOptions.max"
        :min="fieldOptions.min"
        :step="fieldOptions.step"
        :precision="fieldOptions.precision"
        :controls="fieldOptions.controls"
        :controls-position="fieldOptions.controls_position"
        :placeholder="fieldOptions.placeholder"
        :readonly="readonly"
        :style="{width:width}"
        v-on="$listeners"
      />
    </template>
    <!-- 单项选择 -->
    <template v-else-if="fieldType==='radio'">
      <template v-if="readonlyText">
        <span v-if="$utils.isNotEmpty(dataModel)" class="ibps-field-text">
          {{ dataModel|optionsFilter(dataOptions,'label','val') }}
        </span>
      </template>
      <el-radio-group
        v-else
        v-model="dataModel"
        :disabled="readonly"
        v-on="$listeners"
        @change="changeEvent"
      >
        <component
          :is="fieldOptions.option_style==='button'?'el-radio-button':'el-radio'"
          v-for="o in dataOptions"
          :key="o.val"
          :label="o.val"
          :border="fieldOptions.border"
          :style="{
            display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
          class="ibps-pt-5"
        >
          <span :style="getStyleByName('valTypeface', 'valFontSize', 'valBold', 'valColor')+getRuleStyle()">{{ o.label }}</span>
        </component>
      </el-radio-group>
    </template>
    <!-- 多选项选择 -->
    <template v-else-if="fieldType==='checkbox'">
      <template v-if="readonlyText">
        <template v-if="checkboxDataModel && checkboxDataModel.length >0">
          <span v-for="(v,i) in checkboxDataModel" :key="i" class="ibps-mr-5">
            {{ v|optionsFilter(dataOptions,'label','val') }}
          </span>
        </template>
      </template>
      <el-checkbox-group
        v-else
        v-model="checkboxDataModel"
        :disabled="readonly"
        v-on="$listeners"
      >
        <component
          :is="fieldOptions.option_style==='button'?'el-checkbox-button':'el-checkbox'"
          v-for="o in dataOptions"
          :key="o.val"
          :label="o.val"
          :border="fieldOptions.border"
          :style="{display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
        >
          <span :style="getStyleByName('valTypeface', 'valFontSize', 'valBold', 'valColor')+getRuleStyle()">{{ o.label }}</span>
        </component>
      </el-checkbox-group>
    </template>
    <!-- 下拉框 -->
    <template v-else-if="fieldType==='select'">
      <template v-if="readonlyText">
        <template v-if="multipleSelect">
          <template v-if="selectDataModel && selectDataModel.length >0">
            <span v-for="(v,i) in selectDataModel" :key="i" class="ibps-mr-5">
              {{ v|optionsFilter(dataOptions,'label','val') }}
            </span>
          </template>
        </template>
        <template v-else>
          <span v-if="$utils.isNotEmpty(dataModel)">
            {{ dataModel|optionsFilter(dataOptions,'label','val') }}
          </span>
        </template>
      </template>
      <el-select
        v-else
        v-model="selectDataModel"
        :placeholder="dropdownPlaceholder"
        :name="field.name"
        :disabled="readonly"
        :style="{width:width}"
        :multiple="multipleSelect"
        :clearable="clearable"
        v-on="$listeners"
        @change="changeEvent"
      >
        <el-option
          v-for="o in dataOptions"
          :key="o.val"
          :label="o.label"
          :value="o.val"
        />
      </el-select>
    </template>
    <!-- 开关 -->
    <template v-else-if="fieldType==='switch'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(dataModel)">
          {{ dataModel|optionsFilter(switchOptions,'label','val') }}
        </el-tag>
      </template>
      <template v-else>
        <el-checkbox
          v-if="fieldOptions.appearance==='checkbox'"
          v-model="dataModel"
          :disabled="readonly"
          v-on="$listeners"
        />
        <el-switch
          v-else
          v-model="dataModel"
          :width="switchWidth"
          :active-value="fieldOptions.active_value"
          :inactive-value="fieldOptions.inactive_value"
          :active-text="showText?fieldOptions.active_text:''"
          :inactive-text="showText?fieldOptions.inactive_text:''"
          :active-color="fieldOptions.active_color"
          :inactive-color="fieldOptions.inactive_color"
          :disabled="readonly"
          v-on="$listeners"
        />
      </template>
    </template>
    <!-- 滑块 -->
    <template v-else-if="fieldType==='slider'">
      <template v-if="readonlyText ">
        <div class="ibps-field-text">{{ dataModel }}</div>
      </template>
      <div v-else style="width:99%;">
        <el-slider
          v-model="numberDataModel"
          :show-input="fieldOptions.show_input"
          :show-tooltip="fieldOptions.show_tooltip"
          :max="fieldOptions.max"
          :min="fieldOptions.min"
          :step="fieldOptions.step"
          :disabled="readonly"
          :style="{width:width}"
          v-on="$listeners"
        />
      </div>
    </template>
    <!-- 评分 -->
    <template v-else-if="fieldType==='rate'">
      <template v-if="readonlyText ">
        <div class="ibps-field-text">{{ dataModel }}</div>
      </template>
      <template v-else>
        <el-rate
          v-model="rateDataModel"
          :max="fieldOptions.max"
          :allow-half="fieldOptions.allow_half"
          :show-text="fieldOptions.show_text"
          :show-score="fieldOptions.show_score"
          :disabled="readonly"
          class="ibps-pt-10"
          v-on="$listeners"
        />
        <el-button
          v-if="clearable"
          type="text"
          class="ibps-rate__clear"
          @click="clearRate"
        >清空</el-button>
      </template>
    </template>
    <!-- 日期控件 -->
    <template v-else-if="fieldType==='datePicker'||fieldType==='currentTime'||fieldType==='currentDate'">
      <div v-if="readonlyText">
        {{ dataModel|dateFormat(datefmt,datefmt) }}
      </div>
      <template v-else>
        <el-date-picker
          v-if="datePckerType ==='datePicker'"
          v-model="dataModel"
          :type="dateType"
          :value-format="datefmt"
          :format="datefmt"
          :placeholder="selectPlaceholder"
          :style="{width:width}"
          :disabled="fieldType==='currentTime'||fieldType==='currentDate'?true:readonly"
          :clearable="clearable"
          v-on="$listeners"
        />
        <el-time-picker
          v-else-if="datePckerType ==='timePicker'"
          v-model="dataModel"
          :value-format="datefmt"
          :format="datefmt"
          :placeholder="selectPlaceholder"
          :style="{width:width}"
          :disabled="fieldType==='currentTime'||fieldType==='currentDate'?true:readonly"
          :clearable="clearable"
          v-on="$listeners"
        />
        <!--TODO:时间控件自定义格式-->
      </template>
    </template>
    <!-- =======================增强字段==============================-->
    <!--富文本框-->
    <template v-else-if="fieldType==='editor'">
      <div
        v-if="readonlyText"
        v-html="$utils.formatText(dataModel)"
      />
      <ibps-ueditor
        v-else
        v-model="dataModel"
        :placeholder="placeholder"
        :readonly="readonly"
        :config="ueditorConfig"
        destroy
        v-on="$listeners"
      />
    </template>
    <!--数据字典-->
    <ibps-dictionary
      v-else-if="fieldType==='dictionary'"
      v-model="dataModel"
      :type-key="fieldOptions.dictionary"
      :multiple="multiple"
      :select-mode="fieldOptions.select_mode"
      :display-mode="fieldOptions.display_mode"
      :separator="fieldOptions.split"
      :placeholder="fieldOptions.placeholder"
      :disabled="readonly"
      :readonly="readonly"
      :readonly-text="readonlyText?'text':'original'"
      :clearable="clearable"
      :display-effect="$utils.isNotEmpty(fieldOptions.display_effect)?fieldOptions.display_effect:{}"
      :style="{width:width}"
      v-on="$listeners"
    />
    <!-- 自动编号-->
    <template v-else-if="fieldType==='autoNumber'">
      <ibps-auto-number
        v-model="dataModel"
        :alias="fieldOptions.identity"
        :init="fieldOptions.init==='true'||fieldOptions.init"
        :placeholder="placeholder"
        :readonly="readonly"
        :readonly-text="readonlyText"
        v-on="$listeners"
      />
    </template>
    <!-- 上传附件-->
    <ibps-attachment
      v-else-if="fieldType==='attachment'"
      v-model="dataModel"
      :placeholder="selectPlaceholder"
      :download="fieldOptions.download"
      :readonly="readonly"
      :limit="fileQuantity"
      :file-size="maxFileSize"
      :accept="fileAccept"
      :file-ext="fileFormates"
      :multiple="multiple"
      :upload-type="fieldOptions.uploadType"
      :store="fieldOptions.store"
      :media-type="fieldOptions.media_type"
      :media="fieldOptions.media"
      :style="{width:width}"
      v-on="$listeners"
    />
    <!-- 选择器-->
    <ibps-user-selector
      v-else-if="fieldType==='selector' || fieldType==='currentUser' || fieldType==='currentOrg' "
      v-model="selectorDataModel"
      :placeholder="selectPlaceholder"
      :type="fieldOptions.selector_type"
      :filter="fieldOptions.filter"
      :multiple="multiple"
      :form-data="formData"
      :store="fieldOptions.store||'id'"
      :value-key="fieldOptions.store==='bind'?'name':'id'"
      :is-value-come-init="selectorAction==='confirm'"
      :disabled="(fieldType==='currentUser' || fieldType==='currentOrg')?true:readonly"
      :readonly-text="readonlyText?'text':null"
      :style="{width:width}"
      @action="buttonKey => selectorAction = buttonKey"
      @change-link-data="handleSeletorLinkageData"
      v-on="$listeners"
    />
    <!--自定义对话框-->
    <ibps-custom-dialog
      v-else-if="fieldType === 'customDialog'"
      v-model="dataModel"
      :template-key="fieldOptions.dialog"
      :dynamic-params="dynamicParams"
      :has-dynamic-params="hasDynamicParams"
      :multiple="multipleString"
      :placeholder="selectPlaceholder"
      :store="fieldOptions.store"
      :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
      :type="fieldOptions.dialog_type"
      :disabled="readonly"
      :readonly-text="readonlyText?'text':null"
      :style="{width:width}"
      @change-link-data="handleLinkageData"
      @change-link-attr="handleLinkageAttr"
      v-on="$listeners"
    />
    <!-- 关联数据-->
    <ibps-link-data
      v-else-if="fieldType==='linkdata'"
      v-model="dataModel"
      :template-key="fieldOptions.linkdata"
      :dynamic-params="dynamicParams"
      :has-dynamic-params="hasDynamicParams"
      :placeholder="selectPlaceholder"
      :multiple="multipleString"
      :structure="structure"
      :value-key="valueKey"
      :label-type="labelType"
      :label-key="labelKey"
      :pageable="linkConfig.pageable"
      :page-size="linkConfig.page_size"
      :config="linkConfig"
      :disabled="readonly"
      :readonly="readonly"
      :readonly-text="readonlyText?'text':'original'"
      :style="{width:width}"
      @change-link-data="handleLinkageData"
      @change-link-attr="handleLinkageAttr"
      v-on="$listeners"
    />
    <!-- 级联-->
    <el-cascader
      v-else-if="fieldType==='cascader'"
      v-model="selectDataModel"
      :options="dataOptions"
      :placeholder="selectPlaceholder"
      :clearable="clearable"
      :show-all-levels="fieldOptions.display_mode==='path'"
      :separator="fieldOptions.split"
      :props="{
        multiple:multipleSelect,
        expandTrigger:fieldOptions.expand_trigger,
        checkStrictly: fieldOptions.select_mode==='any',
        value:'val',
        emitPath:false
      }"
      :disabled="readonly"
      :readonly="readonly"
      :style="{width:width}"
      v-on="$listeners"
    />
    <!-- 地址-->
    <div
      v-else-if="fieldType==='address'"
    >
      <ibps-address
        v-model="addressValue"
        :size="fieldOptions.size"
        :top="fieldOptions.top || 'country'"
        :top-val="addressTopVal"
        :level="fieldOptions.level||'district'"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        :placeholder="selectPlaceholder"
        data-type="code"
        :style="{width:width}"
        v-on="$listeners"
      />
      <span v-if="readonlyText">
        {{ streetValue }}
      </span>
      <template v-else>
        <p />
        <el-input
          v-if="fieldOptions.is_street"
          v-model="streetValue"
          :disabled="readonly"
          :style="{width:width}"
          :placeholder="fieldOptions.street_placeholder"
          type="textarea"
        />
      </template>
    </div>
    <!-- 签名-->
    <ibps-signature
      v-else-if="fieldType==='signature'"
      v-model="dataModel"
      :placeholder="placeholder"
      :height="fieldOptions.height"
      :disabled="readonly"
      :style="{width:width}"
      v-on="$listeners"
    />
    <!-- 图片-->
    <ibps-image
      v-else-if="fieldType==='image'"
      v-model="dataModel"
      :width="fieldOptions.width"
      :height="fieldOptions.height"
      :limit="fieldOptions.limit"
      :accept="imagesAccept"
      :media="fieldOptions.media"
      :tip="fieldOptions.tip"
      :size="fieldOptions.size"
      :upload-type="fieldOptions.uploadType"
      :disabled="readonly"
      v-on="$listeners"
    />
    <!-- 条形码 -->
    <vue-barcode
      v-else-if="fieldType==='barcode'"
      v-model="dataModel"
      :format="fieldOptions.format"
      :width="fieldOptions.barcode_width"
      :height="fieldOptions.barcode_height"
      :background="fieldOptions.background"
      :line-color="fieldOptions.line_color"
      :display-value="fieldOptions.display_value"
      v-on="$listeners"
    />
    <!-- 二维码 -->
    <template v-else-if="fieldType==='qrcode'">
      <vue-qrcode
        v-if="dataModel"
        v-model="dataModel"
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
        v-on="$listeners"
      />
    </template>
    <!-- 定位 -->
    <ibps-location
      v-else-if="fieldType==='location'"
      v-model="dataModel"
      :readonly="readonly"
      :limits="fieldOptions.limits"
      :lnglat="fieldOptions.lnglat"
      :adjustable="fieldOptions.adjustable"
      :radius="fieldOptions.radius"
      v-on="$listeners"
    />
    <!-- 流程实例 -->
    <ibps-bpm-inst-his
      v-else-if="fieldType==='bpmInstHis'"
      v-model="jsonArrayDataModel"
      :bpm-def-scope="fieldOptions.filter.bpmDefScope"
      :bpm-def-key="fieldOptions.filter.bpmDefKey"
      :script="fieldOptions.filter.script"
      :starter-scope="fieldOptions.filter.starterScope"
      :starter="fieldOptions.filter.starter"
      :placeholder="selectPlaceholder"
      :readonly="readonly"
      v-on="$listeners"
    />
    <!--流程关联-->
    <ibps-bpm-link
      v-else-if="fieldType==='bpmLink'"
      :data="bpmLinkData"
      :bpm-link-type="bpmLinkType"
    />
    <!-- =======================自定义控件==============================-->
    <!-- 自定义组件 -->
    <template v-else-if="fieldType==='component'">
      <component
        :is="fieldOptions.component_name"
        v-model="dataModel"
        :field="field"
        :form-data="formData"
        :readonly="readonly"
        :readonly-style="readonlyStyle"
        :code="code"
        :row="row"
        :params="params"
        :cascade-params="cascadeDynamicParams"
        @change-data="changeFormData"
        @cascade-data="handleCascadeData"
        v-on="$listeners"
      />
    </template>
    <!-- 自定义控件 -->
    <template v-else-if="fieldType==='control'">
      <component
        :is="fieldOptions.component_name"
        v-model="dataModel"
        :field="field"
        :form-data="formData"
        :readonly="readonly"
        :readonly-style="readonlyStyle"
        :code="code"
        :row="row"
        :params="params"
        :cascade-params="cascadeDynamicParams"
        @change-data="changeFormData"
        @cascade-data="handleCascadeData"
        v-on="$listeners"
      />
    </template>
    <!-- =======================其它字段==============================-->
    <!-- 链接 -->
    <ibps-link
      v-else-if="fieldType === 'hyperlink'|| fieldType === 'button'"
      :text="fieldOptions.text"
      :cascade-configuration="fieldOptions.cascade_configuration"
      :link="fieldOptions.link"
      :show-type="fieldOptions.showType"
      :text-type="fieldOptions.textType"
      :link-type="fieldOptions.linkType"
      :text-javascript="fieldOptions.text_javascript"
      :type="fieldOptions.type"
      :position="fieldOptions.position"
      :form-data="dynamicForm"
      preview-entrance
      :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
      v-on="$listeners"
    />
    <!-- 文本-->
    <span v-else-if="fieldType==='label'">
      <template v-if="value">
        {{ value }}
      </template>
      <template v-else>
        {{ placeholder }}
      </template>
    </span>
    <!-- 组合字段-->
    <div v-else-if="fieldType==='combinationField'" class="ibps-field-text">
      {{ combinationDataModel }}
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { isEqual } from 'element-ui/lib/utils/util'
import { getByKey, queryDataTable } from '@platform/api/platform/data/dataTemplate'
import ActionUtils from '@platform/utils/action'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import { fileTypes as FILE_TYPES, accept as ACCEPT } from '@platform/business/platform/file/constants/fileTypes'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import DateFormatUtil from '@platform/business/platform/form/utils/dateFormatUtil'
import { getDynamicParams } from '@platform/business/platform/form/utils/formCascadeUtil'
import IbpsDictionary from '@platform/business/platform/cat/dictionary/select'
import IbpsAutoNumber from '@platform/business/platform/system/identity/auto-number'
import IbpsAttachment from '@platform/business/platform/file/attachment/selector'
import IbpsUserSelector from '@platform/business/platform/org/selector'
import IbpsAddressCascader from '@platform/components/ibps-address/cascader'
import IbpsSignature from './components/signature'
import IbpsImage from '@platform/business/platform/file/image'
import IbpsLink from '@platform/components/ibps-link'
import IbpsCustomDialog from '@platform/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@platform/business/platform/data/templaterender/link-data'
import IbpsBpmInstHis from '@platform/business/platform/bpmn/components/bpm-inst-his'
import IbpsBpmLink from '@platform/business/platform/bpmn/components/bpm-link'
import IbpsNumber from '@platform/components/ibps-number'
import IbpsLocation from '@platform/components/ibps-location'
import VueBarcode from 'vue-barcode'
import VueQrcode from 'vue-qrcode'
import Styles from '@platform/business/platform/form/utils/global-style'
import { getToken } from '@platform/utils/auth'
const _import = require('@platform/utils/util.import.' + process.env.NODE_ENV)
export default {
  components: {
    'ibps-dictionary': IbpsDictionary,
    'ibps-auto-number': IbpsAutoNumber,
    'ibps-attachment': IbpsAttachment,
    'ibps-user-selector': IbpsUserSelector,
    'ibps-address': IbpsAddressCascader,
    'ibps-signature': IbpsSignature,
    'ibps-image': IbpsImage,
    'ibps-link': IbpsLink,
    'ibps-custom-dialog': IbpsCustomDialog,
    'ibps-link-data': IbpsLinkData,
    'ibps-bpm-inst-his': IbpsBpmInstHis,
    'ibps-bpm-link': IbpsBpmLink,
    'ibps-number': IbpsNumber,
    'ibps-location': IbpsLocation,
    'vue-barcode': VueBarcode,
    'vue-qrcode': VueQrcode
  },
  inject: ['dynamicForm'],
  props: {
    value: {
      type: [String, Number, Date, Object, Array]
    },
    formData: [Object, Array], // 所有字段数据,(包含主主子表)
    field: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    readonlyStyle: {
      type: String,
      default: 'text'
    },
    code: String, // 表名
    row: [String, Number], // 子表行数
    params: {
      type: Object
    }
  },
  data() {
    return {
      dataModel: this.value,
      ajaxOptions: [],
      ajaxOptionMap: {},
      selectorAction: '',
      dataTemplate: {},
      cascadeDynamicParams: {}
    }
  },
  computed: {
    // 判断数字控件的单位位置是否为数据前、后
    isPosition() {
      return ['front', 'after', 'behind'].includes(this.field.field_options.position)
    },
    fieldType() {
      return this.field.field_type
    },
    fieldOptions() {
      return this.field.field_options || {}
    },
    width() {
      return this.fieldOptions.is_width ? (this.fieldOptions.width || 100) + (this.fieldOptions.width_unit || '%') : '100%'
    },
    switchWidth() {
      return this.fieldOptions.is_width ? (this.fieldOptions.width || 40) : 40
    },
    checkboxDataModel: {
      get() {
        if (Array.isArray(this.dataModel)) {
          return this.dataModel
        }
        return this.dataModel ? this.dataModel.split(',') : []
      },
      set(value) {
        this.dataModel = value.join(',')
      }
    },
    selectDataModel: {
      get() {
        if (this.multipleSelect) {
          if (Array.isArray(this.dataModel)) {
            return this.dataModel
          }
          return this.dataModel ? this.dataModel.split(',') : []
        } else {
          return this.dataModel
        }
      },
      set(value) {
        this.dataModel = this.multipleSelect ? value.join(',') : value
      }
    },
    selectorDataModel: {
      get() {
        return this.dataModel
      },
      set(value) {
        this.dataModel = value
      }
    },
    rateDataModel: {
      get() {
        if (!this.$utils.isNum(this.dataModel)) {return}
        // 无效的数据引起的问题
        if (Number(this.dataModel) > this.fieldOptions.max) {
          return 0
        }
        return Number(this.dataModel)
      },
      set(value) {
        this.dataModel = value
      }
    },
    numberDataModel: {
      get() {
        if (!this.$utils.isNum(this.dataModel)) {return}
        return Number(this.dataModel)
      },
      set(value) {
        this.dataModel = value
      }
    },
    jsonArrayDataModel: {
      get() {
        if (this.$utils.isEmpty(this.dataModel)) {return ''}
        return this.$utils.parseJSON(this.dataModel)
      },
      set(value) {
        this.dataModel = value === '' ? '' : JSON.stringify(value)
      }
    },
    addressTopVal() {
      return FormUtils.getAddressTopVal(this.fieldOptions)
    },
    // 地址值
    addressValue: {
      get() {
        return FormUtils.getAddressControlValue(this.dataModel, this.fieldOptions)
      },
      set(value) {
        this.dataModel = FormUtils.getAddressValue(value, this.dataModel, this.fieldOptions)
      }
    },
    streetValue: {
      get() {
        if (this.$utils.isEmpty(this.dataModel)) {
          return ''
        }
        const data = this.$utils.parseJSON(this.dataModel)
        return data['street'] || ''
      },
      set(val) {
        let data = {}
        if (this.$utils.isNotEmpty(this.dataModel)) {
          data = this.$utils.parseJSON(this.dataModel)
        }
        data['street'] = val
        this.dataModel = JSON.stringify(data)
      }
    },
    readonlyText() {
      if (!this.readonly) {return false}
      return this.readonlyStyle === 'text'
    },
    combinationDataModel() {
      return this.getCombinationData(this.fieldOptions.combination)
    },
    // 自适应内容高度
    autosize() {
      let autosize = this.fieldOptions.autosize
      if (this.fieldOptions.autosize && (this.fieldOptions.min_rows || this.fieldOptions.max_rows)) {
        const rows = {}
        rows.minRows = this.fieldOptions.min_rows ? this.fieldOptions.min_rows : null
        rows.maxRows = this.fieldOptions.max_rows ? this.fieldOptions.max_rows : null
        autosize = rows
      }
      return autosize
    },
    // 日期格式
    datefmt() {
      if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
        if (this.fieldType === 'currentDate') {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        } else if (this.fieldType === 'currentTime') {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['time']
        } else {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        }
      } else {
        return this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
      }
    },
    /**
     * 日期格式处理
     */
    dateDealFmt() {
      return DateFormatUtil.dealFmt(this.datefmt)
    },
    // 日期控件类型
    datePckerType() {
      return this.dateDealFmt.datePckerType
    },
    dateType() {
      // year/month/date/week/ datetime/datetimerange/daterange
      // 根据自定义日期格式的配置
      return this.dateDealFmt.dateType || 'datetime'
    },
    /**
     * 单选、多选、下拉等选项
     */
    dataOptions() {
      return this.field.field_options['options'] || this.ajaxOptions
    },
    /**
     * switch选项
     */
    switchOptions() {
      return FormUtils.getSwitchOptions(this.field.field_options)
    },
    /**
     *  占位符
     */
    placeholder() {
      return !this.readonly ? this.fieldOptions['placeholder'] : ''
    },
    /**
     * 下拉占位符
     */
    dropdownPlaceholder() {
      return this.$utils.isNotEmpty(this.placeholder) ? (this.fieldOptions['include_blank_value'] || this.placeholder) : ''
    },
    /**
     * 选择类型占位符
     */
    selectPlaceholder() {
      return this.$utils.isNotEmpty(this.placeholder) ? this.placeholder : '请选择'
    },
    /**
     * 可清空
     */
    clearable() {
      return this.$utils.toBoolean(this.fieldOptions['clearable'], true)
    },
    showText() {
      return this.$utils.toBoolean(this.fieldOptions.show_text, true)
    },
    /**
     * 编辑器按钮
     */
    ueditorConfig() {
      const config = {
        initialContent: this.placeholder,
        toolbars: []
      }
      const toolbars = this.fieldOptions.toolbars
      if (toolbars && toolbars.length > 0) {
        config.toolbars.push(toolbars)
      }
      return config
    },
    /**
     * 最大文件上传
     */
    maxFileSize() {
      return this.$utils.isNotEmpty(this.fieldOptions.max_file_size) ? parseInt(this.fieldOptions.max_file_size, 10) : null
    },
    /**
     * 最大文件个数
     */
    fileQuantity() {
      if (this.$utils.isNotEmpty(this.fieldOptions.max_file_quantity) && (this.fieldOptions.max_file_quantity !== '-1' || this.fieldOptions.max_file_quantity !== -1)) {
        return parseInt(this.fieldOptions.max_file_quantity, 10)
      } else {
        return null
      }
    },
    // 格式类型
    fileAccept() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) {return '*'}
      return ACCEPT[mediaType] || '*'
    },
    imagesAccept() {
      const accept = this.fieldOptions.accept
      if (this.$utils.isEmpty(accept)) {return ACCEPT['images']}
      if (accept === 'custom') {
        return this.fieldOptions.media
      }
      return accept
    },
    fileFormates() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) {return []}
      const x = FILE_TYPES[mediaType]
      if ((x)) {
        return x.map((v) => {
          return '.' + v
        })
      } else {
        return (this.fieldOptions.media || '').split(',')
      }
    },
    bindId() {
      return this.fieldOptions['bind_id'] || ''
    },
    /**
     * 是否多选[字符串]
     */
    multipleString() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'] === 'Y', true)
    },
    /**
     * 是否多选
     */
    multiple() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'], true)
    },
    /**
     * 是否多选
     */
    multipleSelect() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'], false)
    },
    // 高
    height() {
      return this.fieldOptions.height ? parseInt(this.fieldOptions.height, 10) : null
    },
    // 其他选项值
    otherOptionValue: {
      get() {
        const otherId = this.fieldOptions['option_other_id']
        if (this.$utils.isEmpty(otherId)) {return}
        return this.models[otherId] || ''
      },
      set(value) {
        const otherId = this.fieldOptions['option_other_id']
        if (this.$utils.isEmpty(otherId)) {return}
        this.changeFormData(otherId, value)
      }
    },
    structure() {
      return FormUtils.getLinkStructure(this.fieldOptions, this.models)
    },
    valueKey() {
      return FormUtils.getLinkValueKey(this.fieldOptions, this.models)
    },
    labelType() {
      return FormUtils.getLinkLabelType(this.fieldOptions, this.models)
    },
    labelKey() {
      return FormUtils.getLinkLabelKey(this.fieldOptions, this.models)
    },
    linkConfig() {
      return FormUtils.getLinkConfig(this.fieldOptions, this.models)
    },
    hasDynamicParams() {
      return FormUtils.hasLinkDynamicParams(this.fieldOptions)
    },
    dynamicParams() {
      return FormUtils.getLinkDynamicParams(this.fieldOptions, this.formData, this.code, this.row)
    },
    models() {
      if (!this.formData) {return {}}
      return this.$utils.isNotEmpty(this.row) ? (this.formData[this.code] ? this.formData[this.code][this.row] : this.formData) : this.formData
    },
    isValueSource() {
      return ((this.fieldType === 'radio' || this.fieldType === 'checkbox' || this.fieldType === 'select' || this.fieldType === 'cascader') &&
       this.fieldOptions['datasource'] === 'valuesource')
    },
    bpmLinkData() {
      return this.params ? this.params.bpmLinkData : null
    },
    bpmLinkType() {
      return this.field.field_options ? this.field.field_options.bpmLinkType : null
    }
  },
  watch: {
    value: {
      handler(val) {
        this.dataModel = val
      },
      immediate: true,
      deep: true
    },
    dataModel: {
      handler(val) {
        let _val = val
        if (this.fieldType === 'editor' && this.$utils.isNotEmpty(val)) {
          _val = this.changeToken(val)
          this.dataModel = _val
        }
        this.$emit('update:value', _val)
      },
      immediate: true,
      deep: true
    },
    dynamicParams: {
      handler(val, oldVal) {
        if (!isEqual(val, oldVal) && this.isValueSource) {
          this.loadAjaxOptions()
        }
      },
      deep: true
    },
    selectorDataModel: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('change', val)
        }
      },
      deep: true
    },
    formData: {
      handler(val, oldVal) {
        if (!isEqual(val, oldVal)) {
          this.setCascadeDynamicParams()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.isValueSource) {
      this.$set(this.field.field_options, 'options', null)
      getByKey({
        dataTemplateKey: this.fieldOptions['value_source']
      }).then(response => {
        this.dataTemplate = this.$utils.parseData(response.data)
        this.loadAjaxOptions()
      }).catch(() => {
      })
    }
    if (this.fieldType === 'component' || this.fieldType === 'control') {
      const component = _import(this.fieldOptions.component_url)
      if (component) {
        Vue.component(this.fieldOptions.component_name, component)
      }
    }
  },
  beforeDestroy() {
    this.dataModel = null
    this.ajaxOptions = null
    this.ajaxOptionMap = null
    this.dataTemplate = null
    this.cascadeDynamicParams = null
  },
  methods: {
    // 改变token
    changeToken(val) {
      if (this.$utils.isEmpty(val)) {val}
      const regexp = /((https|http|ftp|rtsp|mms)?:\/\/)([^\s]*)(\/file\/preview\?)([^\s]*)(access_token=[^(\s|&)]+)(&|'|")/g
      const access_token = 'access_token=' + getToken()
      val = val.replace(regexp, `$1$3$4$5${access_token}$7`)
      return val
    },
    // 获取规则配置中的样式
    getRuleStyle() {
      if (this.$utils.isEmpty(this.field) ||
        this.$utils.isEmpty(this.field.field_options)) {return ''}
      let _style = Styles.getBgColorByName(this.field.field_options, 'rule_background_color')
      _style += Styles.getColorByName(this.field.field_options, 'rule_color')
      return _style
    },
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
      this.$utils.isEmpty(this.params.formAttrs) ||
      this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    },
    showModel(val) {
      if (this.$utils.isEmpty(val)) {
        return ''
      }
      val = Number(val)
      if (this.$utils.isEmpty(this.fieldOptions.number_format)) {return val}
      if (this.fieldOptions.number_format === 'percent') {
        val = val * 100
        val = this.getNumByDecimals(val)
        val += '%'
      } else {
        val = this.getNumByDecimals(val)
        if (this.fieldOptions.thousands) {
          val = this.$utils.comdify(val)
        }
      }
      if (this.$utils.isNotEmpty(this.fieldOptions.units) && this.isPosition) {
        val += (' ' + this.fieldOptions.units)
      }
      return val
    },
    getNumByDecimals(val) {
      if (this.fieldOptions.keep_decimals) {
        if (this.$utils.isNotEmpty(this.fieldOptions.decimal_places)) {
          if (this.fieldOptions.decimal_scale) {
            val = val.toFixed(this.fieldOptions.decimal_places)
          } else {
            const multiple = Math.pow(10, this.fieldOptions.decimal_places)
            val = ((Math.round(val * multiple)) / multiple).toString()
          }
        }
      }
      return val
    },
    getValuesourceParams(template, dataTemplate) {
      const formParams = {}
      const responseData = JSON.parse(JSON.stringify(template))
      responseData.datasetKey = dataTemplate.datasetKey
      responseData.unique = this.valueKey
      responseData['key'] = this.fieldOptions['value_source']
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = ''
      return ActionUtils.formatParams(formParams)
    },
    loadAjaxOptions() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return
      }
      const template = this.dataTemplate.templates[0]
      queryDataTable(this.getValuesourceParams(template, this.dataTemplate)).then(resp => {
        const data = resp.data || {}
        const dataResult = data.dataResult || []
        const options = []
        const optionMap = {}
        dataResult.forEach(item => {
          const keyValue = item[this.valueKey]
          options.push({
            val: keyValue,
            label: item[this.labelKey]
          })
          optionMap[keyValue] = item
        })
        this.ajaxOptions = options
        this.ajaxOptionMap = optionMap
      })
    },
    // 选择器存储格式-绑定标识
    handleSeletorLinkageData(value, data, type) {
      if (this.multipleString) {
        return
      }
      const linkLinkage = this.fieldOptions['bindFiled'] // 绑定字段
      let bind = this.fieldOptions['bind'] // 获取作为绑定字段属性值得属性
      if (type === 'role' && bind === 'alias') {
        bind = 'roleAlias'
      }
      if (this.$utils.isEmpty(linkLinkage) || this.$utils.isEmpty(data)) {return}
      const field = linkLinkage
      const fieldObj = field ? field.split('.') : []// 改变的字段
      const selectorData = JSON.parse(JSON.stringify(data))
      const targetValues = []
      selectorData.forEach(s => {
        if (s.id) {
          targetValues.push(s[bind])
        }
      })
      let targetString
      this.$utils.isNotEmpty(this.models[linkLinkage]) ? targetString = this.models[linkLinkage] + ',' + targetValues.join(',') : targetString = targetValues.join(',')
      if (this.$utils.isNotEmpty(fieldObj)) {
        const fieldName = fieldObj.length > 1 ? fieldObj[1] : fieldObj[0]
        if (this.$utils.isNotEmpty(fieldName) && this.models.hasOwnProperty(fieldName)) {
          this.changeFormData(fieldName, targetString || '')
        }
      }
    },
    getCombinationData(text) {
      if (this.$utils.isEmpty(text)) {return ''}
      const d = text.split(new RegExp(FormOptions.t.COMMON_REG.VALIDATOR, 'g'))
      const rtn = []
      d.forEach(n => {
        let a = n
        if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = f ? this.$utils.isNotEmpty(this.models[f[0]]) ? this.models[f[0]] : '' : ''
        }
        rtn.push(a)
      })
      return rtn.join('')
    },
    /**
     * 联动数据
     */
    handleLinkageData(value, data) {
      if (this.multipleString) {
        return
      }
      const linkLinkage = this.fieldOptions['link_linkage']
      if (this.$utils.isEmpty(linkLinkage) || this.$utils.isEmpty(data)) {return}
      for (let i = 0; i < linkLinkage.length; i++) {
        const item = linkLinkage[i]
        const field = item.field
        const fieldObj = field ? field.split('.') : []// 改变的字段
        if (this.$utils.isNotEmpty(fieldObj)) {
          const fieldName = fieldObj.length > 1 ? fieldObj[1] : fieldObj[0]
          if (this.$utils.isNotEmpty(fieldName) && this.models.hasOwnProperty(fieldName)) {
            this.changeFormData(fieldName, this.$utils.isNotEmpty(data[item.name]) ? data[item.name] : '')
          }
        }
      }
    },
    /**
     *  联动属性
     */
    handleLinkageAttr(value, data) {
      if (this.multipleString) {
        return
      }
      const linkAttr = this.fieldOptions['link_attr']
      if (this.$utils.isEmpty(linkAttr) || this.$utils.isEmpty(data)) {return}
      for (let i = 0; i < linkAttr.length; i++) {
        const item = linkAttr[i]
        const field = item.field
        const fieldObj = field ? field.split('.') : []// 改变的字段
        if (this.$utils.isNotEmpty(fieldObj)) {
          const fieldName = fieldObj.length > 1 ? fieldObj[1] : fieldObj[0]
          if (this.$utils.isNotEmpty(fieldName) && this.models.hasOwnProperty(fieldName)) {
            this.changeFormData(fieldName, this.$utils.isNotEmpty(data[item.name]) ? data[item.name] : '')
          }
        }
      }
    },
    clearRate() {
      this.dataModel = 0
    },
    changeEvent(value) {
      this.$emit('change', value)
      if (this.multipleString) {
        return
      }
      this.handleLinkageData(value, this.ajaxOptionMap[value] || {})
      this.handleLinkageAttr(value, this.ajaxOptionMap[value] || {})
    },
    /**
     * 选择器绑定id
     */
    selectorBindCallback(value) {
      const bindId = this.bindId
      if (this.$utils.isEmpty(bindId)) {
        this.$message.error('[' + this.label + ']字段未绑Id')
        return
      }
      this.changeFormData(bindId, value || '')
    },
    /**
     * 更新字段值（主表或其他子表）
     */
    changeFormData(name, value) {
      this.$emit('change-data', name, value)
    },
    async setCascadeDynamicParams() {
      const cascadeDynamicParams = await getDynamicParams(this.fieldOptions.params, this.models)
      this.cascadeDynamicParams = cascadeDynamicParams
    },
    /**
     * 级联数据
     */
    handleCascadeData(data) {
      FormUtils.handleCascadeData(data, this.fieldOptions.cascades, this.dynamicForm)
    }
  }
}
</script>
