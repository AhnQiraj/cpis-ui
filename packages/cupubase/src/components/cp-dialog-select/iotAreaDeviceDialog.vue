<template>
  <z-dialog-table ref="areaDialogTable" :title="areaDialogProp.title" :key_="areaDialogProp.key" :toolbar-prop="areaDialogProp.toolbarProp" :table-prop="areaDialogProp.tableProp" :tree-prop="areaDialogProp.treeProp" :selection-handle="areaDialogProp.selectionHandle" @toolbar-search="onAreaDialogSearch" @on-reset="onReset" @ok="onAreaDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item label="门组" prop="doorGroupId">
        <el-select v-model="areaDialogProp.toolbarProp.searchData.doorGroupId" :placeholder="$t('baseCommon.message.pleaseSelect', { title: '门组' })" filterable clearable>
          <el-option v-for="(item, index) in doorGroupList" :key="index" :label="item.doorGroupName" :value="item.doorGroupId" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('iot.sys.sysType')" prop="iotSystemCode">
        <el-select v-model="areaDialogProp.toolbarProp.searchData.iotSystemCode" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('iot.sys.sysType') })" filterable clearable>
          <el-option v-for="(item, index) in iotSystemList" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('iot.sys.sysName')" prop="systemName">
        <el-input v-model="areaDialogProp.toolbarProp.searchData.systemName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('iot.sys.sysName') })" />
      </el-form-item>
      <el-form-item :label="$t('iot.device.devName')" prop="indexName">
        <el-input v-model="areaDialogProp.toolbarProp.searchData.indexName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('iot.device.devName') })" />
      </el-form-item>
      <el-form-item :label="$t('iot.device.channelNo')" prop="indexCode">
        <el-input v-model="areaDialogProp.toolbarProp.searchData.indexCode" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('iot.device.channelNo') })" />
      </el-form-item>
      <el-form-item :label="$t('iot.device.assAreaOrNot')" prop="isRelatedArea">
        <el-select v-model="areaDialogProp.toolbarProp.searchData.isRelatedArea" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('iot.device.assAreaOrNot') })" filterable clearable>
          <el-option :label="$t('common.field.yes')" value="true" />
          <el-option :label="$t('common.field.no')" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('iot.common.factory')" prop="factoryType">
        <el-select v-model="areaDialogProp.toolbarProp.searchData.factoryType" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('iot.common.factory') })" filterable clearable>
          <el-option v-for="(item, index) in factoryTypeList" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('baseCommon.status.state')" prop="isOn">
        <el-select v-model="areaDialogProp.toolbarProp.searchData.isOn" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('baseCommon.status.state') })" filterable clearable>
          <el-option :label="$t('iot.device.onLine')" :value="1" />
          <el-option :label="$t('iot.device.offLine')" :value="0" />
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import { getLoginInfo } from '@cupu/utils/index'
export default {
  name: 'IotAreaDeviceDialogSelect',
  props: {
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
      userInfo: {}, // 当前登录人信息
      iotSystemList: [], //iot系统列表
      factoryTypeList: [], //厂家列表，1表示海康，2表示大华
      doorGroupList: [], //门组列表
      selectData: {},
      // 弹出属性
      areaDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'indexCode',
        toolbarProp: {
          // 搜索数据
          searchData: {
            areaName: '',
            iotSystemCode: '',
            systemName: '',
            indexName: '',
            indexCode: '',
            companyId: '',
            isRelatedArea: null,
            factoryType: null,
            parentAreaIds: '',
            isOn: null,
            doorGroupId: ''
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
              title: 'indexCode',
              key: 'indexCode',
              show: false
            },
            {
              title: this.$t('equipment.common.area'),
              key: 'areaName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.sys.sysType'),
              key: 'iotSystemName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.sys.sysName'),
              key: 'systemName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.device.devCode'),
              key: 'indexCode',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.device.devName'),
              key: 'indexName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.device.channelNo'),
              key: 'channelNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.device.channelType'),
              key: 'channelTypeName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('iot.device.isMoveCon'),
              key: 'isMoveControl',
              align: 'center',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                if (cellValue === 1) {
                  return this.$t('common.field.yes')
                } else {
                  return this.$t('common.field.no')
                }
              }
            },
            {
              title: this.$t('baseCommon.status.state'),
              key: 'isOn',
              width: 80,
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                if (cellValue === 1) {
                  return this.$t('iot.device.onLine')
                } else {
                  return this.$t('iot.device.offLine')
                }
              }
            },
            {
              title: this.$t('common.field.memo'),
              key: 'remark',
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
            // children: 'son'
          },
          selectData: [] // 存储选中树的数据
        }
      }
    }
  },
  created() {
    // 获得iot系统列表
    window.apiList['cat/dictionary'].findByTypeKey({ typeKey: 'IOT_SYSTEM' }).then(res => {
      this.iotSystemList = res.data
    })
    // 获得厂家数字字典列表
    window.apiList['cat/dictionary'].findByTypeKey({ typeKey: 'IOT_FACTORY_TYPE' }).then(res => {
      this.factoryTypeList = res.data
    })
    // 获得当前人的信息
    this.userInfo = getLoginInfo()
    // 获得门组列表
    window.apiList['equipment/index'].getIotDoorGroupList({ isOn: 1 }).then(res => {
      this.doorGroupList = res.data
    })
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['equipment/index'].areaDevicePage(par)
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
      return selection.indexName
    },
    onReset() {
      this.areaDialogProp.toolbarProp.searchData.parentAreaIds = '' //默认查询状态为启用的区域
    },
    /**
     * 弹出表格确定事件
     */
    onAreaDialogTableOk(selected) {
      let indexCodes = ''
      let indexNames = ''
      for (let index in selected) {
        if (selected[index]['column']['indexName'] && selected[index]['column']['indexCode']) {
          indexNames += (selected[index]['column']['indexName'] || '') + ','
          indexCodes += (selected[index]['column']['indexCode'] || '') + ','
        } else {
          indexNames += (selected[index]['column']['name'] || '') + ','
          indexCodes += (selected[index]['column']['id'] || '') + ','
        }
      }
      if (indexNames.lastIndexOf(',') !== -1) {
        indexNames = indexNames.substring(0, indexNames.length - 1)
      }
      if (indexCodes.lastIndexOf(',') !== -1) {
        indexCodes = indexCodes.substring(0, indexCodes.length - 1)
      }
      this.selectData = {
        ids: indexCodes,
        names: indexNames,
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
        key: 'indexCode',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ indexCode: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
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
      this.areaDialogProp.toolbarProp.searchData.parentAreaIds = node.key
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
          this.areaDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
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
