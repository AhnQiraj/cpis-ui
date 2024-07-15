<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="构造条件"
    width="70%"
    class="ruleDialog"
    append-to-body
    @close="closeDialog"
  >
    <ibps-layout ref="layout">
      <div slot="west" class="west">
        <el-tree
          ref="elTree"
          v-loading="loadsing"
          :data="treeData"
          :expand-on-click-node="false"
          :props="{ label: 'name'}"
          node-key="id"
          pid-key="parentId"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>
      <div>
        <el-form
          v-loading="dialogLoading"
          :element-loading-text="$t('common.loading')"
          :model="ruleConfig"
          :rules="rules"
          :label-width="formLabelWidth"
          @submit.native.prevent
        >
          <el-form-item label="条件预览:">
            <span>{{ desc }}</span>
          </el-form-item>
          <el-form-item label="变量目标:">
            <el-input v-model="ruleConfig.name" disabled />
          </el-form-item>
          <el-form-item label="表达式:">
            <el-radio-group v-model="ruleConfig.expression">
              <el-radio-button v-for="e in expressions1" :key="e.value" :label="e.value">{{ e.label }}</el-radio-button>
              <div v-if="specTool">
                <br>
                <el-radio-button v-for="e in expressions2" :key="e.value" :label="e.value">{{ e.label }}</el-radio-button>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="值类型:">
            <el-select v-model="ruleConfig.executorType">
              <el-option
                v-for="item in valueType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-if="ruleConfig.executorType === 'user'" v-model="ruleConfig.userValType">
              <el-option
                v-for="item in valueType[0].children"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-if="ruleConfig.executorType === 'org'" v-model="ruleConfig.orgValType">
              <el-option
                v-for="item in valueType[1].children"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="匹配值:">
            <ibps-employee-selector
              v-if="ruleConfig.executorType === 'user'"
              v-model="ruleConfig.valueId"
              multiple
              @callback="userCallback"
            />
            <ibps-org-selector
              v-else-if="ruleConfig.executorType === 'org'"
              v-model="ruleConfig.valueId"
              multiple
              @callback="orgCallback"
            />
            <el-input v-else />
          </el-form-item>
        </el-form>
      </div>
    </ibps-layout>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { getTreeData } from '@platform/api/platform/bpmn/bpmDefinition'
import { findTreeData as getBoTreeData } from '@platform/api/platform/bo/boDef'
import IbpsEmployeeSelector from '@platform/business/platform/org/employee/selector'
import { expressionOptioins1, expressionOptioins2, valueTypeOptions } from './constants'
import treeUtil from '@platform/utils/tree'
import { optionsFilter } from '@platform/filters'
export default {
  components: {
    IbpsEmployeeSelector,
  },
  mixins: {
    optionsFilter
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defId: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      closeOnClickModal: false,
      // 树配置
      // 树配置
      loadsing: false,
      treeData: [],
      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }],
      specTool: false,
      formLabelWidth: '120px',
      dialogLoading: false,
      rules: {},
      expressions1: expressionOptioins1,
      expressions2: expressionOptioins2,
      valueType: valueTypeOptions,
      defaultRuleConfig: {
        expression: 'equals',
        executorType: 'user',
        userValType: 'userId',
        orgValType: 'orgId',
        valueId: '',
        valueName: '',
        label: '',
        source: '',
        dataType: '',
        name: ''
      },
      ruleConfig: {},
      actions: [
        { key: 'save', label: '选择' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    desc() {
      return '[ ' + this.ruleConfig.label + ' ] ' + optionsFilter(this.ruleConfig.expression, this.expressions1.concat(this.expressions2)) + ' [ ' + this.ruleConfig.valueName + ' ]'
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.visible) {
          this.loadTreeData()
        }
        this.ruleConfig = this.$utils.newData(this.defaultRuleConfig)
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.treeData = null
    this.toolbars = null
    this.rules = null
    this.expressions1 = null
    this.expressions2 = null
    this.valueType = null
    this.defaultRuleConfig = null
    this.ruleConfig = null
    this.actions = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    loadTreeData() {
      getTreeData({
        defId: this.defId
      }).then(response => {
        const tree = treeUtil.transformToTreeFormat(typeof response.data === 'string' ? this.$utils.parseJSON(response.data) : [])
        this.treeData = tree
        tree.forEach(node => {
          if (node.attrType === 'table' && node.key) {
            getBoTreeData({ key: node.key }).then(response => {
              const boTree = treeUtil.transformToTreeFormat(typeof response.data === 'string' ? this.$utils.parseJSON(response.data) : [])
              boTree.forEach(n => {
                if (n.attrType === 'table' && n.key === node.key) {
                  this.$refs.elTree.updateKeyChildren(node.id, n.children)
                }
              })
            })
          }
        })
      })
    },
    handleComfirm() {
      this.ruleConfig.conDesc = this.desc
      this.$emit('close', false)
      this.$emit('select', this.ruleConfig)
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleNodeClick(data) {
      // 如果是顶端节点不触发
      if (!data.attrType || data.attrType === 'table') {
        return
      }
      this.ruleConfig.label = data.name
      this.ruleConfig.type = data.type
      if (data.attrType === 'field') {
        this.ruleConfig.name = data.tableName + '.' + data.key
        this.ruleConfig.source = 'boVar'
      } else if (data.attrType === 'var') {
        this.ruleConfig.name = data.key
        this.ruleConfig.source = 'flowVar'
      } else if (data.attrType === 'bpmConstants') {
        this.ruleConfig.name = data.key
        this.ruleConfig.source = 'consVar'
      }
      if (data.type === 'number' || data.type === 'date' || data.type === 'int' || data.type === 'boolean') {
        this.specTool = true
      } else {
        this.specTool = false
      }
    },
    userCallback(data) {
      if (this.$utils.isEmpty(data)) {
        return
      }
      let name = ''
      data.forEach(employee => {
        if (name.length > 1) {
          name += ','
        }
        name += employee.name
      })
      this.ruleConfig.valueName = name
    },
    orgCallBack() {
    }
  }
}
</script>
<style lang="scss">
.ruleDialog{
  .west{
    width: 250px;
  }
}
</style>
