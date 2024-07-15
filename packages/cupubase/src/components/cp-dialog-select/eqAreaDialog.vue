<template>
  <z-dialog-table ref="areaDialogTable" :title="areaDialogProp.title" :key_="areaDialogProp.key" :toolbar-prop="areaDialogProp.toolbarProp" :table-prop="areaDialogProp.tableProp" :tree-prop="areaDialogProp.treeProp" :selection-handle="areaDialogProp.selectionHandle" @toolbar-search="onAreaDialogSearch" @on-reset="onReset" @ok="onAreaDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')" prop="key">
        <el-input v-model="areaDialogProp.toolbarProp.searchData.key" :placeholder="$t('equipment.message.inAreaNoOrNa')" />
      </el-form-item>
      <el-form-item :label="$t('equipment.area.resDept')" prop="dutyDeptId">
        <template>
          <ibps-org-selector v-model="areaDialogProp.toolbarProp.searchData.dutyDeptId" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.area.resDept') })" :multiple="false" />
        </template>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import I18n from "@cupu/i18n"
export default {
  name: 'EqAreaDialogSelect',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    fatherMethod: {
      type: Function,
      required: false,
      default: function () {}
    },
    multipleSelect: {
      type: Boolean,
      default: true
    },
    initParam: {
      // 初始化查询条件
      type: Object,
      default: null
    },
    selectedIds: {
      type: String
    },
    selectedNames: {
      type: String
    }
  },
  data() {
    return {
      selectData: {},
      // 弹出属性
      areaDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'areaId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            key: '',
            dutyDeptId: '',
            areaNo: '',
            areaName: '',
            isOn: '1',
            companyId: '',
            pathAreaId: '',
            path: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onAreaDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: I18n.t('common.field.primaryKey'),
              key: 'areaId',
              show: false
            },
            {
              title: I18n.t('equipment.area.areaNo'),
              key: 'areaNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.area.areaName'),
              key: 'areaName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.area.areaScope'),
              key: 'areaAddress',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.area.resDept'),
              key: 'dutyDeptName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.area.pArea'),
              key: 'parentAreaName',
              showOverflowTooltip: true
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('equipment.common.area'),
          nodeKey: 'key',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.loadNodeTreeData,
          nativeProp: {
            // 'default-expanded-keys': ["775492674567274496"]
          },
          lazyLoad: true, // 使用懒加载
          propMapping: {
            // 根据返回值的映射
            label: 'title',
            isLeaf: 'isLeaf'
            // children: 'son'u
          },
          selectData: [] // 存储选中树的数据
        }
      }
    }
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['equipment/index'].getEqAreaTable(par)
    },
    /**
     * 查询操作
     */
    onAreaDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.areaDialogTable.tableQuery(params)
      } else {
        this.$refs.areaDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onAreaDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.areaName
    },
    onReset() {
      this.areaDialogProp.toolbarProp.searchData.path = ''
      this.areaDialogProp.toolbarProp.searchData.pathAreaId = ''
      this.areaDialogProp.toolbarProp.searchData.isOn = '1' //默认查询状态为启用的区域
    },
    /**
     * 弹出表格确定事件
     */
    onAreaDialogTableOk(selected) {
      let areaIds = ''
      let areaNames = ''
      for (let index in selected) {
        areaNames += (selected[index].column.areaName || '') + ','
        areaIds += (selected[index].column.areaId || '') + ','
      }
      if (areaNames.lastIndexOf(',') !== -1) {
        areaNames = areaNames.substring(0, areaNames.length - 1)
      }
      if (areaIds.lastIndexOf(',') !== -1) {
        areaIds = areaIds.substring(0, areaIds.length - 1)
      }
      this.selectData = {
        ids: areaIds,
        names: areaNames,
        selected: selected
      }
      // this.$emit('onDTableOk', selected);
      this.fatherMethod(this.selectData)
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'areaId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            areaId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.areaDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.areaDialogTable.tableQuery(Object.assign(this.areaDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.areaDialogTable.tableQuery(this.areaDialogProp.toolbarProp.searchData)
          }
        }, 600)
      })
    },
    // --------------------弹出框相关----------------------------
    // --------------------树节点相关----------------------------
    /**
     * 树节点点击事件处理
     * 返回 对象，用于表单查询条件
     * 返回 null 不进行查询，可自定义一些处理
     */
    treeClickNodeHandle(node) {
      // 查询列表
      // 表格加载数据初始化
      this.areaDialogProp.toolbarProp.searchData.path = node.data.path // 节点值作为查询条件
      this.areaDialogProp.toolbarProp.searchData.pathAreaId = node.key
      this.onAreaDialogSearch(this.areaDialogProp.toolbarProp.searchData)
    },
    // 加载树组件数据(懒加载)
    loadNodeTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        // 初次加载一个根节点
        window.apiList['equipment/index'].eqAreaTopTree('').then(res => {
          loadDone()
          let arr = res.data
          let exapandKeys = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
            exapandKeys[i] = res.data[i].key
          }
          // 默认展开第一个大节点下的树
          this.areaDialogProp.treeProp.nativeProp = {
            'default-expanded-keys': exapandKeys
          }
          return resolve(arr)
        })
      }
      if (node.level != 0) {
        let id = node.data.key
        window.apiList['equipment/index'].eqAreaSubTree(id).then(res => {
          let arr = res.data
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
          }
          resolve(arr)
          loadDone()
        })
      }
    }
    // --------------------树节点相关结束----------------------------
  }
}
</script>
<style scoped></style>
