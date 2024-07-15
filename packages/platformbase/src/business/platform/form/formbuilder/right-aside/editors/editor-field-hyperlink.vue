<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span>{{ title }}设置</span>
    </div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">{{ title }}文本<help-tip prop="hyperlinkText" /></template>
        <el-select
          v-model="fieldOptions.textType"
          style="width:100%;"
          @change="changeTextValueType"
        >
          <el-option
            v-for="item in textValueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="ibps-pt-5">
          <template v-if="fieldOptions.textType === 'fixed'">
            <el-input v-model="fieldOptions.text" clearable />
          </template>
          <template v-else-if="fieldOptions.textType === 'combination'">
            <combination-field v-model="fieldOptions.text_javascript" :fields="boFields" value-key="key" label-key="name" />
          </template>
          <template v-else>
            <el-button type="primary" plain style="width:100%;" @click="handleTextValue">{{ fieldOptions.textType | optionsFilter(textValueOptions) }}</el-button>
          </template>
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <template slot="label">显示类型</template>
        <el-select v-model="fieldOptions.showType" style="width:100%;">
          <el-option v-for="item in showTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <template slot="label">显示样式</template>
        <el-select v-model="fieldOptions.type" style="width:100%;">
          <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <template slot="label">位置</template>
        <el-radio-group v-model="fieldOptions.position">
          <el-radio-button label="left">居左</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">居右</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <template slot="label">事件脚本类型<help-tip prop="hyperlinkScriptType" /></template>
        <el-select v-model="fieldOptions.linkType" style="width:100%;" @change="changeLinkValueType">
          <el-option v-for="item in defauleValueOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="ibps-pt-5">
          <template v-if="fieldOptions.linkType === 'fixed'">
            <el-input v-model="fieldOptions.link" type="textarea" autosize clearable />
          </template>
          <template v-else>
            <el-button type="primary" plain style="width:100%;" @click="handleDefaultValue">{{ fieldOptions.linkType | optionsFilter(defaultValueTypeOptions) }}</el-button>
          </template>
        </div>
      </el-form-item>
    </div>
    <!-- 事件脚本类型-动态脚本 -->
    <dynamic-script
      :visible="dynamicScriptVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="evenDialogData"
      type="hyperlink"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptVisible = visible"
    />
    <!-- 事件脚本类型-JS脚本 -->
    <javascript-script
      :visible="javascriptScriptVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="evenDialogData"
      :show-type="fieldOptions.showType"
      @callback="setDefaultValue"
      @close="visible => javascriptScriptVisible = visible"
    />
    <!-- 事件脚本类型-级联配置 -->
    <cascade-configuration
      :data="fieldItem.field_options.cascade_configuration"
      :title="linkTypeTitle"
      :visible="cascadeVisible"
      :bo-fields="boFields"
      :bo-data="boData"
      @callback="setCascadeConfiguration"
      @close="visible => cascadeVisible = visible"
    />
    <!-- 文本展示-动态脚本 -->
    <dynamic-script
      :visible="dynamicScriptTextVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="textDialogData"
      type="hyperlink"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptTextVisible = visible"
    />
    <!-- 文本展示-JS脚本 -->
    <javascript-script
      :visible="javascriptScriptTextVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="textDialogData"
      @callback="setDefaultTextValue"
      @close="visible => javascriptScriptTextVisible = visible"
    />
  </div>
