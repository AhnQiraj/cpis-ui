<template>
  <z-dialog-table ref="EqMeasurePointDialogTable" :title="eqMeasurePointDialogProp.title" :key_="eqMeasurePointDialogProp.key" :toolbar-prop="eqMeasurePointDialogProp.toolbarProp" :table-prop="eqMeasurePointDialogProp.tableProp" :tree-prop="eqMeasurePointDialogProp.treeProp" :selection-handle="eqMeasurePointDialogProp.selectionHandle" @toolbar-search="onEqMeasurePointDialogSearch" @ok="onEqMeasurePointDialogTableOk" @on-reset="onReset" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('equipment.meaPoint.meaPointNo')" prop="mpNo">
        <el-input v-model="eqMeasurePointDialogProp.toolbarProp.searchData.mpNo" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.meaPoint.meaPointNo') })" />
      </el-form-item>
      <el-form-item :label="$t('equipment.meaPoint.meaPointName')" prop="mpComment">
        <el-input v-model="eqMeasurePointDialogProp.toolbarProp.searchData.mpComment" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.meaPoint.meaPointName') })" />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.locaNo')" prop="locaNo">
        <el-input v-model="eqMeasurePointDialogProp.toolbarProp.searchData.locaNo" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.common.locaNo') })" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('equipment.common.locaName')" prop="locaName">
        <el-input v-model="eqMeasurePointDialogProp.toolbarProp.searchData.locaName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.common.locaName') })" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('equipment.techPara.paraName')" prop="parmName">
        <el-input v-model="eqMeasurePointDialogProp.toolbarProp.searchData.parmName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.techPara.paraName') })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('equipment.techPara.paraType')" prop="parmTypeId">
        <el-select v-model="eqMeasurePointDialogProp.toolbarProp.searchData.parmTypeId" style="width: 100%" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.techPara.paraType') })" filterable>
          <el-option v-for="(item, index) in parmTypeList" :key="index" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('equipment.meaPoint.meaPointPurpose')" prop="measurePurpose">
        <el-select v-model="eqMeasurePointDialogProp.toolbarProp.searchData.measurePurpose" style="width: 100%" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.meaPoint.meaPointPurpose') })" filterable>
          <el-option v-for="(item, index) in measurePurposeList" :key="index" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import { getLoginInfo } from '@cupu/utils/index'
