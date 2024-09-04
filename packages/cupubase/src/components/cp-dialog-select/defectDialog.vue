<template>
  <z-dialog-table
    ref="dfDiaTb"
    :title="dfProp.title"
    :key_="dfProp.key"
    :toolbar-prop="dfProp.toolbarProp"
    :table-prop="dfProp.tableProp"
    :tree-prop="dfProp.treeProp"
    :selection-handle="dfProp.selectionHandle"
    @toolbar-search="onDfSearch"
    @ok="onDfOk">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')">
        <el-input v-model="dfProp.toolbarProp.searchData.keyword"></el-input>
      </el-form-item>
      <el-form-item :label="$t('defect.common.defectLev')">
        <vxe-select
          v-model="dfProp.toolbarProp.searchData.dfLevelNo"
          :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('defect.common.defectLev') })"
          clearable>
          <vxe-option v-for="(value, key) in levelArr" :key="key" :value="key" :label="value" />
        </vxe-select>
      </el-form-item>
      <el-form-item :label="$t('defect.defInfo.skillNo')">
        <vxe-select
          v-model="dfProp.toolbarProp.searchData.skillNo"
          :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('defect.defInfo.skillNo') })"
          clearable>
          <vxe-option v-for="item in skillNos" :key="item.key" :value="item.key" :label="item.name" />
        </vxe-select>
      </el-form-item>
      <el-form-item :label="$t('defect.common.locaName')">
        <el-input v-model="dfProp.toolbarProp.searchData.locaName"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'DefectDialogSelect',
  props: {
    multipleSelect: {
      type: Boolean,
      default: false
    },
    /**
     * 初始化条件
     * :initParam="{woTypeNo:'ta_pw'}"
     * 只查询定期工单
     */
    initParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectedIds: {
      type: String
    },
    selectedNames: {
      type: String
    },
    siteId: {
      type: String
    },
    woId: {
      type: String
    }
  },
  data() {
    return {
      skillNos: [],
      levelArr: [],
      dfProp: {
        title: this.$t('defect.chooseDf'),
        selectionHandle: this.dfSelection,
        key: 'id',
        toolbarProp: {
          // 搜索数据
          searchData: {
            keyword: '',
            dfLevelNo: '',
            skillNo: '',
            locaName: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.findDfPage, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            { title: this.$t('defect.common.defectNo'), key: 'dfNo' },
            { title: this.$t('defect.defInfo.mtnTeamName'), key: 'mtnTeamName' },
            { title: this.$t('defect.common.defectCom'), key: 'dfDesp' },
            {
              title: this.$t('defect.common.defectLev'),
              key: 'dfLevelNo',
              formatter: (row, column) => this.levelArr[row[column.key]]
            },
            { title: this.$t('defect.defInfo.findperson'), key: 'findperson' },
            {
              title: this.$t('defect.defInfo.skillNo'),
              key: 'skillNo',
              formatter: (row, column) => {
                let name = ''
                this.skillNos.forEach(item => {
                  if (item.key == row.skillNo) {
                    name = item.name
                  }
                })
                return name
              }
            },
            { title: this.$t('defect.defInfo.mtnPerson'), key: 'mtnPerson' },
            { title: this.$t('defect.common.locaName'), key: 'locaName' }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    }
  },
  mounted() {
    this.getLevelData()
  },
  methods: {
    getLevelData() {
      // 获取等级数据
      window.apiList['defect/index']
        .getLevelData({})
        .then(res => {
          if (res.data) {
            this.levelArr = res.data
          }
        })
        .catch(e => {
          console.log(e)
        })
      const param = { typeKey: 'qxlx,zybm' }
      window.apiList['common/index'].getDictByTypeKeyExtend(param).then(res => {
        this.skillNos = res?.data.zybm
      })
    },
    /**
     * 初始化
     * initParam:可以传初始化条件,被融合进去,用于第一次查询
     * @author mbb
     */
    init(initParam) {
      if (initParam) {
        this.initParam = Object.assign(this.initParam, initParam)
      }
      this.selectDf()
    },
    /**
     * 查询主票
     * @author mbb
     */
    selectDf() {
      let selected = { key: 'id', data: [] }
      if (this.selectedIds !== undefined && this.selectedNames !== undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            id: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.dfDiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.dfDiaTb.tableQuery(this.initParam)
        }, 600)
      })
    },
    /**
     * 查询数据
     * @author mbb
     */
    findDfPage(parmas) {
      parmas = Object.assign(parmas, this.initParam)
      return new Promise((resolve, reject) => {
        window.apiList['defect/index'].findDefectPage(parmas).then(response => {
          response.data.records.forEach(item => {
            item.id = item.dfId
          })
          resolve(response)
        })
      })
    },
    onDfSearch(params) {
      // 加载列表数据
      const pa = {
        keyword: params.keyword,
        dfLevelNo: params.dfLevelNo,
        skillNo: params.skillNo,
        locaName: params.locaName
      }
      this.$refs.dfDiaTb.tableQuery(pa)
    },
    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { pageNo: pagination.pageNo, pageSize: pagination.total }
    },
    /**
     * 处理勾选数据展示
     */
    dfSelection(selection) {
      if (this.$utils.isEmpty(selection)) {
        return
      }
      return selection.dfNo
    },
    /**
     * 弹出表格确定事件
     */
    onDfOk(seleted) {
      this.$emit('onDTableOk', seleted)
    }
  }
}
</script>
<style scoped></style>
