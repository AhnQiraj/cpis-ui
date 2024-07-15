<template>
  <div class="service-parameter">
    <div v-if="!readonly" class="ibps-pb-5 ibps-pl-5">
      <el-button icon="ibps-icon-add" type="primary" plain @click="addParam">添加参数</el-button>
    </div>
    <el-table v-if="loading" ref="table" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="!readonly" align="center" label="" width="50">
        <ibps-icon name="list-ol" class="draggable" title="排序" />
      </el-table-column>
      <el-table-column label="参数名">
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row.name" placeholder="参数名" />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="requestType !== 'headers'" label="数据类型" width="120">
        <template slot-scope="scope">
          <el-select v-if="!readonly" v-model="scope.row.dataType" @change="changeDataType(scope)">
            <el-option
              v-for="option in dataTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <span v-else>{{ scope.row.dataType|optionsFilter(dataTypeOptions,'label') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值/表达式">
        <template slot-scope="scope">
          <el-button
            v-if="!readonly && scope.row.dataType==='bind'"
            style="width:100%;"
            @click="changeVisible(scope.row)"
          >编辑途径</el-button>
          <el-input v-else-if="!readonly" v-model="scope.row.defaultValue" placeholder="值/表达式" />
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
      <el-table-column v-if="!readonly" width="50" label="操作">
        <template slot-scope="scope">
          <el-tooltip
            :content="'移除'"
            effect="dark"
            placement="top"
          >
            <el-link :underline="false" type="danger" icon="ibps-icon-delete" @click="removeRow(scope.row.$index)" />
          </el-tooltip>
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
import { dataTypeOptions } from '../constants'
import FormScript from './form-script'
import Sortable from 'sortablejs'
export default {
  components: {
    FormScript
  },
  props: {
    data: Array,
    readonly: {
      type: Boolean,
      default: false
    },
    requestType: String,
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
      list: [],
      loading: false,
      sortable: null,
      dataTypeOptions,
      formScriptVisible: false,
      editData: {}
    }
  },
  watch: {
    readonly: {
      handler: function(val) {
        if (val) {
          this.loading = false
        } else {
          this.loading = false
          setTimeout(() => {
            this.loading = true
            this.$nextTick(() => {
              this.setSort()
            })
          }, 1)
        }
      },
      immediate: true
    },
    data: {
      handler: function(val) {
        this.list = val || []
      },
      immediate: true,
      deep: true
    },
    list: {
      handler(val, oldVal) {
        this.$emit('update:data', val)
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.list = null
    this.sortable = null
    this.dataTypeOptions = null
  },
  methods: {
    changeDataType({ row, $index }) {
      row.defaultValue = ''
    },
    changeVisible(data) {
      this.editData = data
      this.formScriptVisible = !this.formScriptVisible
    },
    handleScript(data) {
      this.$set(this.editData, 'defaultValue', data)
      this.editData = {}
    },
    getDefaultRow() {
      const id = this.$utils.guid()
      return {
        'id': id,
        'name': '',
        'dataType': 'string',
        'defaultValue': '',
        'isRequire': 'Y',
        'testValue': '',
        'desc': ''
      }
    },
    addParam() {
      this.list.push(this.getDefaultRow())
    },
    removeRow(index) {
      this.list.splice(index, 1)
    },
    setSort() {
      if (this.readonly) {return}
      if (this.$utils.isEmpty(this.$refs) ||
      this.$utils.isEmpty(this.$refs.table) ||
      this.$utils.isEmpty(this.$refs.table.$el)
      ) {return}
      const el = this.$refs.table.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      if (this.$utils.isEmpty(el)) {return}
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        handle: '.draggable',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .service-parameter{
    .sortable-ghost{
        opacity: .8;
        color: #fff!important;
        background: #b3a181!important;
      }
      .drag-handler{
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
  }
</style>
