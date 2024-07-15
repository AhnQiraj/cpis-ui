<template>
  <div>
    <el-table
      ref="table"
      :data="list"
      :tree-props="{children: props.childrenKey,hasChildren: 'hasChildren'}"
      row-key="id"
      default-expand-all
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="参数名" width="250">
        <template slot-scope="scope">
          <el-input
            v-if="!readonly"
            v-model="scope.row.name"
            :style="{'width':(230-(14*parseInt(scope.row.level) +30)) +'px'}"
            :disabled="scope.row.isAry || scope.row.level === 1"
            placeholder="参数名"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" width="120">
        <template slot-scope="scope">
          <el-select v-if="!readonly" v-model="scope.row.dataType" placeholder="数据类型" @change="changeDataType(scope)">
            <el-option
              v-for="option in jsonDataTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <span v-else>{{ scope.row.dataType|optionsFilter(jsonDataTypeOptions,'label') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值/表达式">
        <template slot-scope="scope">
          <el-button
            v-if="!readonly && scope.row.dataType==='bind'"
            style="width:100%;"
            @click="changeVisible(scope.row)"
          >编辑途径</el-button>
          <el-input
            v-else-if="!readonly"
            v-model="scope.row.defaultValue"
            :disabled="hide(scope.row.dataType)"
            placeholder="值/表达式"
          />
          <span v-else>{{ scope.row.defaultValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <template v-if="type==='bind'">
            <el-input v-model="scope.row.desc" placeholder="描述" type="textarea" :autosize="{minRows:1}" />
          </template>
          <template v-else>
            <el-input v-if="!readonly" v-model="scope.row.desc" placeholder="描述" type="textarea" :autosize="{minRows:1}" />
            <span v-else>{{ scope.row.desc }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="!readonly" width="80" label="操作">
        <template slot-scope="scope">
          <el-tooltip
            v-if="!scope.row.isAry && scope.row.level !==1 "
            content="移除"
            effect="dark"
            placement="top"
          >
            <el-link
              :underline="false"
              type="danger"
              icon="ibps-icon-delete"
              @click="removeRow(scope)"
            />
          </el-tooltip>
          <!---清空格式--->
          <el-tooltip
            v-if="scope.row.level ===1 "
            content="清空格式"
            effect="dark"
            placement="top"
          >
            <el-link
              :underline="false"
              type="danger"
              icon="ibps-icon-delete"
              @click="clearData(scope)"
            />
          </el-tooltip>
          <!---添加--->
          <!--添加儿子节点-->
          <template v-if="scope.row.dataType ==='object' || scope.row.name === 'parameters'">
            <el-tooltip
              v-if="(scope.row.level === 1 ||scope.row.isAry) && scope.row.dataType ==='object'"
              content="添加子节点"
              effect="dark"
              placement="top"
            >
              <el-link :underline="false" type="primary" icon="ibps-icon-add" @click="addSubRow(scope)" />
            </el-tooltip>
            <el-dropdown
              v-else
              @command="(command)=>{handleAddCommand(command,scope)}"
            >
              <el-tooltip
                :content="'添加子节点/兄弟节点'"
                effect="dark"
                placement="top"
              >
                <el-link :underline="false" type="primary" icon="ibps-icon-add" />
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sibling">兄弟节点</el-dropdown-item>
                <el-dropdown-item command="sub">子节点</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else-if="!scope.row.isAry &&scope.row.dataType !=='object'">
            <el-tooltip
              content="添加兄弟节点"
              effect="dark"
              placement="top"
            >
              <el-link :underline="false" type="primary" icon="ibps-icon-add" @click="addSiblingRow(scope)" />
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <form-script
      :visible="formScriptVisible"
      :tree-data="dropdownFields"
      :data="$utils.isEmpty(editData.defaultValue)?'':editData.defaultValue"
      @callback="handleScript"
      @close="visible => formScriptVisible = visible"
    />
  </div>
</template>
<script>
import { defaultOptions, jsonDataTypeOptions, typeOptions, bindRequestTypeOptions, bindResponseTypeOptions, items } from '../constants'
import FormScript from './form-script'
export default {
  components: {
    FormScript
  },
  props: {
    data: Array,
    requestType: {
      type: String,
      default: 'request'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    },
    dropdownFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      props: {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      },
      list: [],
      defaultOptions,
      jsonDataTypeOptions,
      typeOptions,
      items,
      formScriptVisible: false,
      editData: {}
    }
  },
  computed: {
    hasBindType() {
      return this.type === 'bind'
    },
    bindTypeOptions() {
      if (this.requestType === 'request') {
        return bindRequestTypeOptions
      } else {
        return bindResponseTypeOptions
      }
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(val)) {
          this.list = []
          this.list.push(this.getDefaultData('root', true))
        } else {
          this.list = val
        }
      },
      immediate: true
    },
    list: {
      handler(val, oldVal) {
        this.$emit('update:data', val)
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.props = null
    this.list = null
    this.defaultOptions = null
    this.jsonDataTypeOptions = null
    this.typeOptions = null
  },
  methods: {
    changeVisible(data) {
      this.editData = data
      this.formScriptVisible = !this.formScriptVisible
    },
    handleScript(data) {
      this.$set(this.editData, 'defaultValue', data)
      this.editData = {}
    },
    hide(dataType) {
      return dataType === 'object' || dataType === 'array'
    },
    handleCommand(command, item) {
      item.defaultValue = command
    },
    getDefaultData(name, isRoot) {
      const data = {
        'id': this.$utils.guid(),
        'name': name,
        'dataType': isRoot ? 'object' : 'string',
        'bindType': '',
        'isRequire': 'Y',
        'testValue': '',
        'defaultValue': '',
        'level': 1,
        'desc': ''
      }
      return data
    },
    handleAddCommand(command, scope) {
      if (command === 'sub') {
        if (scope.row.name === 'parameters') {
          this.addItems(scope)
        } else {
          this.addSubRow(scope)
        }
      } else {
        this.addSiblingRow(scope)
      }
    },
    addSiblingRow({ row, $index }) {
      const curData = this.getCurData(row.id)
      this.addRow(curData.parentId, $index)
    },
    addSubRow({ row, $index }) {
      this.addRow(row.id, $index)
    },
    clearData({ row, $index }) {
      this.list = []
    },
    addRow(parentId, $index, $data) {
      const data = $data || this.getDefaultData('')
      const traverse = (list) => {
        list.forEach(item => {
          if (item.id === parentId) {
            if (!item[this.props.childrenKey]) {
              item[this.props.childrenKey] = []
            }
            data.level = item.level + 1
            data.parentId = parentId
            item[this.props.childrenKey].push(data)
          }
          if (item[this.props.childrenKey] && item[this.props.childrenKey].length > 0) {
            return traverse(item[this.props.childrenKey])
          } else {
            return item
          }
        })
        return list
      }
      const treeData = JSON.parse(JSON.stringify(this.list))
      this.list = traverse(treeData)
    },
    removeRow({ row, $index }) {
      const parentId = row.parentId
      const parenData = this.getCurData(parentId)
      const children = parenData[this.props.childrenKey] || []
      const index = children.findIndex(d => d.id === row.id)
      const traverse = (list) => {
        list.forEach(item => {
          if (item.id === parentId) {
            item[this.props.childrenKey].splice(index, 1)
          }
          if (item[this.props.childrenKey] && item[this.props.childrenKey].length > 0) {
            return traverse(item[this.props.childrenKey])
          } else {
            return item
          }
        })
        return list
      }
      const treeData = JSON.parse(JSON.stringify(this.list))
      this.list = traverse(treeData)
    },
    getCurData(id) {
      let node = JSON.parse(JSON.stringify(this.list))
      let flag = false
      while (!flag) {
        const item = node.shift()
        if (item.id === id) {
          flag = true
          return item
        }
        if (item[this.props.childrenKey] && item[this.props.childrenKey].length > 0) {
          node = node.concat(item[this.props.childrenKey])
        }
      }
    },
    changeDataType({ row, $index }) {
      // 把儿子设置为空
      row[this.props.childrenKey] = []
      // 如果是数组添加一个属性
      if (row.dataType === 'array') {
        const data = this.getDefaultData('items')
        data.level = row.level + 1
        data.isRequire = 'N'
        data.isAry = true
        row[this.props.childrenKey].push(data)
      }
      row.defaultValue = ''
      this.list = JSON.parse(JSON.stringify(this.list))
    },
    changeBindType({ row, $index }) {
    },
    addItems({ row, $index }) {
      if (row.dataType === 'array') {
        const data = JSON.parse(JSON.stringify(items))
        const id = data.id = this.$utils.guid()
        data[this.props.childrenKey].forEach(element => {
          element.id = this.$utils.guid()
          element.parentId = id
        })
        row[this.props.childrenKey].push(data)
      }
      this.list = JSON.parse(JSON.stringify(this.list))
    }
  }
}
</script>
<style lang="scss" scoped>
.setting_body{
  display: flex;
  align-items: center;
}
</style>
