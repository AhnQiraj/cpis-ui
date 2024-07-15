<template>
  <div>
    <div class="panel panel-default toolbars-panel">
      <div class="panel-heading">控件边距<help-tip prop="controlPadding" />
        &nbsp;<el-switch v-model="fieldOptions.is_margin" />
      </div>
      <div v-if="fieldOptions.is_margin" class="panel-body">
        <el-form-item label="上边距">
          <el-input-number
            v-model="fieldOptions.top_margin"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag>
        </el-form-item>
        <el-form-item label="下边距">
          <el-input-number
            v-model="fieldOptions.bottom_margin"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag>
        </el-form-item>
        <el-form-item label="左边距">
          <el-input-number
            v-model="fieldOptions.left_margin"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag>
        </el-form-item>
        <el-form-item label="右边距">
          <el-input-number
            v-model="fieldOptions.right_margin"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag>
        </el-form-item>
      </div>
    </div>
    <div v-if="$utils.isEmpty(types) || !types.includes('hiddenLayout')" class="panel panel-default toolbars-panel">
      <div class="panel-heading">布局设置</div>
      <div class="panel-body">
        <el-form-item v-if="types.includes('overspread') ">
          <template slot="label">铺满整行<help-tip prop="overspread" /></template>
          <el-switch v-model="fieldOptions.overspread" />
        </el-form-item>
        <el-form-item v-if="types.includes('mode') ">
          <template slot="label">编辑模式<help-tip prop="tableMode" /></template>
          <el-select v-model="fieldOptions.mode" :disabled="relation ==='one2one'" @change="changeMode">
            <el-option
              v-for="(mode,index) in tabeModeOptions"
              :key="index"
              :value="mode.value"
              :label="mode.label"
            />
          </el-select>
        </el-form-item>
        <template v-if="types.includes('hideLabel')">
          <el-form-item v-if="fieldType!=='table'">
            <template slot="label">隐藏标签<help-tip prop="hideLabel" /></template>
            <el-switch v-model="fieldOptions.hide_label" />
          </el-form-item>
        </template>
        <template v-if="types.includes('labelWidth')">
          <el-form-item v-if="!fieldOptions.hide_label">
            <template slot="label">标签宽度<help-tip prop="labelWidth" /></template>
            <el-row>
              <el-col :span="2">
                <el-checkbox v-model="fieldOptions.is_label_width" @change="changeIsLabelWidth" />
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="fieldOptions.label_width"
                  :disabled="!fieldOptions.is_label_width"
                  style="width: 100%;"
                  :min="0"
                  :max="fieldOptions.label_width_unit==='px'?500:100"
                  :step="1"
                />
              </el-col>
              <el-col :span="10">
                <el-select
                  v-model="fieldOptions.label_width_unit"
                  :disabled="!fieldOptions.is_label_width"
                  style="width: 100%;"
                  @change="changeLabelWidthUnit"
                >
                  <el-option label="像素(px)" value="px" />
                  <el-option label="百分比(%)" value="%" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item v-if="types.includes('width')">
          <template slot="label">控件宽度<help-tip prop="width" /></template>
          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="fieldOptions.is_width" @change="changeIsWidth" />
            </el-col>
            <el-col :span="12">
              <el-input-number
                v-model="fieldOptions.width"
                :disabled="!fieldOptions.is_width"
                style="width: 100%;"
                :min="0"
                :max="fieldOptions.width_unit==='px'?500:100"
                :step="1"
              />
            </el-col>
            <el-col :span="10">
              <el-select
                v-if="init"
                v-model="fieldOptions.width_unit"
                :disabled="!fieldOptions.is_width"
                style="width: 100%;"
                @change="changeWidthUnit"
              >
                <el-option label="像素(px)" value="px" />
                <el-option label="百分比(%)" value="%" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="types.includes('clearable') && formType==='form'">
          <template slot="label">可清空<help-tip prop="clearable" /></template>
          <el-switch v-model=" clearable" />
        </el-form-item>
        <el-form-item v-if="types.includes('rows')">
          <template slot="label">行数<help-tip prop="rows" /></template>
          <el-input v-model="fieldOptions.rows" />
        </el-form-item>
        <el-form-item v-if="types.includes('autosize')">
          <template slot="label">
            自适应高度
            <help-tip prop="autosize" /></template>
          <el-switch v-model="fieldOptions.autosize" />
          <div v-if="fieldOptions.autosize">
            <el-input-number
              v-model="fieldOptions.min_rows"
              :min="1"
              placeholder="最小行数"
              controls-position="right"
              style="width:90px;"
            />
            -
            <el-input-number
              v-model="fieldOptions.max_rows"
              :min="fieldOptions.min_rows||1"
              placeholder="最大行数"
              controls-position="right"
              style="width:90px;"
            />
          </div>
        </el-form-item>
        <template v-if="types.includes('index') && relation !=='one2one'">
          <el-form-item>
            <template slot="label">显示序号<help-tip prop="index" /></template>
            <el-row>
              <el-col :span="5">
                <el-switch v-model="fieldOptions.index" @change="changeIndex" />
              </el-col>
              <template v-if="fieldOptions.index">
                <el-col :span="6">
                  <el-input v-model="indexName" placeholder="序号名" />
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="fieldOptions.index_width" placeholder="宽度" />
                </el-col>
              </template>
            </el-row>
          </el-form-item>
        </template>
        <template v-if="types.includes('displayField') && relation !=='one2one' && fieldOptions.mode !== 'block'">
          <el-form-item>
            <template slot="label">自定义列<help-tip prop="displayField" /></template>
            <el-row>
              <el-col :span="5">
                <el-switch v-model="fieldOptions.display_column" @change="changeDisplayColumn" />
              </el-col>
              <template v-if="fieldOptions.display_column">
                <el-col :span="12">
                  <el-input v-model="displayColumnName" placeholder="自定义列名" />
                </el-col>
              </template>
            </el-row>
          </el-form-item>
        </template>
        <template v-if="types.includes('pageable') && fieldOptions.mode !== 'block'">
          <el-form-item>
            <template slot="label">是否分页<help-tip prop="pageable" /></template>
            <el-switch v-model="fieldOptions.pageable" />
          </el-form-item>
        </template>
        <template v-if="types.includes('manage') && fieldOptions.mode !== 'block'">
          <el-form-item>
            <template slot="label">管理列名<help-tip prop="manageName" /></template>
            <el-input v-model="manageName" placeholder="管理列名" />
          </el-form-item>
        </template>
        <el-form-item v-if="types.includes('summary') && relation !=='one2one'">
          <template slot="label">
            表尾合计行
            <help-tip prop="summary" />
          </template>
          <el-row>
            <el-col :span="5">
              <el-switch v-model="fieldOptions.summary" @change="changeSummary" />
            </el-col>
            <el-col :span="14">
              <el-input
                v-model="sumText"
                placeholder="合计描述"
                :disabled="!fieldOptions.summary"
                style="width:90%;"
              />
            </el-col>
            <el-col v-if="fieldOptions.summary" :span="5">
              <el-tooltip content="表尾合计行采用自定义方法,需要表单脚本写自定义的方法">
                <el-checkbox v-model="summaryMethod" />
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="types.includes('height')">
          <template slot="label">高度<help-tip prop="height" /></template>
          <el-input v-model="fieldOptions.height">
            <template slot="append">像素(px)</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="types.includes('optionStyle')">
          <template slot="label">选项样式<help-tip prop="optionStyle" /></template>
          <el-radio-group v-model="fieldOptions.option_style">
            <el-radio-button label="default">默认</el-radio-button>
            <el-radio-button label="button">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="types.includes('arrangement')">
          <template slot="label">布局方式<help-tip prop="arrangement" /></template>
          <el-radio-group v-model="fieldOptions.arrangement">
            <el-radio-button label="horizontal">横向</el-radio-button>
            <el-radio-button label="vertical">纵向</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="types.includes('customClass')">
          <template slot="label">
            <ibps-ellipsis :length="9">自定义Class</ibps-ellipsis><help-tip prop="customClass" /></template>
          <el-input v-model="fieldOptions.custom_class" />
        </el-form-item>
        <el-form-item v-if="types.includes('mobile')">
          <template slot="label">
            移动端显示
            <help-tip prop="mobile" />
          </template>
          <el-switch v-model="isMobile" />
        </el-form-item>
      </div>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    return {
      tabeModeOptions: [{
        value: 'inner',
        label: '表内编辑模式'
      }, {
        value: 'block',
        label: '块模式'
      }, {
        value: 'dialog',
        label: '弹窗模式'
      }],
      mobile: this.fieldItem.field_options.mobile,
      clearable: this.fieldItem.field_options.clearable,
      init: true
    }
  },
  computed: {
    sumText: {
      get() {
        return this.fieldItem.field_options.sum_text
      },
      set(val) {
        const fieldOptions = JSON.parse(JSON.stringify(this.fieldItem.field_options))
        fieldOptions.sum_text = val
        this.fieldItem.field_options = fieldOptions
      }
    },
    summaryMethod: {
      get() {
        return this.fieldItem.field_options.summary_method
      },
      set(val) {
        const fieldOptions = JSON.parse(JSON.stringify(this.fieldItem.field_options))
        fieldOptions.summary_method = val
        this.fieldItem.field_options = fieldOptions
      }
    },
    isMobile: {
      get() {
        return this.$utils.toBoolean(this.mobile, true)
      },
      set(val) {
        this.fieldItem.field_options.mobile = this.mobile = val
      }
    },
    isClearable: {
      get() {
        return this.$utils.toBoolean(this.clearable, true)
      },
      set(val) {
        this.fieldItem.field_options.clearable = this.clearable = val
      }
    },
    relation() {
      return this.fieldItem.field_options.relation || 'one2more'
    },
    indexName: {
      get() {
        return this.fieldItem.field_options.index_name
      },
      set(val) {
        const fieldOptions = JSON.parse(JSON.stringify(this.fieldItem.field_options))
        fieldOptions.index_name = val
        this.fieldItem.field_options = fieldOptions
      }
    },
    displayColumnName: {
      get() {
        return this.fieldItem.field_options.display_column_name
      },
      set(val) {
        const fieldOptions = JSON.parse(JSON.stringify(this.fieldItem.field_options))
        fieldOptions.display_column_name = val
        this.fieldItem.field_options = fieldOptions
      }
    },
    manageName: {
      get() {
        return this.fieldItem.field_options.manage_name
      },
      set(val) {
        const fieldOptions = JSON.parse(JSON.stringify(this.fieldItem.field_options))
        fieldOptions.manage_name = val
        this.fieldItem.field_options = fieldOptions
      }
    }
  },
  watch: {
    mobile: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.fieldItem.field_options.mobile)) {
          this.isMobile = this.fieldItem.field_options.mobile = true
        } else {
          if (val !== oldVal) {
            this.isMobile = this.fieldItem.field_options.mobile = val
          }
        }
      },
      immediate: true
    },
    clearable: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.fieldItem.field_options.clearable)) {
          this.isClearable = this.fieldItem.field_options.clearable = true
        } else {
          if (val !== oldVal) {
            this.isClearable = this.fieldItem.field_options.clearable = val
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.tabeModeOptions = null
    this.mobile = null
  },
  methods: {
    changeIsLabelWidth(val) {
      if (val) {
        this.fieldItem.field_options.label_width = 100
        this.fieldItem.field_options.label_width_unit = 'px'
      } else {
        this.fieldItem.field_options.label_width = null
        this.fieldItem.field_options.label_width_unit = null
      }
    },
    changeLabelWidthUnit(value) {
      this.fieldItem.field_options.label_width = value === 'px' ? 100 : 20
    },
    changeIsWidth(val) {
      this.fieldItem.field_options.width = '100'
      this.fieldItem.field_options.width_unit = '%'
    },
    changeWidthUnit(value) {
      this.init = false
      this.fieldItem.field_options.width = value === 'px' ? 100 : 100
      setTimeout(() => {
        this.init = true
      }, 10)
    },
    changeSummary() {
      this.fieldItem.field_options.sum_text = ''
      this.fieldItem.field_options.summary_method = false
    },
    changeMode() {
      // 变换字段
      if (this.fieldItem.field_options.mode === 'block') {
        this.fieldItem.field_options.index = true
      }
    },
    changeIndex() {
      this.fieldItem.field_options.index_name = '序号'
      this.fieldItem.field_options.index_width = 50
    },
    changeDisplayColumn() {
      this.fieldItem.field_options.display_column_name = '自定义列'
    }
  }
}
</script>
