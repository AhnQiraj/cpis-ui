<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="70%" top="5vh" class="ibps-dialog-80 ibps-display-field" @opened="openDialog" @close="closeDialog">
    <ibps-layout ref="layout">
      <el-row :gutter="10">
        <el-col :span="16">
          <div style="border-bottom: 1px solid #dcdfe6">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" class="ibps-pb-5" @change="handleCheckAllChange">{{ $t('components.display-field.selectAll') }}</el-checkbox>
          </div>
          <el-checkbox-group v-model="checkFields" @change="handleCheckFieldsChange">
            <el-row :gutter="10">
              <el-col v-for="field in fields" :key="field[nameKey]" :span="6" class="ibps-pt-10">
                <el-checkbox :disabled="isDisabled(field)" :label="field[nameKey]">{{ field.label }}</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-col>
        <el-col :span="8">
          <div
            class="selected-fields"
            :style="{
              height: height + 'px'
            }"
          >
            <div class="el-alert el-alert el-alert--info is-light ibps-pl-0" role="alert">
              <div class="el-alert__content">
                <span class="el-alert__title">
                  {{ $t('components.display-field.selectedField') }}
                  <el-tooltip effect="dark" :content="$t('components.display-field.tip')">
                    <ibps-icon name="help" />
                  </el-tooltip>
                </span>
                <i class="el-alert__closebtn is-customed" style="color: #409eff" @click="handleClean()">
                  {{ $t('components.display-field.clean') }}
                </i>
              </div>
            </div>
            <el-scrollbar
              :style="{
                height: height - 35 + 'px'
              }"
              wrap-class="ibps-tree-wrapper ibps-scrollbar-wrapper"
            >
              <vuedraggable v-if="columns && columns.length > 0" v-model="columns" v-bind="draggableOptions" class="list-group" @start="isDragging = true" @end="moveColumns">
                <div v-for="(column, i) in columns" :key="column[nameKey] + '' + i" class="list-group-item">
                  <div class="actions-left">
                    {{ column.label }}
                  </div>
                  <div class="actions-right">
                    <el-input v-model="column.width" :placeholder="$t('components.display-field.width')" :min="1" size="mini" type="number" :controls="false" @keyup.native="provingWidth($event)" />
                  </div>
                  <el-button-group class="actions">
                    <el-button size="small" type="text" :disabled="isDisabled(column)" :title="$t('components.display-field.delete')" icon="el-icon-delete" @click="removeColumn(i)" />
                    <el-button size="small" class="draggable" :title="$t('components.display-field.sort')" data-role="sort_choice" type="text" icon="ibps-icon-arrows" />
                  </el-button-group>
                </div>
              </vuedraggable>
              <div v-else class="ibps-pt-20">
                <ibps-empty :desc="$t('components.display-field.noSelected')" />
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    </ibps-layout>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>
  </el-dialog>