</template>
<script>
import { defaultValueTypeOptions, colorOptions } from '@platform/business/platform/form/constants/fieldOptions'
import DynamicScript from '../components/dynamic-script'
import JavascriptScript from '../components/javascript-script'
import EditorMixin from '../mixins/editor'
import CombinationField from '@platform/business/platform/form/components/combination-field'
import CascadeConfiguration from '../components/cascade-configuration'
export default {
  components: {
    CombinationField,
    DynamicScript,
    JavascriptScript,
    CascadeConfiguration
  },
  mixins: [EditorMixin],
  props: {
    boData: {
      type: Array
    },
    fields: {
      type: Array
    },
    defaultValueTypes: { // 默认值类型
      type: String,
      default: 'cascade,dynamic,javascript'
    },
    linkValueTypes: { //  显示文字类型
      type: String,
      default: 'fixed,javascript,dynamic'
    }
  },
  data() {
    return {
      defaultValueTypeOptions,
      colorOptions,
      showTypeOptions: [{
        value: 'link',
        label: '链接'
      }, {
        value: 'button',
        label: '按钮'
      }],
      dynamicScriptVisible: false,
      dynamicScriptTextVisible: false,
      isLinkButtonClick: false,
      javascriptScriptVisible: false,
      javascriptScriptTextVisible: false,
      tDialogData: this.fieldItem.field_options.text_javascript,
      eDialogData: this.fieldItem.field_options.link,
      cascadeVisible: false
    }
  },
  computed: {
    linkTypeTitle() {
      if (this.$utils.isEmpty(this.fieldOptions.linkType)) {return ''}
      for (let i = 0; i < defaultValueTypeOptions.length; i++) {
        if (defaultValueTypeOptions[i].value === this.fieldOptions.linkType) {
          return defaultValueTypeOptions[i].label
        }
      }
      return ''
    },
    title() {
      return this.fieldOptions.showType === 'link' ? '链接' : '按钮'
    },
    defauleValueOptions() {
      const options = []
      defaultValueTypeOptions.forEach((type) => {
        if (this.defaultValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    textValueOptions() {
      const options = []
      defaultValueTypeOptions.forEach((type) => {
        if (this.linkValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      options.push({
        value: 'combination',
        label: '组合字段'
      })
      return options
    },
    textDialogData: {
      get() {
        return this.tDialogData
      },
      set(value) {
        this.tDialogData = value
      }
    },
    evenDialogData: {
      get() {
        return this.eDialogData
      },
      set(value) {
        this.eDialogData = value
      }
    }
  },
  beforeDestroy() {
    this.defaultValueTypeOptions = null
    this.showTypeOptions = null
    this.tDialogData = null
    this.eDialogData = null
  },
  methods: {
    /**
     * 设置级联配置
     */
    setCascadeConfiguration(data) {
      if (this.$utils.isEmpty(data)) {return}
      this.fieldItem.field_options.cascade_configuration = JSON.parse(JSON.stringify(data))
    },
    /**
     * 设置默认值
     */
    setDefaultValue(data) {
      const key = this.isLinkButtonClick ? 'link' : 'text_javascript'
      this.fieldItem.field_options[key] = data
      // this.fieldItem.field_options.link = data
    },
    setDefaultTextValue(data) {
      let value = ''
      try {
        value = new Function(data + ';')()
      } catch (e) {
        value = ''
      }
      this.fieldItem.field_options.text = value
      this.fieldItem.field_options.text_javascript = data
    },
    /**
     * 改变默认值
     */
    changeLinkValueType(type) {
      this.fieldOptions.linkType = type
      this.evenDialogData = ''
      this.$set(this.fieldItem.field_options, 'cascade_configuration', null)
      // if (this.fieldOptions.link) { this.fieldOptions.link = null }
    },
    changeTextValueType(type) {
      this.fieldOptions.textType = type
      this.textDialogData = ''
      // if (this.fieldOptions.text) { this.fieldOptions.text = null }
    },
    // 事件脚本类型
    handleDefaultValue() {
      this.isLinkButtonClick = true
      switch (this.fieldOptions.linkType) {
        // case 'fixed':// 固定值
        //   this.fixedVisible = true
        //   break
        case 'dynamic': // Groovy脚本
          this.dynamicScriptVisible = true
          break
        case 'javascript': // javascript脚本
          this.javascriptScriptVisible = true
          break
        case 'cascade': // 级联脚本
          this.cascadeVisible = true
          break
        default:
          break
      }
    },
    // 文本展示类型
    handleTextValue() {
      this.isLinkButtonClick = false
      switch (this.fieldOptions.textType) {
        case 'fixed':// 固定值
          this.fixedVisible = true
          break
        case 'dynamic': // Groovy脚本
          this.dynamicScriptTextVisible = true
          break
        case 'javascript': // javascript脚本
          this.javascriptScriptTextVisible = true
          break
        default:
          break
      }
    }
  }
}
</script>
