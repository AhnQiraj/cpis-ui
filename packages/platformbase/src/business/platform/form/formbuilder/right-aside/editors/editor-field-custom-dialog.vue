<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item label-width="110px">
        <template slot="label">对话框类型<help-tip prop="customDialogType" /></template>
        <el-select v-model="fieldOptions.dialog_type" style="width:100%;">
          <el-option value="dialog" label="自定义对话框" />
          <!-- <el-option value="url" label="URL对话框" /> -->
        </el-select>
      </el-form-item>
      <template v-if="fieldOptions.dialog_type==='dialog'">
        <el-form-item label-width="110px">
          <template slot="label">自定义对话框<help-tip prop="customDialog" /></template>
          <ibps-data-template-selector2
            v-model="fieldOptions.dialog"
            type="dialog"
            placeholder="请选择自定义对话框"
            @change="changeDataTemplateSelector"
          />
        </el-form-item>
        <el-form-item v-if="$utils.isNotEmpty(dynamicConditions)">
          <div slot="label">动态参数<help-tip prop="dynamicCondition" /></div>
          <div class="el-form-item__content">
            <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateCondition('dialog')">设置动态参数</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="fieldOptions.multiple === 'N' ">
          <div slot="label">联动数据<help-tip prop="linkData" /></div>
          <div class="el-form-item__content">
            <el-button style="width:100%;" :disabled="disabledResultColumns" type="primary" size="mini" plain @click="settingDataTemplateLinkData('dialog')">设置联动数据</el-button>
          </div>
        </el-form-item>
      </template>
      <template v-else-if="fieldOptions.dialog_type==='url'">
        <el-form-item>
          <template slot="label">URL地址<help-tip prop="customDialogUrl" /></template>
          <el-input v-model="fieldOptions.dialog" :placeholder="URL地址" />
        </el-form-item>
      </template>
      <el-form-item>
        <template slot="label">是否多选<help-tip prop="multiple" /></template>
        <el-switch
          v-model="fieldOptions.multiple"
          active-value="Y"
          inactive-value="N"
          @change="setDefaultValue"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">图标<help-tip prop="icon" /></template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <template slot="label">存储格式<help-tip prop="customDialogStore" /></template>
        <el-select v-model="fieldOptions.store" style="width:100%;">
          <el-option
            v-for="item in dialogStoreOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </div>
    <!--数据模版-动态参数配置-->
    <data-template-condition
      :visible="dataTemplateConditionVisible"
      :conditions="dynamicConditions"
      :data="linkCondition"
      :fields="formSubFields"
      @callback="setDataTemplateCondition"
      @close="visible => dataTemplateConditionVisible = visible"
    />
    <!--数据模版-联动数据配置-->
    <data-template-linkdata
      :visible="dataTemplateLinkDataVisible"
      :columns="resultColumns"
      :data="linkLinkage"
      :fields="formFields"
      @callback="setDataTemplateLinkData"
      @close="visible => dataTemplateLinkDataVisible = visible"
    />
  </div>
</template>
<script>
import { dialogStoreOptions } from '@platform/business/platform/form/constants/fieldOptions'
import IbpsDataTemplateSelector2 from '@platform/business/platform/data/dataTemplate/selector2'
import EditorMixin from '../mixins/editor'
import DataTemplateMixin from '../mixins/data-template'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'
export default {
  components: {
    DataTemplateCondition,
    DataTemplateLinkdata,
    IbpsDataTemplateSelector2
  },
  mixins: [EditorMixin, DataTemplateMixin],
  data() {
    return {
      dialogStoreOptions: dialogStoreOptions
    }
  },
  computed: {
    linkLinkage() {
      return this.fieldItem.field_options.link_linkage
    },
    linkCondition() {
      return this.fieldItem.field_options.link_condition
    },
    hasLinkCondition() {
      return this.$utils.isNotEmpty(this.fieldItem.field_options.link_condition)
    },
    hasLinkLinkage() {
      return this.$utils.isNotEmpty(this.fieldItem.field_options.link_linkage)
    }
  },
  beforeDestroy() {
    this.dialogStoreOptions = null
  },
  methods: {
    settingURLDialog() {
      this.$message('暂时不支持该功能')
    },
    changeDataTemplateSelector(data, val, oldVal) {
      if (data && val !== oldVal) {
        this.setDefaultValue()
        this.setDataTemplateDefaultValue()
      }
      this.changeDataSource(val, 'customDialog')
    }
  }
}
</script>
