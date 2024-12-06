<template>
  <div class="container">
    <div class="flex flex-col gap-1">
      <div class="bg-white p-1 flex flex-row gap-1">
        <CpisSearchInput v-model="searchForm.code" label='上煤单号' placeholder='请输入' />
        <CpisSearchInput v-model="searchForm.code2" label='上煤单号' placeholder='请输入'  />
        <CpisSearchInput v-model="searchForm.code3" label='上煤单号' placeholder='请输入'  />
        <CpisSearchInput v-model="searchForm.code4" label='上煤单号' placeholder='请输入'  />
        <CpisButton type="primary">搜索</CpisButton>
        <CpisButton>重置</CpisButton>
      </div>
      <div class="bg-white p-1 flex bodyContainer">
        <div>
          <CpisButton type="primary" @click="drawer = true"
            >新增
          </CpisButton>
          <CpisButton >修改</CpisButton>
          <CpisButton >删除</CpisButton>
        </div>
        <ElTable
          border
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5', color: '#000' }"
          size="small"
        >
          <el-table-column prop="index" label="序号" width="50" align="center">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="上煤单号"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="上煤单号"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="上煤日期"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="皮带秤重量（t）"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="修订重量（t）"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="上煤量（t）"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="耗用类型（t）"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="期号（t）"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="班次（t）"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="值号"
            width="180"
          ></el-table-column>
        </ElTable>
      </div>
    </div>
    <el-drawer :visible.sync="drawer" direction="rtl" title="123">


    </el-drawer>
  </div>
</template>

<script>
import { Table, TableColumn, Drawer, DatePicker, Input } from 'element-ui'
import CpisButton from '../../../../packages/cpis-ui/src/packages/button/index'
import CpisSearchInput from '../../../../packages/cpis-ui/src/packages/search-input/index'
import 'element-ui/lib/theme-chalk/index.css'

export default {
  name: 'my-button',
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    CpisButton: CpisButton,
    ElDrawer: Drawer,
    CpisSearchInput: CpisSearchInput,
    ELInput: Input,
    ELDatePicker: DatePicker
  },
  data() {
    return {
      drawer: false,
      searchForm: {
        code: '',
        code2: '',
        code3: '',
        code4: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          code: 'RL20241018001',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          code: 'RL20241018002',

          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          code: 'RL20241018003',

          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          code: 'RL20241018004',

          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },

  props: {},

  computed: {
    classes() {
      return {
        'storybook-button': true,
        'storybook-button--primary': this.primary,
        'storybook-button--secondary': !this.primary,
        [`storybook-button--${this.size}`]: true
      }
    },
    style() {
      return {
        backgroundColor: this.backgroundColor
      }
    }
  },

  methods: {
    onClick() {
      this.$emit('onClick')
    }
  }
}
</script>
<style scoped>
.bodyContainer {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

</style>
