<template>
  <div class="form-property">
    <el-form
      ref="formDef"
      :model="formDef"
      :rules="rules"
      label-width="90px"
      @submit.native.prevent
    >
      <div v-if="formDef" class="panel panel-default">
        <div class="panel-heading">{{ formTypeMap[formType]+'属性' }}</div>
        <div class="panel-body">
          <el-form-item label="表单标题" prop="name">
            <el-input
              v-model="formDef.name"
              v-pinyin="{vm:formDef}"
              placeholder="请输入表单标题"
              :maxlength="64"
            />
          </el-form-item>
          <el-form-item label="表单key" prop="key">
            <el-input v-model="formDef.key" placeholder="请输入表单key" :disabled="$utils.isNotEmpty(id)" :maxlength="64" />
          </el-form-item>
          <el-form-item label="表单分类">
            <ibps-type-select
              v-model="formDef.typeId"
              category-key="FORM_TYPE"
              placeholder="请选择表单分类"
              clearable
            />
          </el-form-item>
          <el-form-item label="表单描述">
            <el-input
              v-model="formDef.desc"
              type="textarea"
              placeholder="请输入表单描述"
              :maxlength="512"
            />
          </el-form-item>
        </div>
      </div>
      <div v-if="formType==='form'" class="panel panel-default">
        <div class="panel-heading">
          <span>表单提交校验<help-tip prop="formVerify" /></span>
          <div class="ibps-fr">
            <span class="el-dropdown-link" @click="editFormVerify()">
              <i class="el-icon-circle-plus-outline" />
              添加校验
            </span>
          </div>
        </div>
        <div class="panel-body">
          <el-table
            v-if="formVerifyList && formVerifyList.length >0"
            :data="formVerifyList"
            :show-header="false"
            size="small"
            style=" border: 1px solid #e6e6e6;"
          >
            <el-table-column prop="show" />
            <el-table-column
              width="80"
            >
              <template slot-scope="{ $index}">
                <el-button type="text" icon="ibps-icon-remove" size="small" @click="removeFormVerify($index)" />
                <el-button type="text" icon="ibps-icon-edit" size="small" @click="editFormVerify($index)" />
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="$utils.isEmpty(formVerifyList)"
            class="el-table__empty-block"
          >
            <span class="el-table__empty-text">未设置表单提交校验</span>
          </div>
        </div>
      </div>
      <!--表单规则-->
      <template v-if="formType !== 'combination'">
        <div v-if="formDef && formDef.attrs" class="panel panel-default">
          <div class="panel-heading">
            <span>{{ formTypeMap[formType] }}规则</span><help-tip :title="tipTitle" :content="tipContent" />
            <div class="ibps-fr">
              <span class="el-dropdown-link" @click="openFormRule()">
                <i class="el-icon-circle-plus-outline" />
                添加规则
              </span>
            </div>
          </div>
          <div class="panel-body">
            <!-- 表单规则的数据 -->
            <template v-if="formDef.attrs && $utils.isNotEmpty(formDef.attrs.formRules)">
              <div class="choices">
                <vuedraggable v-model="formDef.attrs.formRules" v-bind="draggableOptions" @start="isDragging = true" @end="()=>{isDragging= false}">
                  <div v-for="(item,i) in formDef.attrs.formRules" :key="item.id" class="option draggable">
                    <div class="actions-left">
                      <!-- <span style="padding-right:10px;">{{ i+1+'、' }}</span> -->
                      <span>{{ item.label }}</span>
                    </div>
                    <el-button-group class="button-actions">
                      <el-tooltip content="设置" placement="top">
                        <el-button size="small" type="text" icon="el-icon-setting" @click="openFormRule(i)" />
                      </el-tooltip>
                      <el-tooltip content="删除" placement="top">
                        <el-button size="small" type="text" icon="el-icon-delete" @click="removeFormRule(i)" />
                      </el-tooltip>
                      <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" class="draggable" />
                    </el-button-group>
                  </div>
                </vuedraggable>
              </div>
            </template>
            <div
              v-else
              class="el-table__empty-block"
            >
              <span class="el-table__empty-text">未设置表单规则</span>
            </div>
          </div>
        </div>
      </template>
      <div class="panel panel-default">
        <div class="panel-heading">表单脚本<help-tip prop="formScript" /></div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" icon="ibps-icon-file-code-o" @click="editFormScript()">表单脚本</el-button>
          <p>&nbsp;</p>
          <el-button style="width:100%;" icon="ibps-icon-file-code-o" @click="editFormScript('mobile')">移动端表单脚本</el-button>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">表单样式<help-tip prop="formStyle" /></div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" icon="ibps-icon-css3" @click="editFormStyle()">表单样式</el-button>
        </div>
      </div>
      <div v-if="formType==='combination' && formDef && formDef.attrs" class="panel panel-default">
        <div class="panel-heading">参数设置</div>
        <div class="panel-body">
          <el-button
            style="width:100%;"
            type="primary"
            plain
            @click="formParamsDialogVisible=true"
          >参数设置{{ $utils.isNotEmpty(formDef.attrs.params)?'(已设置)':'(未设置)' }}</el-button>
        </div>
        <form-params-setting
          :visible="formParamsDialogVisible"
          :data="formDef.attrs.params"
          @callback="settingFormParams"
          @close="visible => formParamsDialogVisible = visible"
        />
      </div>
      <!--操作按钮-->
      <template v-if="formDef && formDef.attrs">
        <funtion-buttons
          v-model="buttons"
          :button-types="buttonTypes"
          :default-button-value="defaultButtonValue"
          :default-button-types="defaultButtonTypes"
          :combination-fields="combinationFields"
          :form-type="formType"
          :form-key="formDef.key"
          type-key="alias"
        >
          <template slot="title">
            操作按钮<ibps-help content="按钮在数据模板查看详情，或者在链接或者按钮级联条件下的才会生效" /></template>
          <template slot="other">
            <el-form-item label="按钮位置">
              <el-radio-group v-model="buttonPosition">
                <template v-for="(item,i) in positions">
                  <el-radio-button
                    :key="item.value"
                    :label="item.value"
                    :class="i==3?'ibps-pt-10':null"
                    :style="i==3?'border-left: 1px solid #DCDFE6;':''"
                  >{{ item.label }}
                  </el-radio-button>
                </template>
              </el-radio-group>
            </el-form-item>
          </template>
        </funtion-buttons>
      </template>
      <div v-if="formDef && formDef.attrs" class="panel panel-default">
        <div class="panel-heading">表单配置</div>
        <div class="panel-body">
          <el-form-item label="标签宽度" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-input-number
                  v-model="formDef.attrs.labelWidth"
                  :min="formDef.attrs.labelWidthUnit==='px'?50:10"
                  :max="formDef.attrs.labelWidthUnit==='px'?500:100"
                  :step="1"
                  style="width: 100%;"
                />
              </el-col>
              <el-col :span="11">
                <el-select v-model="formDef.attrs.labelWidthUnit" style="width: 100%;" @change="changeLabelWidthUnit">
                  <el-option label="像素(px)" value="px" />
                  <el-option label="百分比(%)" value="%" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标签对齐" label-width="100px">
            <el-radio-group v-model="formDef.attrs.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="尺寸" label-width="100px">
            <el-select v-model="formDef.attrs.size" style="width:100%;">
              <el-option label="默认" value="" />
              <el-option label="中" value="medium" />
              <el-option label="小" value="small" />
              <el-option label="迷你" value="mini" />
            </el-select>
          </el-form-item>
          <el-form-item label="验证图标" label-width="100px">
            <el-switch v-model="formDef.attrs.statusIcon" />
          </el-form-item>
          <el-form-item label="自定义Class" label-width="100px">
            <el-input v-model="formDef.attrs.customClass" />
          </el-form-item>
          <el-form-item label-width="100px">
            <template slot="label">
              <ibps-ellipsis :length="8">标签后缀</ibps-ellipsis>
              <help-tip prop="formSuffix" />
            </template>
            <el-switch v-model="formDef.attrs.colon" @change="changeColon" />
            <el-input
              v-if="formDef.attrs.colon"
              v-model="labelSuf"
              placeholder="标签文本的后缀"
            />
          </el-form-item>
          <el-form-item label-width="100px">
            <template slot="label">
              <ibps-ellipsis :length="8">隐藏必填星号</ibps-ellipsis>
              <help-tip prop="formAsterisk" />
            </template>
            <el-switch v-model="formDef.attrs.hideRequiredAsterisk" />
          </el-form-item>
          <el-form-item label-width="100px">
            <template slot="label">
              <ibps-ellipsis :length="8">标签描述位置</ibps-ellipsis>
              <help-tip prop="descPosition" />
            </template>
            <el-radio-group v-model="formDef.attrs.descPosition">
              <el-radio-button label="lableIcon">标签图标</el-radio-button>
              <el-radio-button label="inline">底部一行</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="100px">
            <template slot="label">
              <ibps-ellipsis :length="8">文本只读显示样式</ibps-ellipsis>
              <help-tip prop="formSuffix" />
            </template>
            <el-select v-model="formDef.attrs.read_style" style="width:100%;">
              <el-option label="文本展示" value="text" />
              <el-option label="原样展示" value="original" />
            </el-select>
          </el-form-item>
          <el-form-item label="水印设置" label-width="100px">
            <el-switch v-model="formDef.attrs.watermark" />
            <el-input
              v-if="formDef.attrs.watermark"
              v-model="formDef.attrs.watermarkText"
              placeholder="水印文本"
            />
          </el-form-item>
        </div>
      </div>
      <div v-if="formDef && formDef.attrs" class="panel panel-default">
        <div class="panel-heading">移动端表单配置
          &nbsp;<el-tooltip :content="isSame?'跟PC端配置一致':'跟PC端配置不一致，以下配置为准'" placement="bottom">
            <el-switch v-model="isSame" @change="changeSame" />
          </el-tooltip>
        </div>
        <div v-if="!isSame" class="panel-body">
          <el-form-item label="标签宽度">
            <el-row>
              <el-col :span="12">
                <el-input-number
                  v-model="formDef.attrs.mobileLabelWidth"
                  :min="formDef.attrs.mobileLabelWidthUnit==='px'?50:10"
                  :max="formDef.attrs.mobileLabelWidthUnit==='px'?500:100"
                  :step="1"
                  style="width: 100%;"
                />
              </el-col>
              <el-col :span="11">
                <el-select v-model="formDef.attrs.mobileLabelWidthUnit" style="width: 100%;" @change="changeMobileLabelWidthUnit">
                  <el-option label="像素(px)" value="px" />
                  <el-option label="百分比(%)" value="%" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formDef.attrs.mobileLabelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <!-- <el-radio-button label="top">顶部对齐</el-radio-button> -->
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="输入框对齐方式">
            <el-radio-group v-model="formDef.attrs.mobileInputAlign">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="center">居中对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <!-- <div class="panel panel-default">
        <div class="panel-heading">提交设置<help-tip prop="formSubmit" /></div>
        <div class="panel-body">
          <el-form-item label="开启后端验证" label-width="125px">
            <el-switch v-model="formDef.attrs.validated" />
          </el-form-item>
          <el-form-item label="开启提交冲突提示" label-width="125px">
            <el-switch v-model="formDef.attrs.conflict" />
          </el-form-item>
        </div>
      </div> -->
      <div v-if="formDef && formDef.attrs" class="panel panel-default toolbars-panel">
        <div class="panel-heading">控件边距-全局<help-tip prop="controlPaddingGlobal" />
          &nbsp;<el-switch v-model="formDef.attrs.is_margin" />
        </div>
        <div v-if="formDef.attrs.is_margin" class="panel-body">
          <el-form-item label="上边距">
            <el-input-number
              v-model="formDef.attrs.top_margin"
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
              v-model="formDef.attrs.bottom_margin"
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
              v-model="formDef.attrs.left_margin"
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
              v-model="formDef.attrs.right_margin"
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
      <div v-if="formDef && formDef.attrs" class="panel panel-default">
        <div class="panel-heading">其他设置</div>
        <div class="panel-body">
          <el-form-item label="隐藏表单标题" label-width="125px">
            <el-switch v-model="formDef.attrs.hide_name" />
          </el-form-item>
          <!-- <el-form-item v-if="!formDef.attrs.hide_name" label="表单标题对齐" label-width="125px">
            <el-radio-group v-model="formDef.attrs.title_position">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item v-if="!formDef.attrs.hide_name" label="隐藏表单描述" label-width="125px">
            <el-switch v-model="formDef.attrs.hide_desc" />
          </el-form-item>
          <!-- 设置生成代码后代码的格式-是否带有弹窗 -->
          <el-form-item label-width="125px">
            <template slot="label">生成代码-弹窗<help-tip prop="generateCodeDialog" /></template>
            <el-switch v-model="formDef.attrs.generateCodeDialog" />
          </el-form-item>
          <el-form-item prop="es_sync_online_enable" label-width="125px">
            <template slot="label">ES实时同步</template>
            <el-switch
              v-model="formDef.attrs.es_sync_online_enable"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <formula-edit
      :visible="formulaEditVisible"
      :title="'表单校验'"
      :label="'满足条件公式'"
      :bo-data="boData"
      :data="formVerify"
      verify
      @callback="handlerFormVerify"
      @close="visible => formulaEditVisible = visible"
    />
    <!--表单脚本-->
    <form-script
      :visible="formScriptVisible"
      :title="formScriptTitle"
      :bo-data="boData"
      :data="formScript"
      :fields="fields"
      @callback="handlerFormScript"
      @close="visible => formScriptVisible = visible"
    />
    <!--表单样式-->
    <form-style
      :visible="formStyleVisible"
      title="设置表单样式"
      :data="formStyle"
      @callback="handlerFormStyle"
      @close="visible => formStyleVisible = visible"
    />
    <!-- 表单规则 -->
    <form-rules
      :visible="formRulesVisible"
      :title="ruleTitle"
      :data="ruleData"
      :bind-field="bindField"
      :bo-data="boData"
      @callback="handlerFormRules"
      @close="visible => formRulesVisible = visible"
    />
  </div>
