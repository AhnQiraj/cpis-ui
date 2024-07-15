<template>
  <div class="panel panel-default">
    <div class="panel-heading">选项配置</div>
    <div class="panel-body">
      <el-form-item v-if="fieldType==='select' || fieldType==='cascader'">
        <template slot="label">是否多选<help-tip prop="multiple" /></template>
        <el-switch
          v-model="fieldOptions.multiple"
          @change="setSelectDefaultValue"
        />
      </el-form-item>
      <template v-if="fieldType==='cascader'">
        <el-form-item>
          <template slot="label">触发菜单方式</template>
          <el-select v-model="fieldOptions.expand_trigger" style="width:100%;">
            <el-option value="click" label="点击" />
            <el-option value="hover" label="悬停" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">选值模式<help-tip prop="selectMode" /></template>
          <el-select v-model="fieldOptions.select_mode" style="width:100%;">
            <el-option value="leaf" label="叶节点" />
            <el-option value="any" label="任意节点" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">显示模式<help-tip prop="displayMode" /></template>
          <el-select v-model="fieldOptions.display_mode" style="width:100%;">
            <el-option value="path" label="完整路径" />
            <el-option value="name" label="节点名称" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fieldOptions.display_mode==='path'">
          <template slot="label">分割符<help-tip prop="split" /></template>
          <el-input v-model="fieldOptions.split" />
        </el-form-item>
      </template>
      <el-radio-group
        v-model="fieldOptions.datasource"
        size="mini"
        class="ibps-mb-10"
        @change="changeDatasourceType"
      >
        <el-radio-button
          v-for="item in datasourceOptions"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-radio-button>
      </el-radio-group>
      <help-tip prop="datasource" />
      <!---=================自定义=============---->
      <div v-if="datasource === 'custom' || !datasource ">
        <el-popover
          v-if="fieldType==='cascader'"
          placement="left"
          width="400"
          trigger="click"
        >
          <el-input
            v-model="cascaderOptions"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 20}"
            placeholder="请输入内容"
          />
          <el-button slot="reference" type="primary" plain style="width:100%;">编辑选项</el-button>
        </el-popover>
        <template v-else>
          <vuedraggable
            v-model="itemOptions"
            v-bind="draggableOptions"
            class="list-group"
            @start="isDragging = true"
            @end="()=>{isDragging= false}"
          >
            <div v-for="(opt,i) in itemOptions" :key="i" class="list-group-item">
              <div class="actions-left">
                <el-tooltip content="设为默认值">
                  <el-checkbox v-if="(fieldType==='checkbox' || (fieldType==='select' && fieldOptions.multiple))" v-model="opt.checked" />
                  <el-radio v-else v-model="defaultValue" :label="i" @click.native.prevent="handleDefaultValue(i)"><span>&nbsp;&nbsp;</span></el-radio>
                </el-tooltip>
                <el-input v-model="opt.val" size="mini" placeholder="选项值" />
                <el-input v-model="opt.label" size="mini" placeholder="选项标签" />
              </div>
              <el-button-group class="actions">
                <el-button size="small" type="text" title="添加" icon="ibps-icon-add" @click="addOption(i)" />
                <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeOption(i)" />
                <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </div>
          </vuedraggable>
          <div class="more-actions">
            <el-button type="text" @click="addOption">添加选项</el-button>
            <el-divider direction="vertical" />
            <!-- <el-button type="text" :disabled="hasOtherOption" @click="addOtherOption">添加其它</el-button>
          <el-divider direction="vertical" /> -->
            <el-button type="text" @click="editOption">编辑选项</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" @click="optionTemplate">选项模版</el-button>
          </div>
          <el-form-item v-if="hasOtherOption">
            <template slot="label"><ibps-ellipsis :length="8">其它选项字段</ibps-ellipsis></template>
            <ibps-bo-select
              v-model="fieldOptions.option_other_id"
              :data="boFields"
              placeholder="请绑定对象属性"
              empty-text="暂无数据"
            />
          </el-form-item>
          <option-template
            :visible="optionTemplateVisible"
            :title="title"
            :options="choices"
            :is-template="isTemplate"
            @close="visible => optionTemplateVisible = visible"
            @callback="handleOptions"
          />
        </template>
      </div>
      <!---=================值来源=============---->
      <template v-else-if="datasource === 'valuesource'">
        <el-form-item>
          <template slot="label">值来源<help-tip prop="valueSource" /></template>
          <ibps-data-template-selector2
            v-model="fieldOptions.value_source"
            placeholder="请选择值来源"
            style="width:100%;"
            @change="changeDataTemplateSelector"
          />
        </el-form-item>
        <el-form-item>
          <div slot="label">关联配置<help-tip prop="linkConfig" /></div>
          <div class="el-form-item__content">
            <el-button :disabled="disabledResultColumns" style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateConfig('value_source')">设置关联配置</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="$utils.isNotEmpty(dynamicConditions)">
          <div slot="label">动态参数<help-tip prop="dynamicCondition" /></div>
          <div class="el-form-item__content">
            <el-button :disabled="disabledDynamicConditions" style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateCondition('value_source')">设置动态参数</el-button>
          </div>
        </el-form-item>
        <template v-if="(fieldType === 'radio' || (fieldType === 'select' && !fieldOptions.multiple) )&& $utils.isNotEmpty(resultColumns)">
          <el-form-item>
            <div slot="label">联动数据<help-tip prop="linkData" /></div>
            <div class="el-form-item__content">
              <el-button :disabled="disabledResultColumns" style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateLinkData('value_source')">设置联动数据</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div slot="label">关联属性<help-tip prop="linkAttr" /></div>
            <div class="el-form-item__content">
              <el-button :disabled="disabledResultColumns" style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateLinkAttr('value_source')">设置关联属性</el-button>
            </div>
          </el-form-item>
        </template>
        <!--数据模版-参数配置-->
        <data-template-config
          :visible="dataTemplateConfigVisible"
          :columns="resultColumns"
          :data="fieldItem.field_options.link_config"
          :show-structure="fieldType==='cascader'"
          show-root
          @callback="setDataTemplateConfig"
          @close="visible => dataTemplateConfigVisible = visible"
        />
        <!--数据模版-动态参数配置-->
        <data-template-condition
          :visible="dataTemplateConditionVisible"
          :conditions="dynamicConditions"
          :data="fieldItem.field_options.link_condition"
          :fields="formSubFields"
          @callback="setDataTemplateCondition"
          @close="visible => dataTemplateConditionVisible = visible"
        />
        <!--数据模版-联动数据配置-->
        <data-template-linkdata
          :visible="dataTemplateLinkDataVisible"
          :columns="resultColumns"
          :data="fieldItem.field_options.link_linkage"
          :fields="formFields"
          @callback="setDataTemplateLinkData"
          @close="visible => dataTemplateLinkDataVisible = visible"
        />
        <!--数据模版-联动属性配置-->
        <data-template-linkdata
          :visible="dataTemplateLinkAttrVisible"
          :columns="resultColumns"
          :data="fieldItem.field_options.link_attr"
          :fields="formLabelFields"
          @callback="setDataTemplateLinkAttr"
          @close="visible => dataTemplateLinkAttrVisible = visible"
        />
      </template>
      <!---=================数据字典=============---->
      <template v-else-if="datasource === 'dictionary'">
        <el-form-item>
          <template slot="label">数据字典<help-tip prop="dictionary" /></template>
          <ibps-type-select
            v-model="fieldOptions.dictionary"
            category-key="DIC_TYPE"
            node-key="typeKey"
            placeholder="请选择数据字典"
            clearable
            @change="changeDictionary"
          />
        </el-form-item>
      </template>
      <!---=================动态数据=============---->
      <template v-else-if="datasource === 'dynamic'">
        <el-form-item label-width="0">
          <el-radio-group v-model="fieldOptions.remoteType">
            <el-radio label="variable">赋值变量</el-radio>
            <el-radio label="func">动态方法</el-radio>
          </el-radio-group>
          <el-input v-model="fieldOptions.remoteValue" :placeholder="fieldOptions.remoteType?'赋值变量key':'动态方法名'" />
        </el-form-item>
        <el-form-item label-width="0">
          <el-input v-model="fieldOptions.remoteValueKey" placeholder="请输入值">
            <div slot="prepend" style="width:30px;">值</div>
          </el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input v-model="fieldOptions.remoteLabelKey" placeholder="请输入标签">
            <div slot="prepend" style="width:30px;">标签</div>
          </el-input>
        </el-form-item>
      </template>
    </div>
  </div>
