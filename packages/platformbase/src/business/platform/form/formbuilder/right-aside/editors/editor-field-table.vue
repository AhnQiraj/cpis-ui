<template>
  <div class="form-editor-table">
    <!--子表字段-->
    <div class="panel panel-default">
      <div class="panel-heading">
        <span>子表字段</span>
        <div class="ibps-fr">
          <el-dropdown trigger="click" @command="addColumn">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus-outline" />
              添加字段
            </span>
            <el-dropdown-menu slot="dropdown" class="field-type-dropdown">
              <el-scrollbar
                tag="div"
                wrap-class="el-select-dropdown__wrap"
                view-class="el-select-dropdown__list"
              >
                <template v-for="field in fieldTypes">
                  <el-dropdown-item
                    :key="field.key"
                    :command="field.field_type"
                    :divided="field.divided"
                  >
                    <i :class="field.icon" />{{ field.label }}
                  </el-dropdown-item>
                </template>
              </el-scrollbar>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="panel-body">
        <div class="choices">
          <vuedraggable v-model="columns" v-bind="draggableOptions" @start=" isDragging = true" @end=" isDragging = false">
            <div v-for="(column,i) in columns" :key="i" class="option draggable">
              <div class="actions-left" @click="settingColumn(column)">
                <span><i :class="fieldTypesMap[column.field_type].icon" /> {{ column.label }}</span>
              </div>
              <el-button-group class="column-actions">
                <el-button size="small" type="text" icon="el-icon-delete" @click="removeColumn(i)" />
                <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </div>
          </vuedraggable>
        </div>
        <div v-if="columns.length===0" class="el-table__empty-block">
          <span class="el-table__empty-text">未设置字段</span>
        </div>
      </div>
    </div>
    <!--操作按钮-->
    <funtion-buttons
      v-if="relation !=='one2one'"
      v-model="buttons"
      :fields="fields"
      :columns="columns"
      :bo-fields="subBoFields"
      :field-item="fieldItem"
      :button-types="buttonTypes"
      :default-button-value="defaultButtonValue"
      :default-button-types="defaultButtonTypes"
    />
    <!-- 标识设置 -->
    <!-- <div class="panel panel-default">
      <div class="panel-heading">
        <span>导入导出标识</span><ibps-help
          content="
          设置子表的导出/导入的标识字段，
          请勿将主键和外键设置为标识且设置的标识必须是存在于表单中，
          如果设置的值控件为隐藏域，请在导出设置处勾选导出该字段，如果不是则不需要。
          "
        />
      </div>
      <div class="panel-body">
        <el-select
          :value="identifica"
          style="width:100%"
          clearable
          @change="changeIdentifica"
        >
          <el-option
            v-for="(column,i) in columns"
            :key="i"
            :value="column.name"
            :label="column.label"
          />
        </el-select>
      </div>
    </div> -->
  </div>
</template>
<script>
import FIELD_TYPES, { getTableFieldTypesByFormType } from '../../../constants/fieldTypes'
import BUTTON_TYPES, { getTableButtonsByFormType } from '@platform/business/platform/form/constants/tableButtonTypes'
import { manage } from '@platform/api/platform/bo/boDef'
import { getDefaultAttributes } from '../../utils'
import EditorMixin from '../mixins/editor'
import FuntionButtons from '../components/function-buttons'
export default {
  components: {
    FuntionButtons
  },
  mixins: [EditorMixin],
  data() {
    const identification = {
      code: '',
      desc: '',
      field_name: '',
      field_options: {},
      field_type: 'hidden',
      id: '',
      isSub: true,
      label: '',
      name: ''
    }
    return {
      identification,
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        axis: 'y'
      },
      fieldTypesMap: FIELD_TYPES,
      defaultButtonTypes: BUTTON_TYPES,
      defaultButtonValue: {
        type: '',
        code: '',
        label: '',
        position: '',
        style: '',
        icon: '',
        enabledCustom: 'N',
        dialog: '',
        custom: {
          link_condition: [],
          link_linkage: []
        }
      }
    }
  },
  computed: {
    fieldTypes() {
      return getTableFieldTypesByFormType(this.formType)
    },
    columns: {
      get() {
        return this.fieldItem.field_options.columns ? this.fieldItem.field_options.columns || [] : []
      },
      set(value) {
        this.fieldItem.field_options.columns = value
      }
    },
    buttons: {
      get() {
        return this.fieldOptions ? this.fieldOptions.buttons || [] : []
      },
      set(value) {
        this.fieldItem.field_options.buttons = value
      }
    },
    buttonTypes() {
      const tableButtonTypes = getTableButtonsByFormType(this.formType)
      return tableButtonTypes.map((button) => {
        if (this.buttons && this.buttons.length > 0) {
          button.disabled = button.type === 'custom' ? false : this.buttons.findIndex((btn) => {
            return btn.type === button.type
          }) > -1
        } else {
          button.disabled = false
        }
        return button
      })
    },
    mode() {
      return this.fieldItem.field_options.mode || 'inner'
    },
    code() {
      return this.fieldItem.name
    },
    subBoFields() {
      if (this.$utils.isEmpty(this.boData)) {
        return []
      }
      if (this.$utils.isNotEmpty(this.code)) {
        return this.boData.filter((bo) => {
          return bo.attrType === 'subField' && bo.tableName === this.code
        })
      } else {
        return []
      }
    },
    masterBoFileds() {
      return this.boData.filter(bo => bo.attrType === 'table')
    },
    relation() {
      return this.fieldItem.field_options.relation || 'one2more'
    }
  },
  watch: {
    fieldItem: {
      handler: function(val) {
        this.filterSubPk(val)
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.fieldTypesMap = null
    this.defaultButtonValue = null
  },
  methods: {
    filterSubPk(fieldItem) {
      if (this.$utils.isEmpty(this.masterBoFileds)) {
        return
      }
      const paramsId = this.masterBoFileds[0].id
      const code = fieldItem.code
      manage({
        boDefId: paramsId
      }).then(response => {
        const data = JSON.parse(response.data)
        const subBoDefs = data.subBoDefs
        if (this.$utils.isEmpty(subBoDefs)) {
          return
        }
        subBoDefs.forEach(e => {
          if (e.code === code) {
            this.changeIdentifica(e.pk)
            const index = e.attrs.findIndex(a => a.code === e.pk)
            this.getPkFileds(e.attrs[index], code)
          }
        })
      })
    },
    // 整合子表pk作为唯一标识值得部分属性
    getPkFileds({ code, name, id }, subTableCode) {
      this.identification.code = subTableCode
      this.identification.name = code
      this.identification.field_name = code
      this.identification.label = name + '(标识勿删)'
      this.identification.name = code
      this.identification.id = id
      const isSameIndex = this.columns.findIndex(c => c.name === code)
      if (isSameIndex < 0) {
        this.columns.unshift(this.identification)
      }
    },
    changeIdentifica(data) {
      this.$set(this.fieldItem.field_options, 'identification', data)
    },
    /**
     * 添加字段
     */
    addColumn(type) {
      const column = getDefaultAttributes(FIELD_TYPES[type])
      const id = this.$utils.guid()
      column.id = id
      this.columns.push(column)
    },
    /**
     * 删除字段
     */
    removeColumn(i) {
      this.columns.splice(i, 1)
    },
    /**
     * 设置字段
     */
    settingColumn(column) {
      column.code = this.fieldItem.name
      column.isSub = true
      this.$emit('select', column)
    }
  }
}
</script>
<style lang="scss">
.form-editor-table {
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
