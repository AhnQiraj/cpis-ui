<template>
  <div class="panel panel-default">
    <div class="panel-heading"> 流程实例设置 </div>
    <div class="panel-body">
      <el-form label-width="100px">
        <el-form-item>
          <template slot="label">流程范围<help-tip prop="bpmDefScope" /></template>
          <el-select
            v-model="fieldOptions.filter.bpmDefScope"
            placeholder="请选择"
            :class="fieldOptions.filter.bpmDefScope==='spec'||fieldOptions.filter.bpmDefScope==='script'?'bpm-def-scope-add-icon-select':'bpm-def-scope-remove-icon-select'"
            @change="changeBpmDefScope"
          >
            <el-option
              v-for="item in bpmDefScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 流程范围-指定范围[流程定义选择器] -->
          <span v-if="fieldOptions.filter.bpmDefScope==='spec'">
            <el-link :underline="false" href="javascript:;"><div class="el-icon-s-tools" @click="handerSpec" /></el-link>
          </span>
          <!-- 流程范围-脚本  -->
          <span v-else-if="fieldOptions.filter.bpmDefScope==='script'">
            <el-link :underline="false" href="javascript:;"><div class="el-icon-s-tools" @click="handerScript" /></el-link>
          </span>
        </el-form-item>
        <el-form-item>
          <template slot="label">发起人范围<help-tip prop="starterScope" /></template>
          <el-select
            v-model="fieldOptions.filter.starterScope"
            :disabled="fieldOptions.filter.bpmDefScope==='script'"
            placeholder="请选择"
            :class="fieldOptions.filter.starterScope==='spec'&&fieldOptions.filter.bpmDefScope!=='script'?'bpm-def-scope-add-icon-select':'bpm-def-scope-remove-icon-select'"
            @change="changeStarterScope"
          >
            <el-option
              v-for="item in starterScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 发起人范围-指定范围[人员选择器] -->
          <span v-if="fieldOptions.filter.starterScope==='spec'&&fieldOptions.filter.bpmDefScope!=='script'">
            <el-link :underline="false" href="javascript:;"><div class="el-icon-s-tools" @click="handerStarterScope" /></el-link>
          </span>
        </el-form-item>
        <el-form-item>
          <template slot="label">存储格式<help-tip prop="scope" /></template>
          <el-select v-model="fieldOptions.store" placeholder="请选择" class="bpm-def-scope-remove-icon-select" @change="changeScript">
            <el-option
              v-for="item in scriptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 流程范围-指定范围[流程定义选择器] -->
    <bpm-def-scope
      :visible="bpmDefScopeVisible"
      :multiple="true"
      @close="visible => bpmDefScopeVisible = visible"
      @action-event="handerBpmDefScopeAction"
    />
    <!-- 流程范围-脚本  -->
    <dynamic-script
      :visible="dynamicScriptVisible"
      value-key="defKey"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptVisible = visible"
    />
    <!-- 发起人范围-指定范围[人员选择器] -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="fieldOptions.filter.bpmUsers||[]"
      label-key="fullname"
      value-key="userid"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { bpmDefScopeOptions, starterScopeOptions, scriptOptions } from '@platform/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'
import BpmDefScope from '@platform/business/platform/bpmn/definition/dialog'
import DynamicScript from '../components/bpm-def-scope-script'
import IbpsEmployeeSelectorDialog from '@platform/business/platform/org/employee/dialog'
export default {
  components: {
    BpmDefScope,
    DynamicScript,
    IbpsEmployeeSelectorDialog
  },
  mixins: [EditorMixin],
  data() {
    return {
      bpmDefScopeOptions,
      starterScopeOptions,
      scriptOptions,
      bpmDefScopeVisible: false,
      dynamicScriptVisible: false,
      selectorVisible: false,
      rootValue: []
    }
  },
  watch: {
    fieldOptions: {
      handler: function(val, oldVal) {
        if (val.filter.bpmDefScope === '') {
          val.filter.bpmDefScope = 'all'
        }
        if (val.filter.starterScope === '') {
          val.filter.starterScope = 'current'
        }
        if (val.store === '') {
          val.store = 'json'
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.bpmDefScopeOptions = null
    this.starterScopeOptions = null
    this.scriptOptions = null
    this.rootValue = null
  },
  methods: {
    changeBpmDefScope(value) {
      this.fieldOptions.bpmDefScope = value
      if (this.fieldOptions.bpmDefScope === 'script') {
        this.fieldItem.field_options.filter.bpmDefKey = ''
        this.fieldItem.field_options.filter.bpmDefs = []
        this.fieldItem.field_options.filter.bpmUsers = []
      } else if (this.fieldOptions.bpmDefScope === 'all') {
        this.fieldItem.field_options.filter.bpmDefKey = ''
        this.fieldItem.field_options.filter.bpmDefs = []
        this.fieldItem.field_options.filter.bpmUsers = []
        this.fieldItem.field_options.filter.script = ''
      }
    },
    changeStarterScope(value) {
      this.fieldOptions.starterScope = value
      if (this.fieldOptions.starterScope !== 'spec') {
        this.fieldItem.field_options.filter.starter = ''
      }
    },
    changeScript(value) {
      this.fieldOptions.script = value
    },
    /**
     * 设置默认值
     */
    setDefaultValue(data) {
      this.fieldItem.field_options.filter.script = data
      this.dynamicScriptVisible = false
    },
    handerSpec() {
      this.bpmDefScopeVisible = true
    },
    handerScript() {
      this.dynamicScriptVisible = true
    },
    handerStarterScope() {
      this.selectorVisible = true
      const hasSelectorData = JSON.parse(JSON.stringify(this.fieldOptions.filter.bpmUsers))
      this.fieldOptions.filter.bpmUsers = []
      this.fieldOptions.filter.bpmUsers = JSON.parse(JSON.stringify(hasSelectorData))
    },
    handerBpmDefScopeAction(key, data) {
      let bpmDefScopeData = data || []
      let arr = []
      bpmDefScopeData.forEach(i => {
        arr.push(i.defKey)
      })
      this.fieldItem.field_options.filter.bpmDefKey = arr.join(',')
      this.fieldItem.field_options.filter.bpmDefs = bpmDefScopeData.map(item => {
        return {
          defId: item.defId,
          defKey: item.defKey,
          name: item.name
        }
      })
      this.bpmDefScopeVisible = false
    },
    handleSelectorActionEvent(key, data) {
      if (key === 'cancel') {return}
      let selectorData = data || []
      let targetData = data || []
      let arr = []
      targetData.forEach(i => {
        arr.push(i.account)
      })
      this.fieldItem.field_options.filter.starter = arr.join(',')
      this.fieldItem.field_options.filter.bpmUsers = selectorData.map(item => {
        return {
          account: item.account,
          fullname: item.fullname,
          userid: item.userId
        }
      })
      if (key === 'clean') {return}
      this.selectorVisible = false
    }
  }
}
</script>
<style lang="scss">
.bpm-def-scope-add-icon-select{
  width:90%
}
.bpm-def-scope-remove-icon-select{
  width:100%
}
</style>
