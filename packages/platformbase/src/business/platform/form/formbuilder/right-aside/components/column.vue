<template>
  <div class="linkquery-column">
    <div>
      <span>{{ title }}<help-tip prop="linkqueryColumn" /></span>
      <div class="ibps-fr ibps-pr-10">
        <el-tooltip :content="'添加所有字段为'+title" placement="top">
          <i class="el-icon-circle-plus-outline el-dropdown-link" @click="addAllColumn" />
        </el-tooltip>
        <el-dropdown :hide-on-click="false" trigger="click" @command="addColumn">
          <el-tooltip :content="'添加'+title" placement="top">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus el-icon--right" />
            </span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            >
              <el-dropdown-item
                v-for="(field,index) in fields"
                :key="field.name+index"
                :disabled="isDisabled(field.name)"
                :command="field"
              >
                <i :class="'ibps-icon-'+field.type" />{{ field.label }}
              </el-dropdown-item>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="panel-body">
      <draggable
        v-if="columns && columns.length >0"
        v-model="columns"
        v-bind="draggableOptions"
        class="list-group"
        @start="isDragging = true"
        @end="()=>{isDragging= false}"
      >
        <div v-for="(column,i) in columns" :key="column.name||column.key+''+i" class="list-group-item">
          <div class="actions-left"> {{ column.label }} </div>
          <el-button-group class="actions" :class="{'sort-column-actions':prop==='sort_columns'}">
            <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
            <el-button size="small" class="draggable" title="拖动排序" data-role="sort_choice" type="text" icon="ibps-icon-arrows" />
          </el-button-group>
        </div>
      </draggable>
      <div v-else>
        <el-alert
          :closable="false"
          :title="'未设置'+title"
          type="info"
          center
        />
      </div>
    </div>
  </div>
</template>
<script>
import ActionUtils from '@platform/utils/action'
import vuedraggable from 'vuedraggable'
// import { rightsTypes } from '../constants'
export default {
  components: {
    draggable: vuedraggable
  },
  props: {
    title: {
      type: String
    },
    width: {
      type: String,
      default: '60%'
    },
    prop: {
      type: String
    },
    data: {
      type: [Array, Object],
      default: () => {}
    },
    fields: { // 字段
      type: [Array, Object],
      default: () => []
    },
    defaultValue: { // 默认值
      type: Object,
      default: () => {}
    },
    datasetType: {
      type: String,
      default: 'table'
    }
  },
  data() {
    return {
      isDragging: false,
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      rightsTypes: {},
      dialogVisible: false,
      editData: {},
      rightsData: [],
      editIndex: -1,
      dialogRightsVisible: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    columns: {
      get() {
        return this.data || []
      },
      set(value) {
        this.handleInput(value)
      }
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.rightsTypes = null
    this.editData = null
    this.toolbars = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 添加字段
    addAllColumn() {
      const columns = this.columns
      const columnMap = {}
      columns.forEach(column => {
        columnMap[column.name] = column
      })
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        if (!columnMap[field.name]) {
          const column = {
            label: field.label,
            name: field.name,
            hidden: false
          }
          columns.push(column)
        }
      }
      this.handleInput(columns)
    },
    // 添加字段
    addColumn(field) {
      const columns = this.columns
      const column = {
        label: field.label,
        name: field.name
      }
      columns.push(column)
      this.handleInput(columns)
    },
    //  添加过滤条件
    addFilterConditions() {
      this.editIndex = -1
      const data = JSON.parse(JSON.stringify(this.defaultValue))
      data.key = this.$utils.guid()
      this.editData = data
      this.dialogVisible = true
    },
    // 删除字段
    removeColumn(i) {
      this.columns.splice(i, 1)
      this.handleInput(this.columns)
    },
    // 是否禁用
    isDisabled(key) {
      if (this.$utils.isEmpty(this.columns)) {
        return false
      } else {
        const columns = Object.prototype.toString.call(this.columns) !== '[object Array]' ? [this.columns] : this.columns
        return !!columns.find((column) => {
          return column.name === key
        })
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.$refs.editFormDialog.$slots.default[0].componentInstance.getFormData((data) => {
        if (!data) {
          ActionUtils.saveErrorMessage()
          return
        }
        if (this.editIndex > -1) {
          this.columns.splice(this.editIndex, 1, data)
        } else {
          this.columns.push(data)
        }
        this.handleInput(this.columns)
        this.closeDialog()
      })
    },
    handleInput(value) {
      this.$emit('input', this.prop, value)
    }
  }
}
</script>
<style lang="scss" scoped>
  .linkquery-column{
    margin-left: 10px;
    .panel-body{
      padding: 0;
      margin: 10px 0;
      .list-group-item{
        margin: 5px 0;
      }
    }
  }
.list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin: 5px;
    border: 1px solid #ddd;
    .actions-left{
      height: 24px;
      line-height: 24px;
      margin-left: 5px;
    }
    .actions {
      position: absolute;
      width: 40px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
    .sort-column-actions{
        width: 80px;
    }
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: right;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }
</style>