</template>
<script>
import IbpsToolbar from '@platform/components/ibps-toolbar'
import vuedraggable from 'vuedraggable'
import { on, off } from 'element-ui/lib/utils/dom'
import { isFirefox } from 'element-ui/lib/utils/util'
export default {
  name: 'IbpsDisplayField',
  components: {
    IbpsToolbar,
    vuedraggable
  },
  props: {
    visible: Boolean,
    fields: Array,
    data: {
      type: Array,
      default: () => []
    },
    disableFields: {
      type: Array,
      default: () => []
    },
    nameKey: {
      type: String,
      default: 'prop'
    }
  },
  data() {
    return {
      title: this.$t('components.display-field.title'),
      height: 480,
      dialogVisible: false,
      checkFields: [],
      checkAll: false,
      isIndeterminate: false,
      isDragging: false,
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      columns: [],
      toolbars: [{ key: 'confirm' }, { key: 'reset', label: this.$t('components.display-field.reset'), type: 'warning', icon: 'ibps-icon-reply' }, { key: 'cancel' }]
    }
  },
  computed: {
    allFields() {
      const fields = []
      this.fields.forEach(field => {
        fields.push(field[this.nameKey])
      })
      return fields
    },
    fieldMap() {
      const fieldMap = {}
      this.fields.forEach(field => {
        fieldMap[field[this.nameKey]] = JSON.parse(JSON.stringify(field))
      })
      return fieldMap
    },
    columnMap() {
      const fieldMap = {}
      this.columns.forEach(field => {
        fieldMap[field[this.nameKey]] = JSON.parse(JSON.stringify(field))
      })
      return fieldMap
    }
  },
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
    // checkFields: {
    //   handler: function(val, oldVal) {
    //     if (val !== oldVal) {
    //       const columns = []
    //       this.checkFields.forEach((name) => {
    //         let column = this.columnMap[name]
    //         if (this.$utils.isEmpty(column)) {
    //           column = this.fieldMap[name]
    //           column.width = ''
    //         }
    //         columns.push(column)
    //       })
    //       this.columns = JSON.parse(JSON.stringify(columns))
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    // columns: {
    //   handler: function(val, oldVal) {
    //     console.info('xxxx', val)
    //     if (val !== oldVal) { this.setCheckFields() }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  mounted() {
    this.height = this.fixDialogHeight()
    on(document.body, 'resize', this.handleDialogHeightResize)
    if (isFirefox) {
      on(document.body, 'drop', event => {
        event.preventDefault()
        event.stopPropagation()
      })
    }
  },
  beforeDestroy() {
    off(document.body, 'resize', this.handleDialogHeightResize)
    if (isFirefox) {
      off(document.body, 'drop', event => {
        event.preventDefault()
        event.stopPropagation()
      })
    }
    this.checkFields = null
    this.draggableOptions = null
    this.columns = null
    this.toolbars = null
  },
  methods: {
    isDisabled(field) {
      return this.disableFields.indexOf(field[this.nameKey]) > -1
    },
    provingWidth(e) {
      const keynum = window.event ? e.keyCode : e.which // 获取键盘码
      if (keynum === 189 || keynum === 109) {
        e.target.value = ''
      }
    },
    handleDialogHeightResize() {
      this.height = this.fixDialogHeight()
    },
    fixDialogHeight() {
      const h = document.documentElement.clientHeight || document.body.clientHeight
      return h - 280
    },
    getCheckFields() {
      if (this.disableFields.length > 0) {
        return this.disableFields
      } else {
        return []
      }
    },
    moveColumns() {
      this.isDragging = false
    },
    handleCheckAllChange(val) {
      this.checkFields = val ? this.allFields : this.getCheckFields()
      this.isIndeterminate = false
      this.setAllColumns()
    },
    handleCheckFieldsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.fields.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fields.length
      this.setColumns()
    },
    setAllColumns() {
      if (this.checkFields.length > 0) {
        this.checkFields.forEach(name => {
          let column = this.columnMap[name]
          if (this.$utils.isEmpty(column)) {
            column = this.fieldMap[name]
            column.width = ''
            this.columns.push(column)
          }
        })
      } else {
        this.columns = []
      }
    },
    setColumns() {
      const columns = []
      this.checkFields.forEach(name => {
        let column = this.columnMap[name]
        if (this.$utils.isEmpty(column)) {
          column = this.fieldMap[name]
          column.width = ''
        }
        columns.push(column)
      })
      this.columns = columns
    },
    handleClean() {
      this.checkAll = false
      this.handleCheckAllChange(false)
    },
    // 删除字段
    removeColumn(i) {
      this.columns.splice(i, 1)
      this.setCheckFields()
      this.handleCheckFieldsChange(this.checkFields)
    },
    setCheckFields() {
      const checkFields = []
      this.columns.forEach(field => {
        checkFields.push(field[this.nameKey])
      })
      this.checkFields = checkFields
    },
    openDialog() {
      this.columns = JSON.parse(JSON.stringify(this.data))
      this.setCheckFields()
      this.handleCheckFieldsChange(this.checkFields)
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'reset':
          this.handleReset()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      if (this.$utils.isEmpty(this.columns)) {
        this.$message.warning(this.$t('components.display-field.noSelectedPrompt'))
        return
      }
      const data = []
      this.columns.forEach(column => {
        const d = {
          [this.nameKey]: column[this.nameKey],
          label: column.label
        }
        if (this.$utils.isNotEmpty(column.width)) {
          d['width'] = column.width
        }
        data.push(d)
      })
      this.$emit('callback', data)
    },
    handleReset() {
      this.$emit('callback')
    }
  }
}
</script>
<style lang="scss">
.ibps-display-field {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .selected-fields {
    background: #fff;
    border: 1px solid #dcdfe6;
    .list-group {
      display: flex;
      flex-direction: column;
      padding-left: 0;
      margin-bottom: 0;
      .list-group-item {
        position: relative;
        display: block;
        padding: 5px;
        margin-top: 5px;
        // border: 1px solid #ddd;
        .actions-left {
          height: 28px;
          line-height: 28px;
          margin-left: 5px;
        }
        .actions-right {
          position: absolute;
          width: 90px;
          top: 6px;
          right: 55px;
          line-height: 28px;
          padding-left: 1px;
        }
        .actions {
          position: absolute;
          width: 50px;
          top: 4px;
          right: 0;
          line-height: 28px;
          padding-left: 1px;
          .el-button {
            padding-right: 4px;
            margin-right: 2px;
          }
          [data-role='sort_choice'] {
            cursor: move;
          }
        }
        .sort-column-actions {
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
      margin-right: 10px;
      .el-button {
        padding-right: 0;
        margin-right: 0;
      }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }
  }
  .el-checkbox__label {
    word-break: normal;
    width: auto;
    display: inline-grid;
    white-space: pre-line;
    word-wrap: break-word;
    overflow: hidden;
    line-height: 18px;
  }
}
</style>
