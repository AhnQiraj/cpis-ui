<template>
  <div class="modelTreeBar">
    <el-row :gutter="10" style="font-weight: 600; height: 40px; line-height: 40px; background-color: #f5f5f6; margin-left: -10px; width: calc(100% + 20px)">
      <el-col :span="12">{{ $t('ticket.dangerPointExe.hazard') }}</el-col>
      <el-col :span="12" style="margin-top: 10px">
        <i class="el-icon-d-arrow-right treeIconStyle" @click="changeTree(3)" />
        <i class="el-icon-d-arrow-left treeIconStyle" @click="changeTree(2)" />
      </el-col>
    </el-row>
    <el-row style="margin-top: 5px">
      <el-form label-width="60px" label-position="right">
        <el-form-item :label="$t('ticket.dangerPointExe.hazard')">
          <el-input v-model="filterText" :placeholder="$t('baseCommon.message.inputKeyWords')" clearable class="textInput" @keyup.enter.native="filterTree" />
        </el-form-item>
        <el-form-item :label="$t('common.field.dept')" class="dept">
          <orgSelect ref="orgSelect" :org="department" :level-i-d="743056808754544640" @edit="department = arguments[0]" />
          <el-button type="primary" icon="el-icon-search" class="buttonSearch" @click="filterTree" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="height: calc(100% - 125px); overflow: auto">
      <el-tree ref="tree" :highlight-current="true" :current-node-key="checkedKey" :node-key="nodeKey" class="filterTree" :data="treeData" :props="defaultProps" :default-expand-all="false" :filter-node-method="filterNode" @node-click="handleNodeClick" />
    </el-row>
  </div>
</template>
<script>
import orgSelect from '../org-select/index.vue'
import * as utils from '@cupu/utils/index'
export default {
  name: 'ModelTreeBar',
  components: {
    orgSelect
  },
  props: {
    hazardType: {
      type: String
    }
  },
  data() {
    return {
      department: '',
      filterText: '',
      treeData: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      nodeKey: 'id', // 树对象的唯一标识
      checkedKey: '' // 已选择的标识
    }
  },
  watch: {},
  mounted() {
    let userInfo = utils.getLoginInfo()
    if (userInfo.org.levelID === '743056808754544640') {
      this.department = userInfo.org.id
    }
    this.initTreeData()
  },
  methods: {
    initTreeData() {
      window.apiList['safety/index'].raHazardsTree({ hazardType: this.hazardType }).then(res => {
        this.$set(this, 'treeData', res.data.children)
        if (this.treeData && this.treeData.length > 0) {
          this.$nextTick(() => {
            this.filterTree()
            let index = this.getFilterData()
            // 设置默认选中为第一个
            this.checkedKey = this.treeData[index][this.nodeKey]
            // 回显选中样式
            this.$refs.tree.setCurrentKey(this.checkedKey)
            // 传递树对象，再查询表格
            this.handleNodeClick(this.treeData[index])
          })
        }
      })
    },
    getFilterData() {
      const rootData = this.$refs.tree.root
      if (rootData.visible) {
        for (let i = 0; i < rootData.childNodes.length; i++) {
          if (rootData.childNodes[i].visible) {
            return i
          }
        }
      }
      return 0
    },
    // 隐藏树
    changeTree(type) {
      this.$emit('changeTree', type)
    },
    // 点击树
    handleNodeClick(data) {
      this.$emit('handleNodeClick', data)
    },
    // 过滤树
    filterTree() {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
      let filler = true
      if (this.department != '') {
        filler = data.department === this.department || (data.isRa && data.department === '') || (data.isRa && data.department === null)
      }
      if (value) {
        filler = data[this.defaultProps.label].indexOf(value) !== -1
      }
      return filler
    }
  }
}
</script>
<style scoped>
.modelTreeBar ::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
.dept ::v-deep .el-select.el-select--small {
  width: 75%;
}
.dept ::v-deep .el-button {
  width: 25%;
}
</style>
