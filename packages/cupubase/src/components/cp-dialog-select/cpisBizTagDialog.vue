<template>
  <z-dialog-table ref="bizTagDialogTable" :title="bizTagDialogProp.title" :key_="bizTagDialogProp.key" :toolbar-prop="bizTagDialogProp.toolbarProp" :table-prop="bizTagDialogProp.tableProp" :tree-prop="bizTagDialogProp.treeProp" :selection-handle="bizTagDialogProp.selectionHandle" @toolbar-search="onBizTagDialogSearch" @on-reset="onReset" @ok="onBizTagDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('bizTag.tagName')" prop="tagName">
        <el-input v-model="bizTagDialogProp.toolbarProp.searchData.tagName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('bizTag.tagName') })" />
      </el-form-item>
      <el-form-item :label="$t('bizTag.tagTypeName')" prop="tagTypeName">
        <el-input v-model="bizTagDialogProp.toolbarProp.searchData.tagTypeName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('bizTag.tagTypeName') })" />
      </el-form-item>
      <el-form-item :label="$t('bizTag.busObjType')" prop="bizName">
        <el-select v-model="bizTagDialogProp.toolbarProp.searchData.bizCode" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('bizTag.busObjType') })" filterable clearable>
          <el-option v-for="(item, index) in bizList" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'BizTagDialogSelect',
  props: {
    // String Number Boolean Array Object Function || validator (value) {}
    title: {
      type: String,
      default: ''
    },
    fatherMethod: {
      // 父组件传过来的方法 fatherMethod
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
      bizList: [], //业务对象列表
      selectData: {},
      // 弹出属性
      bizTagDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'tagId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            tagName: '',
            tagTypeId: '',
            tagTypeName: '',
            bizCode: '',
            isOn: 1
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onBizTagDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('bizTag.tagName'),
              key: 'tagName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('bizTag.tagTypeCode'),
              key: 'tagTypeCode',
              showOverflowTooltip: true
            },
            {
              title: this.$t('bizTag.tagTypeName'),
              key: 'tagTypeName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('bizTag.busObjTyCode'),
              key: 'bizCode',
              showOverflowTooltip: true
            },
            {
              title: this.$t('bizTag.busObjTyName'),
              key: 'bizName',
              showOverflowTooltip: true
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('bizTag.tagType'),
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
            // children: 'son'
          },
          selectData: [] // 存储选中树的数据
        }
      }
    }
  },
  created() {
    // 业务对象列表
    window.apiList['common/index'].getDictByTypeKey({ typeKey: 'ywbqdydywdx' }).then(res => {
      if (res.state === 200) {
        this.bizList = res.data
      }
    })
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['cpisBizTag/cpisBizTag/index'].getTagTable(par)
    },
    /**
     * 查询操作
     */
    onBizTagDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.bizTagDialogTable.tableQuery(params)
      } else {
        this.$refs.bizTagDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onBizTagDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.tagName
    },
    onReset() {
      this.bizTagDialogProp.toolbarProp.searchData.tagName = ''
      this.bizTagDialogProp.toolbarProp.searchData.tagTypeId = ''
      this.bizTagDialogProp.toolbarProp.searchData.tagTypeName = ''
      this.bizTagDialogProp.toolbarProp.searchData.bizCode = ''
      this.bizTagDialogProp.toolbarProp.searchData.isOn = 1 //默认查询状态为启用的区域
    },
    /**
     * 弹出表格确定事件
     */
    onBizTagDialogTableOk(selected) {
      if (selected.length == 0) {
        this.$message({ message: this.$t('bizTag.noSelectTag'), type: 'warning' })
        return
      }
      let tagIds = ''
      let tagNames = ''
      for (let index in selected) {
        tagNames += (selected[index]['column']['tagName'] || '') + ','
        tagIds += (selected[index]['column']['tagId'] || '') + ','
      }
      if (tagNames.lastIndexOf(',') !== -1) {
        tagNames = tagNames.substring(0, tagNames.length - 1)
      }
      if (tagIds.lastIndexOf(',') !== -1) {
        tagIds = tagIds.substring(0, tagIds.length - 1)
      }
      this.selectData = {
        ids: tagIds,
        names: tagNames,
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
        key: 'tagId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ tagId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.bizTagDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.bizTagDialogTable.tableQuery(Object.assign(this.bizTagDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.bizTagDialogTable.tableQuery(this.bizTagDialogProp.toolbarProp.searchData)
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
      this.bizTagDialogProp.toolbarProp.searchData.tagTypeId = node.key // 节点值作为查询条件
      this.onBizTagDialogSearch(this.bizTagDialogProp.toolbarProp.searchData)
    },
    // 加载树组件数据(懒加载)
    loadNodeTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        // 初次加载一个根节点
        let bizCode = ''
        if (this.initParam != null && this.initParam.bizCode) {
          bizCode = this.initParam.bizCode
        }
        let useScope = ''
        if (this.initParam != null && this.initParam.useScope) {
          useScope = this.initParam.useScope
        }
        window.apiList['cpisBizTag/cpisBizTagType/index'].getListTree({ isOn: 1, bizCode: bizCode, useScope: useScope }).then(res => {
          loadDone()
          let arr = res.data
          let exapandKeys = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
            exapandKeys[i] = res.data[i].key
          }
          // 默认展开第一个大节点下的树
          this.bizTagDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
          return resolve(arr)
        })
      }
      if (node.level != 0) {
        // let id = node.data.key
        // AreaHttp.getSubTreeList(id).then(res => {
        //     let arr = res.data
        //     for (let i = 0; i < res.data.length; i++) {
        //         arr[i].isLeaf = res.data[i].data.isLeaf
        //     }
        //     resolve(arr)
        //     loadDone()
        // })
      }
    }
    // --------------------树节点相关结束----------------------------
  }
}
</script>
<style scoped></style>
