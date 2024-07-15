<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="linkage-data-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <div v-if="dialogVisible">
      <el-form label-width="120px" @submit.native.prevent>
        <el-form-item label="数据关联来源:">
          <ibps-data-template-selector2
            v-model="linkageData.dataSource"
            @change="changeDataTemplateSelector"
          />
        </el-form-item>
        <el-form-item v-if="$utils.isNotEmpty(dynamicConditions)" label="动态参数:">
          <el-button style="width:100%;" type="primary" plain size="mini" @click="settingLinkageDataCondition">设置动态参数</el-button>
        </el-form-item>
        <p />
        <p />
        <div>
          <ibps-tree-select
            v-model="linkageData.field"
            :data="fieldOptions"
            :props="{
              children: 'children',
              label: 'label'
            }"
            :node-key="fieldName"
            select-mode="leaf"
            placeholder="请选择当前表单字段"
            clearable
            style="width:215px;display: inline-block;"
          />
          <!-- <el-select v-model="linkageData.field" >
            <el-option
              v-for="item in fieldOptions"
              :key="item.name"
              :value="item.name"
              :label="item.label"
            />
          </el-select> -->
          <span>值&nbsp;&nbsp;等&nbsp;&nbsp;于</span>
          <el-select v-model="linkageData.relyData" no-data-text="请先选择数据关联来源" placeholder="请选择关联数据">
            <el-option
              v-for="item in resultColumns"
              :key="item.key"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
          的值时
        </div>
        <p />
        <p />
        <div>
          <el-input :value="label" style="width:215px;" disabled />
          联动显示
          <el-select v-model="linkageData.dataField" no-data-text="请先选择数据关联来源" placeholder="请选择关联数据">
            <el-option
              v-for="item in resultColumns"
              :key="item.key"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
          中的对应值
        </div>
      </el-form>
      <!--数据模版-动态参数配置-->
      <data-template-condition
        :visible="dataTemplateConditionVisible"
        :conditions="dynamicConditions"
        :data="linkageData.condition"
        :fields="formSubFields"
        @callback="setDataSourceCondition"
        @close="visible => dataTemplateConditionVisible = visible"
      />
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import ActionUtils from '@platform/utils/action'
import TreeUtils from '@platform/utils/tree'
import DataTemplateMixin from '../mixins/data-template'
import IbpsDataTemplateSelector2 from '@platform/business/platform/data/dataTemplate/selector2'
import DataTemplateCondition from '../components/data-template-condition'
import IbpsTreeSelect from '@platform/components/ibps-tree-select'
export default {
  components: {
    IbpsDataTemplateSelector2,
    DataTemplateCondition,
    IbpsTreeSelect
  },
  mixins: [DataTemplateMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    data: {
      type: [String, Number, Object, Array]
    },
    fields: {
      type: Array
    },
    fieldItem: {
      type: Object
    },
    title: {
      type: String,
      default: '联动数据'
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      defaultForm: {},
      linkageData: {
        dataSource: '',
        condition: [],
        field: '',
        relyData: '',
        dataField: ''
      },
      fieldName: 'name'
    }
  },
  computed: {
    fieldOptions() {
      return TreeUtils.transformToTreeFormat(this.formFields)
    },
    code() {
      return this.fieldItem.code
    },
    isSub() {
      return !!this.fieldItem.isSub
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.setFormFields(true)
        }
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.linkageData))
  },
  beforeDestroy() {
    this.toolbars = null
    this.defaultForm = null
    this.linkageData = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      this.$emit('callback', this.linkageData)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.data)) {
        this.linkageData = JSON.parse(JSON.stringify(this.data))
      } else {
        this.linkageData = JSON.parse(JSON.stringify(this.defaultForm))
      }
    },
    settingLinkageDataCondition() {
      const label = '联动数据'
      if (this.$utils.isEmpty(this.dynamicConditions)) {
        ActionUtils.warning(`请设置[${label}]过滤条件`)
        return
      }
      this.dataTemplateConditionVisible = true
    },
    setDataSourceCondition(data) {
      this.linkageData.condition = data
    },
    changeDataTemplateSelector(data, val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        this.linkageData.condition = []
        this.linkageData.relyData = ''
        this.linkageData.dataField = ''
      }
      this.changeDataSource(val, 'linkageData')
    }
  }
}
</script>
