<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">关联数据<help-tip prop="relevancyData" /></template>
        <ibps-data-template-selector2
          v-model="fieldOptions.linkdata"
          placeholder="请选择关联数据"
          type="valueSource"
          @change="changeDataTemplateSelector"
        />
      </el-form-item>
      <column
        :data="fieldOptions.linkdataDisplayColumns"
        :fields="fieldsOptions"
        :default-value="displayDefaultValue"
        :dataset-type="datasetType"
        title="显示字段"
        prop="display_columns"
        @input="handleColumns"
      />
      <el-form-item>
        <template slot="label">数据过滤<help-tip prop="dateFilter" /></template>
        <el-button :disabled="disabledDynamicConditions" style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateCondition('linkdata')">设置动态参数</el-button>
      </el-form-item>
      <el-form-item>
        <template slot="label">数据条数<help-tip prop="dataNumber" /></template>
        <el-radio-group v-model="fieldOptions.multiple">
          <el-radio label="N">一条</el-radio>
          <el-radio label="Y">多条</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <!--数据模版-动态参数配置-->
    <data-template-condition
      :visible="dataTemplateConditionVisible"
      :conditions="dynamicConditions"
      :data="fieldItem.field_options.link_condition"
      :fields="formSubFields"
      @callback="setDataTemplateCondition"
      @close="visible => dataTemplateConditionVisible = visible"
    />
  </div>
</template>
<script>
import { getBuildDataById } from '@platform/api/platform/data/dataTemplate'
import IbpsDataTemplateSelector2 from '@platform/business/platform/data/dataTemplate/selector2'
import EditorMixin from '../mixins/editor'
import DataTemplateMixin from '../mixins/data-template'
import Column from '../components/column'
import DataTemplateCondition from '../components/data-template-condition'
export default {
  components: {
    DataTemplateCondition,
    IbpsDataTemplateSelector2,
    Column
  },
  mixins: [EditorMixin, DataTemplateMixin],
  data() {
    return {
      displayDefaultValue: {},
      datasetType: 'table',
      fieldsOptions: {}
    }
  },
  methods: {
    changeDataTemplateSelector(data, val, oldVal) {
      if (data && val !== oldVal) {
        this.setDefaultValue()
        this.setDataTemplateDefaultValue()
        this.$set(this.fieldOptions, 'linkdataDisplayColumns', [])
      }
      this.changeDataSource(val, 'value_source')
      if (data) {
        this.loadDisplayColumns(data.id)
      }
    },
    loadDisplayColumns(id) {
      getBuildDataById({
        dataTemplateId: id,
        isRightsFilter: false
      }).then(res => {
        this.fieldsOptions = JSON.parse(res.data).datasets
      }).catch(err => {
        console.error(err)
      })
    },
    handleColumns(key, data) {
      this.$set(this.fieldOptions, 'linkdataDisplayColumns', data)
    }
  }
}
</script>
