<template>
  <!--操作按钮-->
  <div class="panel panel-default form-editor-buttons">
    <div class="panel-heading">
      <slot v-if="$slots.title" :title="title" name="title" />
      <span v-else> {{ title }}</span>
      <div v-if="formType==='sub'" class="ibps-fr">
        <el-dropdown trigger="click" @command="addButton">
          <span class="el-dropdown-link">
            <i class="el-icon-circle-plus-outline" />
            添加按钮
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            >
              <template v-for="button in buttonTypes">
                <el-dropdown-item
                  :key="button.type"
                  :command="button.type"
                  :disabled="button.disabled"
                  :divided="button.divided"
                >
                  <i :class="button.icon" />{{ button.label }}
                </el-dropdown-item>
              </template>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="panel-body">
      <slot name="other" />
      <div v-if="formType!=='sub'" class="panel-heading">
        <span>按钮</span>
        <div class="ibps-fr">
          <el-dropdown trigger="click" @command="addButton">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus-outline" />
              添加按钮
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-scrollbar
                tag="div"
                wrap-class="el-select-dropdown__wrap"
                view-class="el-select-dropdown__list"
              >
                <template v-for="button in buttonTypes">
                  <el-dropdown-item
                    :key="button[typeKey]"
                    :command="button[typeKey]"
                    :disabled="button.disabled"
                    :divided="button.divided"
                  >
                    <i :class="button.icon" />{{ button.label }}
                  </el-dropdown-item>
                </template>
              </el-scrollbar>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="choices">
        <vuedraggable
          v-model="buttons"
          v-bind="draggableOptions"
          @start=" isDragging = true"
          @end=" isDragging = false"
        >
          <div v-for="(button,i) in buttons" :key="i" class="option draggable">
            <div class="actions-left">
              <span><i :class="'ibps-icon-'+button.icon" />{{ button.label }}</span>
            </div>
            <el-button-group class="button-actions">
              <el-tooltip content="设置" placement="top">
                <el-button size="small" type="text" icon="el-icon-setting" @click="settingButton(i)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button size="small" type="text" icon="el-icon-delete" @click="removeButton(i)" />
              </el-tooltip>
              <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </vuedraggable>
      </div>
      <div v-if="buttons.length===0" class="el-table__empty-block">
        <span class="el-table__empty-text">未设置按钮</span>
      </div>
    </div>
    <!--设置操作按钮--->
    <edit-button
      v-if="buttonDialogVisible"
      ref="editButton"
      :visible="buttonDialogVisible"
      :title="editTitle"
      :form-type="formType"
      :type-key="typeKey"
      :data="editData"
      :fields="fields"
      :combination-fields="combinationFields"
      :columns="columns"
      :bo-fields="boFields"
      :field-item="fieldItem"
      :form-key="formKey"
      :button-codes="buttonCodes"
      @close="visible => buttonDialogVisible = visible"
      @callback="handleButton"
    />
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import { defaultsDeep } from 'lodash'
import EditButton from './edit-button'
export default {
  components: {
    vuedraggable,
    EditButton
  },
  props: {
    combinationFields: { // 组合表单字段
      type: Array
    },
    title: {
      type: String,
      default: '操作按钮'
    },
    value: {
      type: Array
    },
    formType: {
      type: String,
      default: 'sub'
    },
    typeKey: {
      type: String,
      default: 'type'
    },
    buttonTypes: {
      type: Array
    },
    defaultButtonValue: {
      type: Object
    },
    defaultButtonTypes: {
      type: Object
    },
    fields: Array, // 表单所有字段
    columns: Array, // 子表字段
    boFields: Array, // 当前子表BO字段
    fieldItem: Object,
    formKey: {
      type: String
    }
  },
  data() {
    return {
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        axis: 'y'
      },
      buttonDialogVisible: false,
      editTitle: '',
      editIndex: -1,
      editData: {},
      buttons: []
    }
  },
  computed: {
    buttonCodes() {
      const b = []
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i]
        if (this.editIndex !== i && this.allowMultiple(button[this.typeKey])) {
          b.push(button.code)
        }
      }
      for (const type in this.defaultButtonTypes) {
        if (!this.allowMultiple(type)) {b.push(type)}
      }
      return b
    },
    buttonTypeMap() {
      return JSON.parse(JSON.stringify(this.defaultButtonTypes))
    }
  },
  watch: {
    value: {
      handler(val) {
        this.buttons = val || []
      },
      deep: true,
      immediate: true
    },
    buttons: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.buttons = null
  },
  methods: {
    allowMultiple(type) {
      return type === 'custom' || type === 'sefStartFlow' || type === 'customDetail'
    },
    // =====================按钮======================
    getButtonType(type) {
      return this.buttonTypeMap[type] || {}
    },
    /**
     * 添加按钮
     */
    addButton(type) {
      if (this.allowMultiple(type)) {
        this.addCustomButton(type)
      } else {
        const button = this.getButtonType(type)
        button.scope = null
        button[this.typeKey] = type
        button.position = 'all'
        if (this.formType === 'combination' && type !== 'close') {
          this.addCombinationButton(button)
        } else {
          this.buttons.push(button)
        }
      }
      if (type === 'export' || type === 'import') {
        this.settingButton(this.buttons.length - 1)
      }
    },
    addCombinationButton(button) {
      button.custom_mode = 'data'
      button.custom_method = 'POST'
      const editButton = defaultsDeep(JSON.parse(JSON.stringify(button)), this.defaultButtonValue)
      this.editData = this.buildButton(editButton)
      this.editIndex = -1
      this.editTitle = '添加按钮'
      this.buttonDialogVisible = true
    },
    addCustomButton(type) {
      const button = this.getButtonType(type)
      button.scope = null
      button[this.typeKey] = type
      button.position = 'all'
      if (this.formType === 'combination' && type === 'custom') {
        button.custom_mode = 'data'
        button.custom_method = 'POST'
      }
      const editButton = defaultsDeep(JSON.parse(JSON.stringify(button)), this.defaultButtonValue)
      this.editData = this.buildButton(editButton)
      this.editIndex = -1
      this.editTitle = `添加【${button.label}】按钮`
      this.buttonDialogVisible = true
    },
    /**
     * 删除按钮
     */
    removeButton(i) {
      this.buttons.splice(i, 1)
    },
    /**
     * 设置按钮
     */
    settingButton(index) {
      const data = this.$utils.isNotEmpty(index) ? this.buttons[index] : {}
      const editButton = defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultButtonValue)
      this.editData = this.buildButton(editButton)
      const button = this.getButtonType(this.editData[this.typeKey])
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.editTitle = (this.$utils.isNotEmpty(index) ? '设置' : '添加') + `【${button.label}】按钮`
      this.buttonDialogVisible = true
      this.$nextTick(() => {
        this.$refs['editButton'].callbackData()
      })
    },
    buildButton(editButton) {
      const button = this.getButtonType(editButton[this.typeKey] || editButton.key)
      if (this.$utils.isNotEmpty(button)) {
        editButton.position = editButton.position ? editButton.position : button.position
        editButton.style = editButton.style ? editButton.style : button.style
      }
      return editButton
    },
    handleButton(button) {
      if (this.editIndex > -1) {
        this.buttons.splice(this.editIndex, 1, button)
      } else {
        this.buttons.push(button)
      }
    }
  }
}
</script>
<style lang="scss">
.form-editor-buttons {
  .panel-body > .panel-heading {
    margin-bottom: 5px;
    color: #333333;
    background-color: #f5f5f5;
  }
  .choices {
    .option {
      position: relative;
      margin-bottom: 5px;
      border: 1px solid transparent;
      background-color: #f5f7fa;
      padding: 5px 0 5px 20px;
      .actions-left{
        height: 24px;
        line-height: 24px;
      }
      .el-input {
        display: inline-block;
        width: 35%;
        vertical-align: middle;
      }
      .el-checkbox{
          margin-right: 10px;
      }
      .column-actions{
        position: absolute;
        width: 40px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 5px;
        background: #e7f1f1;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
            cursor: move
        }
      }
      .button-actions {
        position: absolute;
        width: 60px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 5px;
        background: #e7f1f1;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
            cursor: move
        }
      }
    }
  }
  .more-actions {
    text-align: right;
    margin-top: 10px;
    margin-right:10px;
    .el-button {
      border-right: 1px solid #D9D9D9;
      padding-right: 4px;
      margin-right: 2px;
    }
  }
  .other-choice-input {
    width: 100px  !important;
    margin-top: -3px;
    margin-left: 4px;
    background: rgba(255,255,255,0.65);
    height: 2em;
  }
}
// .sortable-ghost{
//   border: 1px dashed #C3C9D0;
//   margin-bottom: 5px
// }
</style>