</template>
<script>
import IbpsTypeSelect from '@platform/business/platform/cat/type/select'
import FormulaEdit from '../components/formula-edit'
import FormScript from '../components/form-script'
import FormStyle from '../components/form-style'
import FormRules from '../components/form-rules'
import FormParamsSetting from '../components/params-setting'
import vuedraggable from 'vuedraggable'
import ActionUtils from '@platform/utils/action'
import FieldTypes, { nestedFieldTypes, combinationFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import { formTypeMap } from '@platform/business/platform/form/constants/fieldOptions'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import { getByKey, queryDataTable } from '@platform/api/platform/data/dataTemplate'
import FuntionButtons from '../components/function-buttons'
import BUTTON_TYPES, { formButtonTypes, hasPermission } from '@platform/business/platform/form/constants/formButtonTypes'
/**
 * 表单属性
 */
export default {
  name: 'FormProperty',
  components: {
    vuedraggable,
    IbpsTypeSelect,
    FormulaEdit,
    FormScript,
    FormStyle,
    FormRules,
    FormParamsSetting,
    FuntionButtons
  },
  props: {
    data: {
      type: Object
    },
    id: String,
    boData: {
      type: Array
    },
    formType: {
      type: String,
      default: 'form'
    }
  },
  data() {
    return {
      bindField: {},
      bindFlowField: {},
      bindBpmLink: {},
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        axis: 'y'
      },
      ruleTitle: '新增表单规则',
      ruleData: {},
      editIndex: -1,
      formRulesVisible: false,
      formRulesTitle: '表单规则设置',
      formulaEditVisible: false,
      index: -1,
      formVerify: '',
      formScriptVisible: false,
      deviceType: 'pc',
      formScriptTitle: '表单脚本',
      formStyleVisible: false,
      formParamsDialogVisible: false,
      formDef: {
        name: '',
        key: '',
        typeId: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      },
      same: this.formDef && this.formDef.attrs ? this.formDef.attrs.same : undefined,
      labelSuf: this.formDef && this.formDef.attrs ? this.formDef.attrs.labelSuffix || '' : ':',
      buttons: this.formDef && this.formDef.attrs ? this.formDef.attrs.buttons || [] : [],
      defaultButtonTypes: BUTTON_TYPES,
      defaultButtonValue: {
        alias: '',
        code: '',
        label: '',
        position: '',
        style: '',
        icon: ''
      },
      buttonPosition: 'topLeft',
      positions: [{
        value: 'topLeft',
        label: '左上角'
      }, {
        value: 'lowerLeft',
        label: '左下角'
      }, {
        value: 'topRight',
        label: '右上角'
      }, {
        value: 'lowerRight',
        label: '右下角'
      }, {
        value: 'center',
        label: '底部居中'
      }],
      formTypeMap: formTypeMap
    }
  },
  computed: {
    fields() {
      return this.data ? this.data.fields || [] : []
    },
    combinationFields() {
      const _data = []
      if (this.formType !== 'combination') {return _data}
      this.checkCombinationFields(this.data.fields, _data)
      return _data
    },
    tipTitle() {
      return `关于${this.formTypeMap[this.formType]}规则`
    },
    tipContent() {
      const _desc = this.formTypeMap[this.formType]
      return `${_desc}规则为字段(文本框、单项选择、下拉框等)设置规则：</br>
    1、${_desc}字段数据满足${_desc}规则时，按照规则显示(隐藏)指定的字段，或者改变字段的颜色和背景颜色。</br>
    2、${_desc}只会执行一个${_desc}规则。当满足多个${_desc}规则时，按照${_desc}规则的排序优先级执行，${_desc}规则的序号越小，优先级越高。</br>
    3、改动配置的控件字段时，需重新对${_desc}表单规则进行配置。</br>
    4、当满足多个${_desc}规则时，如果优先级一样，则以${_desc}规则位置前后执行最上的规则。</br>
    5、规则设置为只显示时，设置的${_desc}字段需有显示的权限。隐藏的字段无法进行显示。`
    // 4、当业务规则出现互斥时，数据没法预先知道，只能在实际运算中触发验证。
    },
    formVerifyList() {
      return this.formDef && this.formDef.attrs ? this.formDef.attrs.verifys || [] : []
    },
    formScript() {
      return this.formDef && this.formDef.attrs ? this.deviceType === 'mobile' ? this.formDef.attrs.mobile_script || '' : this.formDef.attrs.script || '' : ''
    },
    formStyle() {
      return this.formDef && this.formDef.attrs ? this.formDef.attrs.form_style || '' : ''
    },
    isSame: {
      get() {
        return this.$utils.toBoolean(this.same, true)
      },
      set(val) {
        this.same = val
        if (this.formDef && this.formDef.attrs) {
          this.$set(this.formDef.attrs, 'same', this.isSame)
        }
      }
    },
    labelSuffix: {
      get() {
        return this.labelSuf
      },
      set(val) {
        this.labelSuf = val
        if (this.formDef && this.formDef.attrs) {
          this.$set(this.formDef.attrs, 'labelSuffix', val)
        }
      }
    },
    buttonTypes() {
      return formButtonTypes.filter((button) => {
        return hasPermission(button.alias, this.formType)
      }).map((button) => {
        if (this.buttons && this.buttons.length > 0) {
          button.disabled = this.allowMultiple(button.alias) ? false : this.buttons.findIndex((btn) => {
            return btn['alias'] === button.alias
          }) > -1
        } else {
          button.disabled = false
        }
        return button
      })
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.formDef = this.data
        if (this.formDef && this.formDef.attrs) {
          if (!this.$utils.isArray(this.formDef.attrs.formRules)) {
            this.$set(this.formDef.attrs, 'formRules', [])
          }
          if (this.$utils.isNotEmpty(this.formDef.attrs.same)) {
            this.same = this.formDef.attrs.same
          }
          if (this.$utils.isNotEmpty(this.formDef.attrs.buttons)) {
            this.buttons = this.formDef.attrs.buttons
          }
          if (this.$utils.isNotEmpty(this.formDef.attrs.buttonPosition)) {
            this.buttonPosition = this.formDef.attrs.buttonPosition || 'topLeft'
          }
        }
      },
      immediate: true,
      deep: true
    },
    formDef: {
      handler: function(val, oldVal) {
        this.$emit('update', val)
      },
      deep: true
    },
    same: {
      handler(val, oldVal) {
        if (this.formDef && this.$utils.isEmpty(this.formDef.attrs.same)) {
          this.isSame = true
          if (this.formDef && this.formDef.attrs) {
            this.$set(this.formDef.attrs, 'same', this.isSame)
          }
        } else {
          if (val !== oldVal) {
            this.isSame = val
            if (this.formDef && this.formDef.attrs) {
              this.$set(this.formDef.attrs, 'same', this.isSame)
            }
          }
        }
      },
      immediate: true
    },
    labelSuf: {
      handler(val, oldVal) {
        if (this.formDef && this.$utils.isEmpty(this.formDef.attrs.labelSuffix)) {
          this.labelSuf = val
          if (this.formDef && this.formDef.attrs) {
            this.$set(this.formDef.attrs, 'labelSuffix', this.labelSuf)
          }
        } else {
          if (val !== oldVal) {
            this.labelSuf = val
            if (this.formDef && this.formDef.attrs) {
              this.$set(this.formDef.attrs, 'labelSuffix', this.labelSuf)
            }
          }
        }
      },
      immediate: true
    },
    buttonPosition: {
      handler(val, oldVal) {
        if (this.formDef && this.formDef.attrs && this.$utils.isEmpty(this.formDef.attrs.buttonPosition)) {
          if (this.formDef && this.formDef.attrs) {
            this.$set(this.formDef.attrs, 'buttonPosition', val || 'topLeft')
          }
        } else {
          if (this.formDef && this.formDef.attrs) {
            this.$set(this.formDef.attrs, 'buttonPosition', val)
          }
        }
      },
      immediate: true
    },
    buttons: {
      handler(val, oldVal) {
        if (this.formDef && this.$utils.isEmpty(this.formDef.attrs.buttons)) {
          this.buttons = val || []
          if (this.formDef && this.formDef.attrs) {
            this.$set(this.formDef.attrs, 'buttons', this.buttons)
          }
        } else {
          if (this.formDef && this.formDef.attrs) {
            this.$set(this.formDef.attrs, 'buttons', this.buttons)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.formDef = null
    this.rules = null
    this.same = null
    this.labelSuf = null
    this.bindField = null
    this.bindFlowField = null
    this.bindBpmLink = null
    this.draggableOptions = null
    this.ruleData = null
  },
  methods: {
    allowMultiple(type) {
      return type === 'custom' || type === 'sefStartFlow' || type === 'customDetail'
    },
    // 表单规则设置返回的数据
    handlerFormRules(data) {
      if (this.editIndex === -1) {
        if (!this.$utils.isArray(this.formDef.attrs.formRules)) {
          this.$set(this.formDef.attrs, 'formRules', [])
        }
        this.formDef.attrs.formRules.push(data)
      } else {
        this.formDef.attrs.formRules.splice(this.editIndex, 1, data)
        this.editIndex = -1
      }
    },
    changeLabelWidthUnit(value) {
      this.formDef.attrs.labelWidth = value === 'px' ? 100 : 20
    },
    changeColon(value) {
      this.formDef.attrs.labelSuffix = value ? ':' : ''
      this.labelSuf = this.formDef.attrs.labelSuffix
    },
    changeSame(value) {
      if (!value) {
        this.formDef.attrs = Object.assign({}, this.formDef.attrs, {
          mobileLabelWidth: 100,
          mobileLabelWidthUnit: 'px',
          mobileLabelPosition: 'left',
          mobileInputAlign: 'right'
        })
      }
    },
    changeMobileLabelWidthUnit(value) {
      this.formDef.attrs.mobileLabelWidth = value === 'px' ? 100 : 20
    },
    // 添加、编辑
    editFormVerify(index = -1) {
      this.index = index
      this.formulaEditVisible = true
      this.formVerify = this.formVerifyList[index]
    },
    // 删除表单校验条件
    removeFormVerify(index) {
      this.formDef.attrs.verifys.splice(index, 1)
    },
    handlerFormVerify(data) {
      if (this.index > -1) {
        this.formDef.attrs.verifys.splice(this.index, 1, data)
      } else {
        this.formDef.attrs.verifys.push(data)
      }
    },
    /**
     * 获取组合表单的业务字段
     */
    checkCombinationFields(fields, data, desc) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldType = field.field_type
        // 判断是否嵌套布局字段
        if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
          const columns = field.field_options.columns
          for (let j = 0; j < columns.length; j++) {
            const column = columns[j]
            this.checkCombinationFields(column.fields, data)
          }
        } else {
          if (this.$utils.isEmpty(field.name)) {continue}
          if (combinationFieldTypes.includes(fieldType) && fieldType !== 'combinationField') {
            const fieldOptions = field.field_options
            const temp = {
              id: field.id,
              field_type: field.field_type,
              label: field.label,
              type_name: FieldTypes[field.field_type].label,
              name: field.name
            }
            if (this.$utils.isEmpty(fieldOptions)) {continue}
            const _desc = `this.getRefsField('${field.name}').getFormData()`
            if (fieldType === 'dataTemplate') {
              if (this.$utils.isEmpty(fieldOptions.bind_template_key)) {continue}
              temp.key = fieldOptions.bind_template_key
            } else {
              if (this.$utils.isEmpty(fieldOptions.formKey)) {continue}
              temp.key = fieldOptions.formKey
            }
            temp.channel = _desc
            data.push(temp)
          } else if (fieldType === 'component') {
            const _desc = `this.getRefsField('${field.name}').$children[0]`
            const temp = {
              id: field.id,
              label: field.label,
              key: field.name,
              field_type: field.field_type,
              type_name: FieldTypes[field.field_type].label,
              name: field.name
            }
            temp.channel = _desc
            data.push(temp)
          }
        }
      }
    },
    /**
     * 获取表单设计的业务字段
     */
    checkNestedFields(fields, code) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldType = field.field_type
        // 判断是否嵌套布局字段
        if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
          const columns = field.field_options.columns
          for (let j = 0; j < columns.length; j++) {
            const column = columns[j]
            const msg = this.checkNestedFields(column.fields, code)
            if (msg) {return msg}
          }
        } else if (fieldType === 'table') { // 子表单
          // 子表字段数据暂不支持
          const msg = this.checkField(field)
          if (msg) {return msg}
        } else {
          const msg = this.checkField(field, code)
          if (msg) {return msg}
        }
      }
      return ''
    },
    /**
     * 检查字段
     */
    checkField(field, code) {
      // 只读字段不需要绑定
      const name = field.name
      const fieldType = field.field_type
      if (fieldType === 'flow_diagram' || fieldType === 'approval_history') {
        if (this.$utils.isNotEmpty(this.bindFlowField[fieldType])) {
          const label = FieldTypes[fieldType].label
          return `一个表单只能存在一个${label},请删除一个`
        }
        this.bindFlowField[fieldType] = field
      } else if (fieldType === 'selector') {
        const options = field.field_options
        if (options.store === 'bind' && this.$utils.isEmpty(options.bindFiled)) {
          return `请选择存储字段`
        }
      } else if (fieldType === 'bpmLink') {
        const key = fieldType + field.field_options.bpmLinkType
        if (this.$utils.isNotEmpty(this.bindBpmLink[key])) {
          const label = FieldTypes[fieldType].label
          return `${label}控件同种关联类型只能存在一个`
        }
        this.bindBpmLink[key] = field
      }
      if (this.$utils.isEmpty(name)) {
        return
      }
      // 检查是否重复绑定
      const key = name
      if (this.$utils.isNotEmpty(this.bindField[key])) {
        const label = this.bindField[key].label
        return `对象属性/字段标识存在重复，请检查[${label}]和[${field.label}]控件`
      }
      // 不能为空的判断，选项重复
      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        if (field.field_options.datasource === 'custom') {
          const options = field.field_options.options
          if (options.length === 0) {
            return `${field.label}控件中，请至少添加一个选项`
          }
          // 重复选项
          const optionKey = {}
          for (let i = 0; i < options.length; i++) {
            const option = options[i]
            const optionVal = option.val
            if (this.$utils.isEmpty(optionVal)) {
              return `${field.label}控件中，有选项值为空`
            }
            // 汉字、数字、字母、下划线
            // if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(optionVal)) {
            //   return `选项中的选项值[${optionVal}]含有非法字符`
            // }
            if (optionKey[optionVal]) {
              return `${field.label}控件中，存在重复的选项值[${optionVal}]`
            }
            optionKey[optionVal] = true
          }
        }
      }
      // 判断是否隐藏，添加非隐藏的字段
      if (fieldType === 'hidden') {return}
      if (this.$utils.isNotEmpty(field.field_options) && field.field_options.hide_rights) {return}
      this.bindField[key] = JSON.parse(JSON.stringify(field))
    },
    checkFields(callback) {
      // 获取表单设计的业务字段
      const fields = this.data.fields
      this.bindField = {}
      this.bindFlowField = {}
      this.bindBpmLink = {}
      const code = this.data.code
      const msg = this.checkNestedFields(fields, code)
      return msg
    },
    validateForm() {
      if (this.data.mode === 'bo' &&
          this.$utils.isEmpty(this.data.code)) {
        return '未绑定业务对象，请检查数据是否正确'
      }
      if (this.data.fields.length <= 0) {
        return '请从左侧拖拽字段'
      }
      return this.checkFields()
    },
    valueKey(fieldOptions) {
      return FormUtils.getLinkValueKey(fieldOptions)
    },
    labelKey(fieldOptions) {
      return FormUtils.getLinkLabelKey(fieldOptions)
    },
    getValuesourceParams(template, dataTemplate, fieldOptions) {
      const formParams = {}
      const responseData = JSON.parse(JSON.stringify(template))
      responseData.datasetKey = dataTemplate.datasetKey
      responseData.unique = this.valueKey(fieldOptions)
      responseData['key'] = fieldOptions['value_source']
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = ''
      return ActionUtils.formatParams(formParams)
    },
    async loadAjaxOptions(dataTemplate, fieldOptions, key) {
      if (this.$utils.isEmpty(dataTemplate)) {
        return
      }
      const template = dataTemplate.templates[0]
      await queryDataTable(this.getValuesourceParams(template, dataTemplate, fieldOptions)).then(resp => {
        const data = resp.data || {}
        const dataResult = data.dataResult || []
        const options = []
        dataResult.forEach(item => {
          const keyValue = item[this.valueKey(fieldOptions)]
          options.push({
            val: keyValue,
            label: item[this.labelKey(fieldOptions)]
          })
        })
        this.$set(this.bindField[key].field_options, 'options', options)
      }).catch(() => {
      })
    },
    /**
     * 打开表单规则新增/编辑页
     */
    async openFormRule(index) {
      const msg = this.validateForm()
      if (this.$utils.isNotEmpty(msg)) {
        ActionUtils.warning(msg)
        return
      }
      for (const key in this.bindField) {
        if (this.bindField.hasOwnProperty(key) === true) {
          const fieldType = this.bindField[key].field_type
          const fieldOptions = this.bindField[key].field_options || {}
          if ((fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') &&
              fieldOptions['datasource'] === 'valuesource') {
            this.$set(this.bindField[key].field_options, 'options', null)
            let dataTemplate = {}
            await getByKey({
              dataTemplateKey: fieldOptions['value_source']
            }).then(response => {
              dataTemplate = this.$utils.parseData(response.data)
            }).catch(() => {
            })
            if (this.$utils.isNotEmpty(dataTemplate)) {
              await this.loadAjaxOptions(dataTemplate, fieldOptions, key)
            }
          }
        }
      }
      if (this.$utils.isNotEmpty(index)) {
        this.ruleTitle = '修改表单规则'
        this.ruleData = JSON.parse(JSON.stringify(this.formDef.attrs.formRules[index]))
        this.editIndex = index
      } else {
        this.ruleTitle = '新增表单规则'
        this.ruleData = {}
        this.editIndex = -1
      }
      this.formRulesVisible = true
    },
    /**
     * 删除表单规则
     */
    removeFormRule(index) {
      this.formDef.attrs.formRules.splice(index, 1)
    },
    /**
     * 表单脚本
     */
    editFormScript(deviceType = 'pc') {
      this.deviceType = deviceType
      this.formScriptTitle = deviceType === 'mobile' ? '移动端表单脚本' : '表单脚本'
      this.formScriptVisible = true
    },
    handlerFormScript(value) {
      if (this.deviceType === 'mobile') {
        this.$set(this.formDef.attrs, 'mobile_script', value)
      } else {
        this.$set(this.formDef.attrs, 'script', value)
      }
    },
    editFormStyle() {
      this.formStyleVisible = true
    },
    handlerFormStyle(value) {
      this.$set(this.formDef.attrs, 'form_style', value)
    },
    handleInput(key, val) {
      this.$set(this.formDef, key, val)
      this.$emit('update', JSON.parse(JSON.stringify(this.formDef)))
    },
    settingFormParams(data) {
      this.$set(this.formDef.attrs, 'params', data)
    }
  }
}
</script>
<style lang="scss">
.form-property {
  .choices {
    .option {
      position: relative;
      margin-bottom: 5px;
      border: 1px solid transparent;
      background-color: #f5f7fa;
      padding: 5px 0 5px 20px;
      .actions-left{
        height: 24px;
        line-height: 24px;
      }
      .el-input {
        display: inline-block;
        width: 35%;
        vertical-align: middle;
      }
      .el-checkbox{
          margin-right: 10px;
      }
      .button-actions {
        position: absolute;
        width: 60px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 5px;
        background: #e7f1f1;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
            cursor: move
        }
      }
    }
  }
  .more-actions {
    text-align: right;
    margin-top: 10px;
    margin-right:10px;
    .el-button {
      border-right: 1px solid #D9D9D9;
      padding-right: 4px;
      margin-right: 2px;
    }
  }
  .other-choice-input {
    width: 100px  !important;
    margin-top: -3px;
    margin-left: 4px;
    background: rgba(255,255,255,0.65);
    height: 2em;
  }
}
</style>