</template>
<script>
import { defaultOptions, defaultCascaderOptions } from '@platform/business/platform/form/constants/fieldOptions'
import vuedraggable from 'vuedraggable'
import OptionTemplate from '../components/option-template'
import EditorMixin from '../mixins/editor'
import DataTemplateMixin from '../mixins/data-template'
import IbpsDataTemplateSelector2 from '@platform/business/platform/data/dataTemplate/selector2'
import DataTemplateConfig from '../components/data-template-config'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'
import IbpsBoSelect from '@platform/business/platform/bo/def/select'
import IbpsTypeSelect from '@platform/business/platform/cat/type/select'
export default {
  components: {
    vuedraggable,
    IbpsBoSelect,
    IbpsTypeSelect,
    OptionTemplate,
    IbpsDataTemplateSelector2,
    DataTemplateConfig,
    DataTemplateCondition,
    DataTemplateLinkdata
  },
  mixins: [EditorMixin, DataTemplateMixin],
  data() {
    return {
      title: '选项模版',
      choices: [],
      isTemplate: false,
      optionTemplateVisible: false,
      isDragging: false,
      datasourceOptions: [{
        value: 'custom',
        label: '静态数据'
      }, {
        value: 'valuesource',
        label: '值来源'
      }
      // {
      //   value: 'dictionary',
      //   label: '数据字典'
      // },
      // {
      //   value: 'dynamic',
      //   label: '动态数据'
      // }
      ],
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      loading: false
    }
  },
  computed: {
    itemOptions: {
      get() {
        return this.fieldOptions.options || []
      },
      set(val) {
        this.fieldOptions.options = val
      }
    },
    cascaderOptions: {
      get() {
        return JSON.stringify(this.fieldOptions.options || [])
      },
      set(val) {
        this.fieldOptions.options = JSON.parse(val)
      }
    },
    datasource() {
      return this.fieldOptions.datasource || 'custom'
    },
    defaultValue: {
      get() {
        const defaultOption = this.fieldOptions.options.findIndex((option) => option.checked === true)
        return defaultOption !== -1 ? defaultOption : void 0
      },
      set(value) {
        this.fieldOptions.options.forEach((option, i) => {
          option.checked = i === value
        })
        this.handleOptions(JSON.parse(JSON.stringify(this.fieldOptions.options)))
      }
    },
    hasOtherOption() {
      for (let i = 0; i < this.itemOptions.length; i++) {
        const option = this.itemOptions[i]
        if (option.include_other_option) {return true}
      }
      return false
    }
  },
  beforeDestroy() {
    this.choices = null
    this.datasourceOptions = null
    this.draggableOptions = null
    this.dataSourceOptions = null
  },
  methods: {
    addOption(i = -1, type) {
      const newOption = {
        val: '',
        label: '选项',
        disabled: false
      }
      if (i > -1) {
        this.itemOptions.splice(i + 1, 0, newOption)
      } else {
        this.itemOptions.push(newOption)
      }
    },
    removeOption(i) {
      this.itemOptions.splice(i, 1)
    },
    editOption() {
      this.title = '编辑选项'
      this.choices = JSON.parse(JSON.stringify(this.itemOptions))
      this.isTemplate = false
      this.optionTemplateVisible = true
    },
    addOtherOption() {
      const newOption = {
        val: '',
        label: '其它',
        disabled: false,
        include_other_option: true
      }
      this.itemOptions.push(newOption)
    },
    optionTemplate(i) {
      this.title = '选项模版'
      this.choices = []
      this.isTemplate = true
      this.optionTemplateVisible = true
    },
    handleOptions(data) {
      this.itemOptions = data
    },
    setSelectDefaultValue() {
      this.itemOptions.forEach((option) => {
        option.checked = false
      })
      this.setDefaultValue()
    },
    handleDefaultValue(value) {
      const defaultOption = this.itemOptions.findIndex((option) => option.checked === true)
      this.defaultValue = defaultOption !== value ? value : void 0
    },
    changeDatasourceType(value) {
      this.fieldItem.field_options.value_source = null
      // this.setDataTemplateDefaultValue()
      if (value === 'custom') {
        this.handleOptions(JSON.parse(JSON.stringify(this.fieldType === 'cascader' ? defaultCascaderOptions : defaultOptions)))
      } else {
        this.handleOptions([])
      }
    },
    changeDataTemplateSelector(data, val, oldVal) {
      if (data && val !== oldVal) {
        this.setDefaultValue()
        this.setDataTemplateDefaultValue()
      }
      this.changeDataSource(val, 'value_source')
    }
  }
}
</script>
<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin-bottom: -1px;
    .actions-left{
      height: 24px;
      line-height: 24px;
      .el-input {
        display: inline-block;
        width: 34%;
        vertical-align: middle;
        padding-right: 10px;
      }
      .el-checkbox{
        margin-right: 10px;
      }
      .el-radio{
        margin-right: 0px;
      }
    }
    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: right;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }
</style>
