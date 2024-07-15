<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span>{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item prop="label">
          <template slot="label">模版名称</template>
          <el-input v-model="fieldItem.label" placeholder="请输入数据模版名称" :maxlength="64" />
        </el-form-item>
        <el-form-item prop="name">
          <template slot="label">字段标识<help-tip prop="key" /></template>
          <el-input v-model="fieldItem.name" placeholder="字段标识" :maxlength="64" />
        </el-form-item>
        <el-form-item>
          <template slot="label">数据模板<help-tip prop="dataTemplateKey" /></template>
          <data-template-selector
            v-model="fieldOptions.bind_template_key"
            value-key="key"
            type="default"
            @change="handlerInput"
          />
        </el-form-item>
        <el-form-item label="隐藏名称">
          <el-switch v-model="fieldOptions.hide_label" />
        </el-form-item>
        <el-form-item label="隐藏边框">
          <el-switch v-model="fieldOptions.hide_border" />
        </el-form-item>
        <el-form-item label="隐藏分割线">
          <el-switch v-model="fieldOptions.hide_border_bottom" />
        </el-form-item>
        <el-form-item>
          <template slot="label">高度<help-tip prop="controlHeight" /></template>
          <el-input-number
            v-model="fieldOptions.height"
            size="mini"
            :min="0"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag><br>
        </el-form-item>
      </div>
    </div>
    <div v-if="formType !== 'combination' && $utils.isNotEmpty(dynamicConditions)" class="panel panel-default">
      <div class="panel-heading">数据过滤</div>
      <div class="panel-body">
        <el-button
          style="width:100%;"
          type="primary"
          size="mini"
          plain
          @click="settingDataTemplate()"
        >动态条件</el-button>
      </div>
    </div>
    <!--数据模版-动态参数配置-->
    <data-template-condition
      :visible="dataTemplateConditionVisible"
      :conditions="dynamicConditions"
      :data="fieldOptions.casadeFields"
      :fields="filterBoData"
      :props="props"
      :node-key="nodeKey"
      @callback="setDataTemplateCondition"
      @close="visible => dataTemplateConditionVisible = visible"
    />
  </div>
</template>
<script>
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
import DataTemplateSelector from '@platform/business/platform/data/dataTemplate/selector'
import DataTemplateCondition from '../components/data-template-condition'
import { getSelectorDataByKey } from '@platform/api/platform/data/dataTemplate'
import { buildAllDynamicParams } from '@platform/business/platform/data/templaterender/utils'
export default {
  components: {
    DataTemplateSelector,
    DataTemplateCondition
  },
  mixins: [BaseMixin, EditorMixin],
  data() {
    return {
      dataTemplateConditionVisible: false,
      dynamicConditions: {},
      props: {
        children: 'children',
        label: 'name'
      },
      nodeKey: 'key'
    }
  },
  computed: {
    filterBoData() {
      const filterBoData = []
      if (this.$utils.isEmpty(this.boData)) {return []}
      for (let i = 0; i < this.boData.length; i++) {
        if (this.boData[i].attrType === 'field') { // 过滤非主表的字段
          filterBoData.push(JSON.parse(JSON.stringify(this.boData[i])))
        }
      }
      return filterBoData
    },
    formData() {
      return {
        bindField: this.fieldOptions.bindField || '',
        bindFieldType: this.fieldOptions.bindFieldType || '',
        conditions: this.fieldOptions.casadeFields || []
      }
    }
  },
  watch: {
    'fieldOptions.bind_template_key': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.getFieldsByTemplateKey(val)
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.dynamicConditions = null
  },
  methods: {
    setDataTemplateCondition(data) {
      let casadeFields = []
      if (this.$utils.isNotEmpty(data)) {
        casadeFields = JSON.parse(JSON.stringify(data))
      }
      this.$set(this.fieldOptions, 'casadeFields', casadeFields)
    },
    settingDataTemplate() {
      this.dataTemplateConditionVisible = true
    },
    // 选择数据模板
    handlerInput(data) {
      const name = this.$utils.isNotEmpty(data) ? data.name : ''
      const key = this.$utils.isNotEmpty(data) ? data.key : ''
      this.$set(this.fieldOptions, 'casadeFields', [])
      this.$set(this.fieldOptions, 'name', name)
      this.$set(this.fieldItem, 'label', name)
      this.$set(this.fieldItem, 'name', key)
    },
    // 通过模板key获取业务对象
    getFieldsByTemplateKey(key) {
      if (this.$utils.isEmpty(key)) {return}
      getSelectorDataByKey({
        dataTemplateKey: key
      }).then(response => {
        const data = response.data
        // 过滤条件
        let dynamicConditions = {}
        if (this.$utils.isNotEmpty(data.filterConditions)) {
          const filterConditions = this.$utils.parseJSON(data.filterConditions)
          if (this.$utils.isNotEmpty(filterConditions)) {
            dynamicConditions = buildAllDynamicParams(filterConditions)
          }
        }
        this.dynamicConditions = dynamicConditions
      }).catch(() => {
      })
    }
  }
}
</script>