export default {
  name: 'EqMeasurePointDialogSelect',
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
      parmTypeList: [], //参数类型列表
      measurePurposeList: [], //测点用途列表
      unitList: [], //定义数组存储测量单位数组
      selectData: {},
      // 弹出属性
      eqMeasurePointDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'mpNo',
        toolbarProp: {
          // 搜索数据
          searchData: {
            mpNo: '',
            mpComment: '',
            locaName: '',
            locaNo: '',
            parmName: '',
            measurePurpose: '',
            parmTypeId: '',
            companyId: '',
            catId: '',
            isOn: 1
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.EqTechnicalParDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'measurepointId',
              show: false
            },
            {
              title: this.$t('equipment.meaPoint.meaPointNo'),
              key: 'mpNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.meaPoint.realMeaPointNo'),
              key: 'mpDcsNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.meaPoint.meaPointName'),
              key: 'mpComment',
              width: 220,
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.locaNo'),
              width: 160,
              key: 'locaNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.locaName'),
              key: 'locaName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.techPara.paraName'),
              key: 'parmName',
              width: 100,
              showOverflowTooltip: true
            }
            /*  {
                title: this.$t('equipment.techPara.paraType'),
                key: 'parmTypeId',
               // width: 80,
                formatter:(row, column, cellValue, index)=>{
                    let obj = this.parmTypeList.find(item => {
                        return item.key === cellValue;
                    });
                    return obj!=undefined?obj.name:'';
                }
            },
            {
                title: this.$t('equipment.meaPoint.unit'),
                key: 'unit',
               // width: 80,
                formatter:(row, column, cellValue, index)=>{
                    //获得测量单位
                    let obj = this.unitList.find(item => {
                        return item.key === cellValue
                    });
                    return obj!=undefined?obj.name:'';
                }
            },
            {
                title: this.$t('equipment.meaPoint.meaPointPurpose'),
                key: 'measurePurpose',
                //width: 80,
                showOverflowTooltip:true,
                formatter:(row, column, cellValue, index)=>{
                    let obj = this.measurePurposeList.find(item => {
                        return item.key === cellValue;
                    });
                    return obj!=undefined?obj.name:'';
                }
            } */
          ],
          nativeProp: {
            // d2-crud-x 原生属性
            // options: {
            //   showHeader: false                        // 例：隐藏表头
            // }
          }
        },
        // 树控件属性
        treeProp: {
          title: this.$t('equipment.meaPoint.meaPointType'),
          nodeKey: 'key',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.loadTreeData,
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
          selectData: [] //存储选中树的数据
        }
      }
    }
  },
  created() {
    // 数据字典：测点用途、参数类型，计量单位
    const param = { typeKey: 'clcj,sbjscslx,jldw,' }
    window.apiList['common/index'].getDictByTypeKeyExtend(param).then(res => {
      this.measurePurposeList = res?.data.clcj
      this.parmTypeList = res?.data.sbjscslx
      this.unitList = res?.data.jldw
    })
    // 获得当前人的信息
    this.userInfo = getLoginInfo()
    // if(this.userInfo.company.companyId){
    //     this.eqMeasurePointDialogProp.toolbarProp.searchData.companyId = this.userInfo.company.companyId
    // }
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['equipment/index'].eqMeaPointPage(par)
    },
    /**
     * 查询操作
     */
    onEqMeasurePointDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.EqMeasurePointDialogTable.tableQuery(params)
      } else {
        this.$refs.EqMeasurePointDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    EqTechnicalParDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.mpComment
    },
    onReset() {
      this.eqMeasurePointDialogProp.toolbarProp.searchData.catId = ''
    },
    //--------------------树节点相关----------------------------
    /**
     * 树节点点击事件处理
     * 返回 对象，用于表单查询条件
     * 返回 null 不进行查询，可自定义一些处理
     */
    treeClickNodeHandle(node) {
      //查询列表
      // 表格加载数据初始化
      this.eqMeasurePointDialogProp.toolbarProp.searchData.catId = node.key //节点值作为查询条件
      this.onEqMeasurePointDialogSearch(this.eqMeasurePointDialogProp.toolbarProp.searchData)
      // tree 节点点击，选中的值
      this.eqMeasurePointDialogProp.toolbarProp.selectData = node
    },
    // 加载树组件数据
    loadTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        // 初次加载一个根节点
        window.apiList['equipment/index'].eqMpCateTopTree('').then(res => {
          loadDone()
          let arr = res.data
          let exapandKeys = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
            exapandKeys[i] = res.data[i].key
          }
          //默认展开第一级节点下的树
          this.eqMeasurePointDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
          return resolve(arr)
        })
      }
      if (node.level != 0) {
        let id = node.data.key
        window.apiList['equipment/index'].eqMpCateSubTree(id).then(res => {
          let arr = res.data
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
          }
          resolve(arr)
          loadDone()
        })
      }
    },
    //--------------------树节点相关结束----------------------------
    /**
     * 弹出表格确定事件
     */
    onEqMeasurePointDialogTableOk(selected) {
      let mpNos = ''
      let mpComments = ''
      for (let index in selected) {
        mpComments += (selected[index]['column']['mpComment'] || '') + ','
        mpNos += (selected[index]['column']['mpNo'] || '') + ','
      }
      if (mpComments.lastIndexOf(',') !== -1) {
        mpComments = mpComments.substring(0, mpComments.length - 1)
      }
      if (mpNos.lastIndexOf(',') !== -1) {
        mpNos = mpNos.substring(0, mpNos.length - 1)
      }
      this.selectData = {
        ids: mpNos,
        names: mpComments,
        selected: selected
      }
      // this.$emit('onDTableOk', selected);
      this.fatherMethod(this.selectData)
      // this.$refs.dialogTable.close();
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'mpNo',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ mpNo: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.EqMeasurePointDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.EqMeasurePointDialogTable.tableQuery(Object.assign(this.eqMeasurePointDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.EqMeasurePointDialogTable.tableQuery(this.eqMeasurePointDialogProp.toolbarProp.searchData)
          }
        }, 600)
      })
    }
    // --------------------弹出框相关----------------------------
  }
}
</script>
<style scoped></style>
