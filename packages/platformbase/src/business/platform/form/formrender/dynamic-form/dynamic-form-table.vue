<template>
  <div v-if="!tableHidden" class="dynamic-form-table">
    <template v-if="columns && columns.length > 0">
      <!--================表内和弹窗模式=================================-->
      <div v-if="mode === 'inner' || mode === 'dialog'" class="dynamic-form-table__inner panel panel-info">
        <div
          v-if="!(fieldOptions.hidden_header || $utils.isEmpty(field.label)) ||
            ((field.field_options.grouping && $utils.isNotEmpty(getGroupingSettings)) ||
              ((toolbarButtons && toolbarButtons.length >0) || enableDisplayField))"
          class="panel-heading ibps-clearfix"
        >
          <div class="ibps-fl dynamic-form-table__label"><span v-if="!fieldOptions.hidden_header" v-html="formatLabel" />
            <!-- 分组条件配置的下拉菜单 -->
            <el-dropdown
              v-if="field.field_options.grouping && $utils.isNotEmpty(getGroupingSettings)"
              class="grouping-dropdown"
              trigger="click"
              @command="handleCommand"
            >
              <span class="el-dropdown-link">
                {{ $utils.isNotEmpty(groupingSetting)
                  ? groupingSetting === noGrouping
                    ? groupingSetting
                    : `按${groupingSetting.label}分组`
                  :'分组条件菜单' }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="noGrouping">{{ noGrouping }}</el-dropdown-item>
                <el-dropdown-item
                  v-for="(item,index) in getGroupingSettings"
                  :key="index"
                  :command="item"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 多级表单显示提示 -->
            <span v-if="$utils.isNotEmpty(parentKey)" class="ibps-ml-20" style="color:#F56C6C;"><i class="el-icon-warning-outline" />{{ prompt }}</span>
          </div>
          <div class="ibps-fr hidden-print">
            <el-button-group v-if="(toolbarButtons && toolbarButtons.length >0) || enableDisplayField">
              <template v-if=" toolbarButtons && toolbarButtons.length >0">
                <el-button
                  v-for="(button,index) in toolbarButtons"
                  :key="index"
                  :type="button.type"
                  :icon="button.icon"
                  @click="handleActionEvent(button,index)"
                >
                  {{ button.label }}
                </el-button>
              </template>
              <!--显示字段-->
              <el-button
                v-if="enableDisplayField"
                icon="ibps-icon-cog"
                class="dynamic-form-table___display—column"
                @click="displayFieldVisible=true"
              >{{ field.field_options.display_column_name?field.field_options.display_column_name:'自定义列' }}</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="panel-body" :class="isGrouping?'table-grouping':''">
          <template v-if="isGrouping">
            <div>
              <el-table
                ref="elTable"
                :data="groupingData"
                :row-class-name="tableRowClassName"
                :show-summary="showSummary"
                :sum-text="sumText"
                :summary-method="hasSummaryMethod?summaryMethod:defaultSummaryMethod"
                border
                stripe
                row-key="$index"
                default-expand-all
                :span-method="arraySpanMethod"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @selection-change="handleSelectionChange"
                @select-all="handleSelectionAll"
                @header-dragend="handleHeaderDragend"
                @row-click="rowClick"
              >
                <el-table-column
                  v-if="!tableReadonly"
                  type="selection"
                  width="50"
                />
                <el-table-column
                  v-if="field.field_options.index"
                  type="index"
                  :label="field.field_options.index_name?field.field_options.index_name:'序号'"
                  :width="field.field_options.index_width?field.field_options.index_width:50"
                >
                  <template slot-scope="scope">
                    {{ orderMap[prefix+scope.row.$index] }}
                  </template>
                </el-table-column>
                <template v-for="(column,j) in displayColumns">
                  <el-table-column
                    :key="j"
                    :prop="column.name"
                    :width="columnWidth(column)"
                    :min-width="columnMinWidth(column)"
                    :label-class-name="columnsRights[column.name]==='b'?'cell-required':null"
                    :class-name="columnFirst(column)?'table-column-first':''"
                  >
                    <template slot="header">
                      {{ columnLabel(column) }}
                      <ibps-help v-if="column && column.desc && descPosition==='lableIcon'" type="tooltip" :content="$utils.formatText(column.desc)" />
                    </template>
                    <template slot-scope="scope">
                      <template
                        v-if="$utils.isNotEmpty(scope.row.children)
                          && columnFirst(column)"
                      >
                        <div class="grouping-title">
                          <!-- <span class="grouping-head">{{ scope.row.headInformation }}</span>
                          <span class="grouping-add">{{ scope.row.addInformation }}</span> -->
                          <span>
                            {{ scope.row.headInformation }}
                            <span v-if="$utils.isNotEmpty(scope.row.headInformation) && $utils.isNotEmpty(scope.row.addInformation)" class="ibps-pr-20" />
                            {{ scope.row.addInformation }}
                          </span>
                        </div>
                      </template>
                      <template v-else-if="$utils.isNotEmpty(dataModel) && $utils.isEmpty(scope.row.children)">
                        <!-- <span v-if="columnFirst(column) && !tableReadonly" class="table-check">
                          <el-checkbox-group v-model="multipleSelection">
                            <el-checkbox :label="scope.row">{{ '' }}</el-checkbox>
                          </el-checkbox-group>
                        </span> -->
                        <ibps-dynamic-form-table-item
                          :ref="'formItem'+column.name"
                          :key="column.id"
                          :models.sync="scope.row"
                          :rights.sync="columnsRights"
                          :form-data="models"
                          :field="column"
                          :main-code="mainCode"
                          :code="code"
                          :row="scope.row.$index"
                          :mode="mode"
                          :params="params"
                          :parent-code="getCodeByParentKey(parentKey)"
                          :parent-row="parentRow"
                          :class="columnFirst(column)?'cell-div':''"
                          v-on="listeners"
                        />
                      </template>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column
                  v-if="manageButtons && manageButtons.length >0"
                  :width="manageButtonWidth"
                  :label="field.field_options.manage_name?field.field_options.manage_name:'操作' "
                  align="center"
                  fixed="right"
                  class-name="hidden-print"
                >
                  <template slot-scope="scope">
                    <template v-if="$utils.isNotEmpty(scope.row.children)" />
                    <el-dropdown v-else-if="manageButtons.length>2">
                      <ibps-icon name="chevron-circle-down" size="16" class="hidden-print" />
                      <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
                        <ibps-toolbar
                          :actions="manageButtons"
                          :socpe="thatSocpe"
                          :data="scope.row"
                          position="manage"
                          class="hidden-print"
                          @action-event="(action)=>handleActionEvent(action, scope.row.$index)"
                        />
                      </el-dropdown-menu>
                    </el-dropdown>
                    <template v-else>
                      <template v-for="(button,index) in manageButtons">
                        <el-link
                          :key="index"
                          :type="button.type"
                          :underline="false"
                          @click="handleActionEvent(button,scope.row.$index)"
                        >
                          {{ button.label }}
                        </el-link>
                        <el-divider v-if="manageButtons.length===2 && index===0" :key="index" direction="vertical" />
                      </template>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <el-table
            v-else
            ref="elTable"
            :data="pagingData"
            :row-class-name="tableRowClassName"
            :show-summary="showSummary"
            :sum-text="sumText"
            :summary-method="hasSummaryMethod?summaryMethod:defaultSummaryMethod"
            border
            stripe
            @selection-change="handleSelectionChange"
            @header-dragend="handleHeaderDragend"
            @row-click="rowClick"
          >
            <el-table-column
              v-if="!readonlyRights"
              type="selection"
              width="50"
            />
            <el-table-column
              v-if="field.field_options.index"
              type="index"
              :label="field.field_options.index_name?field.field_options.index_name:'序号'"
              :width="field.field_options.index_width?field.field_options.index_width:50"
            />
            <template v-for="(column,j) in displayColumns">
              <el-table-column
                :key="j"
                :prop="column.name"
                :width="columnWidth(column)"
                :min-width="columnMinWidth(column)"
                :label-class-name="columnsRights[column.name]==='b'?'cell-required':null"
              >
                <template slot="header">
                  {{ columnLabel(column) }}
                  <ibps-help v-if="column && column.desc && descPosition==='lableIcon'" type="tooltip" :content="$utils.formatText(column.desc)" />
                </template>
                <template slot-scope="scope">
                  <template v-if="$utils.isNotEmpty(dataModel) ">
                    <ibps-dynamic-form-table-item
                      :ref="'formItem'+column.name"
                      :key="column.id"
                      :models.sync="scope.row"
                      :rights.sync="columnsRights"
                      :form-data="models"
                      :field="column"
                      :main-code="mainCode"
                      :code="code"
                      :row="scope.row.$index"
                      :parent-code="getCodeByParentKey(parentKey)"
                      :parent-row="parentRow"
                      :mode="mode"
                      :params="params"
                      v-on="listeners"
                    />
                  </template>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              v-if="manageButtons && manageButtons.length >0"
              :width="manageButtonWidth"
              :label="field.field_options.manage_name?field.field_options.manage_name:'操作' "
              align="center"
              fixed="right"
              class-name="hidden-print"
            >
              <template slot-scope="scope">
                <el-dropdown v-if="manageButtons.length>2">
                  <ibps-icon name="chevron-circle-down" size="16" class="hidden-print" />
                  <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
                    <ibps-toolbar
                      :actions="manageButtons"
                      :socpe="thatSocpe"
                      :data="scope.row"
                      position="manage"
                      class="hidden-print"
                      @action-event="(action)=>handleActionEvent(action, scope.row.$index)"
                    />
                  </el-dropdown-menu>
                </el-dropdown>
                <template v-else>
                  <template v-for="(button,index) in manageButtons">
                    <el-link
                      :key="index"
                      :type="button.type"
                      :underline="false"
                      @click="handleActionEvent(button,scope.row.$index)"
                    >
                      {{ button.label }}
                    </el-link>
                    <el-divider v-if="manageButtons.length===2 && index===0" :key="index" direction="vertical" />
                  </template>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <template v-if="pageable && !isGrouping">
          <ibps-pagination
            :pagination="pagination"
            @pagination-change="handlePaginationChange"
          />
        </template>
        <el-button-group v-if="(bottomButtons && bottomButtons.length >0) " class="ibps-pt-10">
          <template v-if=" bottomButtons && bottomButtons.length >0">
            <el-button
              v-for="(button,index) in bottomButtons"
              :key="index"
              :icon="button.icon"
              type="text"
              @click="handleActionEvent(button,index)"
            >
              {{ button.label }}
            </el-button>
          </template>
        </el-button-group>
      </div>
      <!--================表内和弹窗模式end=================================-->
      <!--================块模式=================================-->
      <template v-else-if="mode === 'block'">
        <template v-if="$utils.isNotEmpty(dataModel) ">
          <!--一对一块模式--->
          <div v-if="isOne2One" class="dynamic-form-table__block panel panel-info">
            <div v-if="!(fieldOptions.hidden_header || $utils.isEmpty(field.label))" class="panel-heading ibps-clearfix">
              <!--一对一块模式：工具栏--->
              <div class="ibps-fl dynamic-form-table__label">
                <span v-html="formatLabel" />
              </div>
            </div>
            <!--块模式：表单-->
            <div class="panel-body">
              <ibps-dynamic-form-table-block
                v-for="column in columns"
                :ref="'formItem'+column.name"
                :key="column.name"
                :models.sync="dataModel"
                :rights.sync="columnsRights"
                :form-data="models"
                :field="column"
                :main-code="mainCode"
                :code="code"
                :row="0"
                :params="params"
                :table-params="tableFormParams"
                v-on="listeners"
              />
            </div>
          </div>
          <template v-else>
            <!--一对多块模式--->
            <template v-for="(data,index) in filterDel(dataModel) ">
              <div :key="index" class="dynamic-form-table__block panel panel-info">
                <div
                  v-if="!(fieldOptions.hidden_header || $utils.isEmpty(field.label)) ||
                    field.field_options.index ||
                    (toolbarButtons && toolbarButtons.length >0)"
                  class="panel-heading ibps-clearfix"
                >
                  <!--块模式：工具栏-->
                  <div class="ibps-fl dynamic-form-table__label">
                    <el-badge v-if="field.field_options.index" :value="index+1 " type="primary" style="top: 0.3em;" /><span v-if="!fieldOptions.hidden_header" v-html="formatLabel" />
                  </div>
                  <div v-if="toolbarButtons && toolbarButtons.length >0" class="ibps-fr">
                    <el-button-group>
                      <template v-for="(button,b) in toolbarButtons ">
                        <template v-if="!(button.key === 'remove' && dataModel.length===1) ">
                          <el-button
                            :key="button.key+b"
                            :type="button.type"
                            :icon="button.icon"
                            @click="handleActionEvent(button,index)"
                          >
                            {{ button.label }}
                          </el-button>
                        </template>
                      </template>
                    </el-button-group>
                  </div>
                </div>
                <!--块模式：表单-->
                <div class="panel-body">
                  <ibps-dynamic-form-table-block
                    v-for="column in columns"
                    :ref="'formItem'+column.name"
                    :key="column.name"
                    :models.sync="dataModel[index]"
                    :rights.sync="columnsRights"
                    :form-data="models"
                    :field="column"
                    :main-code="mainCode"
                    :code="code"
                    :row="index"
                    :params="params"
                    :table-params="tableFormParams"
                    v-on="listeners"
                  />
                </div>
              </div>
            </template>
          </template>
        </template>
        <el-button-group v-if="(bottomButtons && bottomButtons.length >0) " class="ibps-pt-10">
          <template v-if=" bottomButtons && bottomButtons.length >0">
            <el-button
              v-for="(button,index) in bottomButtons"
              :key="index"
              :icon="button.icon"
              type="text"
              @click="handleActionEvent(button,index)"
            >
              {{ button.label }}
            </el-button>
          </template>
        </el-button-group>
      </template>
    </template>
    <el-table
      v-else
      :data="[]"
      empty-text="您尚未创建任何字段。请在表单中添加字段。"
      border
    />
    <!--按钮支持自定义对话框-->
    <custom-dialog
      :visible="customDialogVisible"
      :value="[]"
      :template-key="customDialogKey"
      :multiple="customDialogMultiple"
      :dynamic-params="customDialogDynamicParams"
      @close="visible=>customDialogVisible =visible"
      @action-event="handleCustomDialogActionEvent"
    />
    <!--弹窗模式对话框-->
    <formrender-dialog
      :visible="formDialogVisible"
      :title="field.label"
      :form-def="dialogFormDef"
      :data="dialogFormData"
      :mode="mode"
      custom-class="ibps-dialog-80"
      top="5vh"
      @close="visible=>formDialogVisible = visible"
      @action-event="handleFormDialogActionEvent"
    />
    <import-table
      :visible="importTableDialogVisible"
      :title="field.label"
      @close="visible=>importTableDialogVisible = visible"
      @action-event="handleImportTableActionEvent"
    />
    <component
      :is="dialogTemplate"
      v-if="dialogTemplate"
      ref="dialogTemplate"
      v-bind="dialogTemplateAtts"
    />
    <!--显示字段-->
    <display-field-dialog
      v-if="enableDisplayField"
      :visible="displayFieldVisible"
      :fields="displayAllFields"
      :data="displayFields"
      :disable-fields="disableDisplayFields"
      :name-key="displayFieldNameKey"
      @callback="handleDisplayField"
      @close="visible => displayFieldVisible = visible"
    />
    <!-- 级联配置 -->
    <cascade-dialog
      ref="cascadeDialog"
      :visible="cascadeDialogVisible"
      :components="customComponents"
      :config="cascadeConfiguration"
      :dynamic-data="cascadeDynamicData"
      :dynamic-params="cascadeDynamicParams"
      @close="visible => cascadeDialogVisible = visible"
    />
  </div>
</template>
<script>
import { debounce } from 'lodash'
import emitter from 'element-ui/lib/mixins/emitter'
import { isEqual } from 'element-ui/lib/utils/util'
import FormOptions from '../../constants/formOptions'
import ActionUtils from '@platform/utils/action'
import Identity from '@platform/constants/identity'
import FormUtils from '../../utils/formUtil'
import FormFieldUtil from '../../utils/formFieldUtil'
import FieldUtil from '@platform/business/platform/form/utils/fieldUtil'
import { format, dateDealFmt } from '@platform/utils/fecha'
import { hasPermission } from '@platform/business/platform/form/constants/tableButtonTypes'
import CustomDialog from '@platform/business/platform/data/templaterender/custom-dialog/dialog'
import FormrenderDialog from '@platform/business/platform/form/formrender/dialog'
import ImportTable from './components/import-table'
import IbpsExport from '@platform/plugins/export'
import IbpsImport from '@platform/plugins/import'
import DisplayFieldDialog from '@platform/components/ibps-display-field'
import IbpsPagination from '@platform/components/ibps-pagination'
import CustomDataDisplayMixin from '@platform/business/platform/system/mixins/customDataDisplay'
import CascadeMixin from '@platform/components/ibps-link/mixins/cascade'
import CascadeDialog from '@platform/components/ibps-link/components/dialog'
import eventsUtil from '@platform/utils/eventsUtil'// 自定义脚本
// const JForm = window.JForm
export default {
  components: {
    FormrenderDialog,
    CustomDialog,
    ImportTable,
    DisplayFieldDialog,
    IbpsPagination,
    CascadeDialog
  },
  mixins: [emitter, CustomDataDisplayMixin, CascadeMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: [Array, Object, String], // 值
    formData: [Array, Object], // 表单数据
    field: { // 字段
      type: Object,
      required: true
    },
    rights: {
      type: [String, Object]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    mainCode: String, // 主表名
    params: Object, // 默认参数
    tableParams: Object // 子表参数
  },
  data() {
    let val = null
    if (this.$utils.isNotEmpty(this.value)) {
      val = this.value || this.isOne2One ? {} : []
    } else {
      val = this.isOne2One ? {} : []
    }
    return {
      prompt: '需要选择父表数据才能显示',
      dataModel: val,
      multipleSelection: [],
      addLoading: false,
      fieldRights: {}, // 子表配置权限
      tableRights: null, // 子表权限
      columnsRights: {}, // 子表字段权限
      buttonsRights: {}, // 子表按钮权限
      actionCode: '',
      actionPosition: 'toolbar',
      customDialogVisible: false,
      customDialogKey: '',
      customDialogMultiple: false,
      customDialogDynamicParams: {},
      customDialogCustom: {},
      formDialogVisible: false,
      dialogFormDef: {},
      dialogFormData: {},
      dialogFormIndex: -1,
      importTableDialogVisible: false,
      dialogTemplate: null,
      dialogTemplateAtts: {},
      importButton: {},
      displayFieldVisible: false,
      displayFieldNameKey: 'name',
      displayFields: [],
      displayFieldData: [],
      pagination: {},
      totalKey: 'totalCount', // 总记录
      pageKey: 'page', // 当前页数
      pageSizeKey: 'limit', // 分页大小
      pageCountKey: 'totalPages', // 总页数
      groupingData: [], // 列表分组表格的数据
      orderMap: {}, // 保存序号的map集
      prefix: 'order_', // 保存序号的map集的属性前缀
      groupingSetting: {},
      noGrouping: '未分组',
      // 多级子表相关数据
      parentRow: -1, // 父表的选中行
      rowData: {}, // 父表选中行的数据
      rowNum: -1, // 当前选中行的$index
      eventsUtil: {},
      cascadeDialogVisible: false,
      cascadeConfiguration: {},
      cascadeDynamicData: {},
      cascadeDynamicParams: {},
      customComponents: {},
      isRowClick: false,
      subDataSaveSign: '_subDataSaveSign',
      promptRowNum: -1 // 当前选中行的行数
    }
  },
  computed: {
    formatLabel() {
      const label = this.field.label
      if (!this.fieldOptions.is_label || this.$utils.isEmpty(this.fieldOptions.custom_label_type)) {return label}
      if (this.fieldOptions.custom_label_type === 'statistics') {
        return this.formatLabelByStatistics
      } else {
        const name = this.field.name + '$table_label_' + this.mainCode
        const val = this.formData[name] || ''
        return this.htmlLabel(val, label)
      }
    },
    formatLabelByStatistics() { // 对表格的头部格式化自定义标签
      const label = this.field.label
      if (this.$utils.isEmpty(this.dataModel) ||
          this.$utils.isEmpty(this.field) ||
          !this.fieldOptions.is_label ||
          this.$utils.isEmpty(this.fieldOptions.label_setting) ||
          this.$utils.isEmpty(this.fieldOptions.label_setting.format)) {return label}
      let val = ''
      const arrs = this.fieldOptions.label_setting.format.split('$_widget_')
      for (let i = 0; i < arrs.length; i++) { // 通过格式计算显示的数据
        const index = arrs[i].indexOf('#')
        if (i === 0 || index === -1) {
          val += arrs[i]
          continue
        }
        if (arrs[i].substring(0, index) === 'statistics') {
          if (this.isOne2One) {
            val += '1'
          } else {
            val += this.dataModel.length
          }
        }
        val += arrs[i].substring(index + 1)
      }
      return this.htmlLabel(val, label)
    },
    // parentKey
    parentKey() {
      return this.field.field_options.parentKey
    },
    level() {
      return this.field.field_options.level
    },
    // 通过分页配置获取数据
    pagingData() {
      if (!this.$utils.isArray(this.dataModel)) {return []}
      const temp = this.filterDel(this.dataModel)
      if (this.$utils.isEmpty(this.dataModel) ||
        this.$utils.isEmpty(this.pagination) ||
        this.$utils.isEmpty(this.pagination.page) ||
        this.pagination.page < 1 ||
        this.$utils.isEmpty(this.pagination.totalPages) ||
        this.pagination.totalPages <= 1) {
        return temp
      }
      // 以下计算是在pagination分页配置数据正确的基础之上
      const start = (this.pagination.page - 1) * this.pagination.limit
      let end = this.pagination.page * this.pagination.limit
      if (end > this.pagination.totalCount) {
        end = this.pagination.totalCount
      }
      return temp.slice(start, end)
    },
    // 判断列表是否显示分组
    isGrouping() {
      const result = (this.mode === 'inner' || this.mode === 'dialog') &&
                  this.field.field_options.grouping &&
                  this.$utils.isNotEmpty(this.groupingSetting) &&
                  this.groupingSetting !== this.noGrouping
      return result
    },
    // 获取分组的配置
    getGroupingSettings() {
      if (this.$utils.isEmpty(this.fieldOptions.groupingSettings)) {return []}
      return this.fieldOptions.groupingSettings
    },
    thatSocpe() {
      return this
    },
    models() {
      return this.formData
    },
    fieldOptions() {
      const fieldOptions = this.field.field_options || {}
      fieldOptions.default_value_type = fieldOptions.default_value_type || 'fixed'
      return fieldOptions
    },
    relation() {
      return this.fieldOptions['relation'] || 'one2More'
    },
    isOne2One() {
      return this.relation === 'one2one'
    },
    toolbarButtons() {
      return this.filterButtons('toolbar')
    },
    manageButtons() {
      return this.filterButtons('manage')
    },
    manageButtonWidth() {
      return this.manageButtons.length > 2 || this.manageButtons.length === 1 ? 70 : 150
    },
    bottomButtons() {
      return this.filterButtons('bottom')
    },
    mode() {
      return this.field.field_options.mode || 'inner'
    },
    showSummary() {
      return this.field.field_options.summary || false
    },
    sumText() {
      return this.field.field_options.sum_text || '合计'
    },
    hasSummaryMethod() {
      return this.field.field_options.summary_method || false
    },
    code() {
      return this.field.name || ''
    },
    columns() {
      return this.field.field_options.columns || []
    },
    allColumns() { // 所有字段
      return FormFieldUtil.getSubDisplayColumns(this.columns, false)
    },
    columnMap() {
      const columnMap = {}
      this.allColumns.forEach((column) => {
        columnMap[column[this.displayFieldNameKey]] = column
      })
      return columnMap
    },
    displayColumns() { // 仅显示字段
      if (this.enableDisplayField && this.$utils.isNotEmpty(this.displayFields)) {
        const columns = []
        for (let i = 0; i < this.displayFields.length; i++) {
          const field = this.displayFields[i]
          const c = this.columnMap[field[this.displayFieldNameKey]]
          if (this.$utils.isEmpty(c)) {
            continue
          }
          const column = JSON.parse(JSON.stringify(c))
          if (field.width) {
            column.width = field.width
          }
          columns.push(column)
        }
        return columns
      } else {
        const displayColumns = FormFieldUtil.getSubDisplayColumns(this.columns)
        return displayColumns.filter((column) => {
          return !this.columnHidden(column)
        })
      }
    },
    buttons() {
      const buttons = this.field.field_options.buttons || []
      const bs = []
      buttons.forEach(button => {
        const b = JSON.parse(JSON.stringify(button))
        b.key = button.type
        b.type = button.style
        b.style = button.style
        b.icon = 'ibps-icon-' + button.icon
        bs.push(b)
      })
      return bs
    },
    tableReadonly() {
      return this.readonlyRights ? true : this.tableRights === FormOptions.t.PERMISSIONS.READ
    },
    tableHidden() {
      return this.tableRights === FormOptions.t.PERMISSIONS.HIDE
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    },
    defaultLabelWidth() {
      return this.params.labelWidth
    },
    tableLabelWidth() {
      return this.field.field_options.is_label_width ? this.field.field_options.label_width + (this.field.field_options.label_width_unit || 'px') : null
    },
    readonlyRights() {
      return this.params.readonly
    },
    readonlyStyle() {
      return this.params.readonlyStyle
    },
    responseFormula() {
      return this.params.responseFormula
    },
    responseDynamic() {
      return this.params.responseDynamic
    },
    responseLinkages() {
      return this.params.responseLinkages
    },
    setIdent() { // 导出/导入-标识
      return this.field.field_options.identification
    },
    displayAllFields() {
      return this.allColumns.filter((column) => {
        // 隐藏字段和隐藏权限
        if (!(column.field_type === 'hidden' || this.columnsRights[column.name] === FormOptions.t.PERMISSIONS.HIDE)) {
          return column
        }
      })
    },
    /**
     * 禁用字段
     */
    disableDisplayFields() {
      const list = []
      this.displayAllFields.forEach((column) => {
        if (this.columnsRights[column.name] === FormOptions.t.PERMISSIONS.REQUIRED) {
          list.push(column.name)
        }
      })
      return list
    },
    enableDisplayField() { // 是否自定义列
      return this.field.field_options.display_column
    },
    displayFieldIdentity() { // 自定义列标识
      return Identity.IBPS.FORM.SUB_TABLE + '_' + this.params.formKey + '_' + this.code
    },
    preview() {
      return this.params.preview || false
    },
    tableFormParams() {
      const params = {
        labelWidth: this.tableLabelWidth || this.defaultLabelWidth,
        relation: this.relation
      }
      return Object.assign(params, this.tableParams || {})
    },
    // 分页
    pageable() {
      return this.field.field_options.pageable
    },
    listeners() {
      return {
        'update-form-data': (name, value) => {
          this.updateFormData(name, value)
        }
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.dataModel = val
        if (!isEqual(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      },
      immediate: true,
      deep: true
    },
    dataModel: {
      handler(val, oldVal) {
        if (this.isGrouping) {
          this.getTableGroupingData()
        } else if (this.mode === 'inner' || this.mode === 'dialog') {
          if (this.pageable) { // 设置分组配置
            this.setPagination()
          }
        }
        if (this.$utils.isEmpty(this.parentKey) || this.mode === 'block') {
          this.$emit('update:value', val)
        }
        // else {
        //   if (val !== oldVal) {
        //     if (this.$utils.isEmpty(this.rowData)) return
        //     const row = this.rowData['$index']
        //     // 子表的code
        //     this.rowData[this.code] = val
        //     // 为数据进行赋值 - todo:兼容到多级
        //     if (this.$utils.isEmpty(window[this.mainCode + 'TableRefs'])) return
        //     const _ref = window[this.mainCode + 'TableRefs'][this.parentKey]
        //     if (this.$utils.isEmpty(_ref)) return
        //     const _that = _ref.tableRef
        //     _that.$set(_that.dataModel[row], this.code, val)
        //   }
        // }
      },
      deep: true
    },
    rights: {
      handler(val, oldVal) {
        this.fieldRights = val || {}
      },
      deep: true,
      immediate: true
    },
    readonly: {
      handler(val) {
        if (!val) {
          this.getTableRights()
        }
      },
      immediate: true
    },
    fieldRights: {
      handler() {
        this.getTableRights()
      },
      deep: true,
      immediate: true
    },
    // 显示字段数据
    displayFieldData: {
      handler(val, oldVal) {
        if (!this.enableDisplayField || isEqual(val, oldVal)) {
          return
        }
        this.initDisplayFields()
        if (this.$refs.elTable) {
          // 更新下展示数据
          setTimeout(() => {
            this.$refs.elTable.store.scheduleLayout(true)
          }, 100)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.elTable) {
        this.$refs.elTable.doLayout()
        if (this.enableDisplayField) {
          this.loadDisplayField()
        }
      }
      if (this.$utils.isNotEmpty(this.params) &&
      this.$utils.isNotEmpty(this.params.formAttrs) &&
      this.$utils.isNotEmpty(this.params.formAttrs.script)) {
        this.eventsUtil = eventsUtil._initEvents(this.params.formAttrs.script, 'form_' + this.params.formKey)
      }
    })
    if (!(this.mode === 'inner' || this.mode === 'dialog')) {return}
    const _this = this
    this.$nextTick(() => {
      if (this.$utils.isEmpty(window[this.mainCode + 'TableRefs'])) { // 全局数据保存表格的this
        window[this.mainCode + 'TableRefs'] = {}
      }
      window[this.mainCode + 'TableRefs'][this.code] = { tableRef: _this }
      if (this.$utils.isNotEmpty(this.parentKey)) {
        if (this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs']) && this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs'][this.parentKey])) {
          if (this.$utils.isEmpty(window[this.mainCode + 'TableRefs'][this.parentKey].subTableRef)) {
            window[this.mainCode + 'TableRefs'][this.parentKey].subTableRef = []
          }
          // 将多级子表保存到上级子表的subTableRef中
          window[this.mainCode + 'TableRefs'][this.parentKey].subTableRef.push(_this)
        }
      }
    }, 500)
    if (this.field.field_options.grouping &&
      this.getGroupingSettings.length > 0) { // 判断是否存在分组配置
      if (this.$utils.isNotEmpty(this.field.field_options.defaultShow)) {
        for (let i = 0; i < this.getGroupingSettings.length; i++) {
          const temp = this.getGroupingSettings[i]
          if (this.field.field_options.defaultShow === temp.id) {
            this.groupingSetting = temp
            break
          }
        }
      } else {
        if (this.tableReadonly) { // 只读，则默认显示第一个分组配置
          this.groupingSetting = this.getGroupingSettings[0]
        } else { // 可编辑则默认显示不分组
          this.groupingSetting = this.noGrouping
          if (this.pageable) { // 设置分组配置
            this.setPagination()
          }
        }
      }
    } else {
      if (this.pageable) { // 设置分组配置
        this.setPagination()
      }
    }
  },
  beforeDestroy() {
    this.dataModel = null
    this.fieldRights = null
    this.tableRights = null
    this.columnsRights = null
    this.buttonsRights = null
    this.customDialogDynamicParams = null
    this.customDialogCustom = null
    this.dialogFormDef = null
    this.dialogFormData = null
    this.dialogTemplate = null
    this.dialogTemplateAtts = null
    this.importButton = null
    this.orderMap = null
    // 注销当前表格保存在window[this.mainCode+'TableRefs']的this
    this.destoryTable()
    this.eventsUtil = null
  },
  methods: {
    filterDel(data) {
      if (this.$utils.isEmpty(data)) {return data}
      return data.filter((item, i) => {
        item.$index = i
        if (this.$utils.isEmpty(item[this.subDataSaveSign])) {
          this.$set(item, this.subDataSaveSign, 'upd')
        }
        return !['del', 'del_logic'].includes(item[this.subDataSaveSign])
      })
    },
    getTableRights() {
      const fieldRights = this.fieldRights
      if (this.$utils.isNotEmpty(fieldRights) && this.$utils.isPlainObject(fieldRights)) {
        this.tableRights = this.getRealRights(fieldRights['rights'] || FormOptions.t.PERMISSIONS.EDIT)
        this.columnsRights = this.getColumnsRights(fieldRights['columns'])
        this.buttonsRights = this.getButtonsRights(fieldRights['buttons'])
      } else {
        this.tableRights = fieldRights || FormOptions.t.PERMISSIONS.EDIT
        this.columnsRights = this.getColumnsRights({})
        this.buttonsRights = this.getButtonsRights({})
      }
      if (this.enableDisplayField) {
        this.initDisplayFields()
      }
    },
    // 自定义标签格式化后的数据
    htmlLabel(val, label) {
      let html = ''
      if (this.fieldOptions.custom_label_position === 'front') {
        html = `<span class="dynamic-form-table__label__left">${val}</span>${label}`
      } else {
        html = `${label}<span class="dynamic-form-table__label__right">${val}</span>`
      }
      return html
    },
    columnLabel(column) {
      return this.$utils.isNotEmpty(column.field_options.units) &&
      (this.$utils.isEmpty(column.field_options.position) || column.field_options.position === 'label')
        ? column.label + '(' + column.field_options.units + ')'
        : column.label
    },
    rowClick(row, column, event) { // 表格行点击事件
      // 生成二级子表表格的row-click事件
      if (!(this.$utils.isNotEmpty(row) && this.$utils.isEmpty(row.headInformation) && this.$utils.isEmpty(row.children))) {return}
      if (this.$utils.isEmpty(window[this.mainCode + 'TableRefs']) || this.$utils.isEmpty(window[this.mainCode + 'TableRefs'][this.code])) {return}
      if (this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs'][this.code].subTableRef)) {
        let bool = true
        // window[this.mainCode + 'TableRefs'][this.code].subTableRef.forEach((el, i) => {
        //   el.rowClickByTable(row, column, event)
        // })
        const _data = window[this.mainCode + 'TableRefs'][this.code].subTableRef
        for (let i = 0; i < _data.length; i++) {
          bool = _data[i].isChangeByTable(row, column, event, this.field.label)
          if (!bool) {return}
        }
        let _num = row.$index
        for (let j = 0; j < row.$index; j++) {
          if (['del', 'del_logic'].includes(this.dataModel[j][this.subDataSaveSign])) {
            _num--
          }
        }
        window[this.mainCode + 'TableRefs'][this.code].subTableRef.forEach((el, i) => {
          el.setRow(row, '', _num)
        })
        this.rowNum = row.$index
      }
    },
    destoryTable() {
      if (this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs']) && this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs'][this.code])) {
        window[this.mainCode + 'TableRefs'][this.code] = null
        delete window[this.mainCode + 'TableRefs'][this.code]
      }
      if (this.$utils.isObject(window[this.mainCode + 'TableRefs']) && this.$utils.isEmpty(window[this.mainCode + 'TableRefs'])) {
        window[this.mainCode + 'TableRefs'] = null
        delete window[this.mainCode + 'TableRefs']
      }
    },
    // 设置多级表单选择的数据
    setRow(rowData, action, rowNum) {
      this.parentRow = rowData['$index']
      this.promptRowNum = rowNum
      const data = rowData[this.code] || []
      this.rowData = rowData
      this.dataModel = data
      if (this.$utils.isEmpty(action) && !this.$utils.isArray(rowData[this.code])) {
        // 为数据进行赋值 - todo:兼容到多级
        if (this.$utils.isEmpty(window[this.mainCode + 'TableRefs'])) {return}
        const _ref = window[this.mainCode + 'TableRefs'][this.parentKey]
        if (this.$utils.isEmpty(_ref)) {return}
        const _that = _ref.tableRef
        _that.$set(_that.dataModel[this.parentRow], this.code, data)
      }
    },
    // 通过传入的parentKey，获取是否父表存在父表
    getCodeByParentKey(parentKey) {
      let _temp = parentKey
      // 多级表单 - 注释
      const _key = this.getParentKeyByRefs(_temp)
      if (this.$utils.isNotEmpty(_key)) {_temp = _key + '.' + _temp}
      return _temp
    },
    // 获取多级表单的key
    getParentKeyByRefs(key) {
      const _refs = window[this.mainCode + 'TableRefs']
      if (this.$utils.isEmpty(_refs)) {return ''}
      const _ref = _refs[key]
      if (this.$utils.isEmpty(_ref)) {return ''}
      const _parentKey = _ref.parentKey
      if (this.$utils.isEmpty(_parentKey)) {return ''}
      const _parentRow = _ref.parentRow
      const result = _parentKey + '.' + _parentRow
      const _temp = this.getParentKeyByRefs(_parentKey)
      if (this.$utils.isEmpty(_temp)) {return result}
      return _temp + '.' + result
    },
    // 获取多级子表校验的prop数组
    getPropArray() {
      const _arr = []
      if (this.$utils.isEmpty(this.parentKey) || this.parentRow === -1) {return _arr} // 没有父表key或还没有点击父表行数据
      const temp = this.pagingData
      if (this.$utils.isEmpty(temp)) {return _arr}
      if (this.$utils.isEmpty(this.displayColumns)) {return _arr}
      this.displayColumns.forEach(el => {
        for (let i = 0; i < temp.length; i++) {
          _arr.push(this.getCodeByParentKey(this.parentKey) + '.' + this.parentRow + '.' + this.code + '.' + i + '.' + el.name)
        }
      })
      return _arr
    },
    // 多级子表的父表点击事件
    isChangeByTable(row, column, event, label) {
      if (this.isRowClick) {
        console.info('等待行事件结束才能继续触发')
        return false
      }
      this.isRowClick = true
      // 多级子表数据获取
      // 判断是否是重复点击的行数据
      if (row.$index === this.parentRow) {
        this.isRowClick = false
        return false
      }
      // 校验多级子表数据，如果还存在校验失败的，不给予转换子表数据
      const _arr = this.getPropArray()
      if (this.$utils.isEmpty(_arr)) {
        // this.setRow(row)
        this.isRowClick = false
        return true
      }
      const _ref = window['$formRef' + this.params.formKey]
      if (this.$utils.isEmpty(_ref)) {
        this.isRowClick = false
        return false
      }
      let _result = true // 校验是否成功
      for (let i = 0; i < _arr.length; i++) {
        _ref.validateField(_arr[i], emailError => {
          if (emailError && _result) {
            _result = false
          }
        })
        if (!_result) {break}
      }
      this.isRowClick = false
      if (_result) {
        // this.setRow(row)
        return true
      } else {
        this.$message({
          message: `${this.level + 1}级表单[${label}]的第[${this.promptRowNum + 1}]条数据的下属${this.level + 2}级表单校验失败，请先完善或删除数据再进行切换。`,
          type: 'warning'
        })
      }
      return false
    },
    // 多级子表的父表点击事件
    rowClickByTable(row, column, event) {
      if (this.isRowClick) {
        console.info('等待行事件结束才能继续触发')
        return
      }
      this.isRowClick = true
      // 多级子表数据获取
      if (this.$utils.isNotEmpty(row) && this.$utils.isEmpty(row.headInformation) && this.$utils.isEmpty(row.children)) { // 判断父表选中的不是分组情况下的头部行数据
        // 判断是否是重复点击的行数据
        if (row.$index === this.parentRow) {
          this.isRowClick = false
          return
        }
        // 校验多级子表数据，如果还存在校验失败的，不给予转换子表数据
        const _arr = this.getPropArray()
        if (this.$utils.isEmpty(_arr)) {
          // this.parentRow = row.$index
          this.setRow(row)
          this.isRowClick = false
          return
        }
        const _ref = window['$formRef' + this.params.formKey]
        if (this.$utils.isEmpty(_ref)) {
          this.isRowClick = false
          return
        }
        let _result = true // 校验是否成功
        for (let i = 0; i < _arr.length; i++) {
          _ref.validateField(_arr[i], emailError => {
            if (emailError && _result) {
              _result = false
            }
          })
          if (!_result) {break}
        }
        if (_result) {
          // this.parentRow = row.$index
          this.setRow(row)
        } else {
          this.$message({
            message: `${this.level + 1}级表单[${this.parentKey}]的第[${this.parentRow + 1}]条数据的下属${this.level + 2}级表单校验失败，请先完善或删除数据再进行切换。`,
            type: 'warning'
          })
        }
        this.isRowClick = false
      }
    },
    // 设置分页配置数据
    setPagination() {
      let temp = {}
      const page = 1
      const limit = 20
      // 获取page,limit的值
      if (this.$utils.isEmpty(this.pagination)) {
        temp = {
          page,
          limit
        }
      } else {
        if (this.$utils.isEmpty(this.pagination.page) || this.pagination.page <= 0) {
          temp.page = page
        } else {
          temp.page = this.pagination.page
        }
        if (this.$utils.isEmpty(this.pagination.limit) || this.pagination.limit <= 0) {
          temp.limit = limit
        } else {
          temp.limit = this.pagination.limit
        }
      }
      // 获取totalCount的值(需要使用到分页功能的情况下，dataModel的类型为数组)
      temp.totalCount = this.dataModel.length
      // 获取totalPages的值
      temp.totalPages = Math.ceil(temp.totalCount / temp.limit)
      if (temp.totalPages < temp.page) {
        temp.page = temp.totalPages
      }
      this.pagination = JSON.parse(JSON.stringify(temp))
    },
    // 通过传入分页数据的index或者在dataModel中的下标
    getIndex(index) {
      if (this.$utils.isEmpty(this.pagination) ||
        this.$utils.isEmpty(this.pagination.page) ||
        this.pagination.page <= 1) {
        return index
      }
      const result = ((this.pagination.page - 1) * this.pagination.limit) + index
      return result
    },
    // 分页操作
    handlePaginationChange({ page, limit }) {
      this.pagination.page = page
      this.pagination.limit = limit
      this.pagination.totalPages = Math.ceil(this.pagination.totalCount / limit)
    },
    // 下拉选择分组的条件
    handleCommand(command) {
      this.groupingSetting = command
      if (this.isGrouping) {
        this.getTableGroupingData()
      } else {
        if (this.pageable) { // 设置分组配置
          this.setPagination()
        }
      }
      this.multipleSelection = []
    },
    // 获取列表分组数据
    getTableGroupingData() {
      const _map = {}
      const _unknown = [] // 保存在条件之外的数据-未知数据(一个条件都满足不了的数据)
      const _conditions = this.groupingSetting.groupingCondition
      let _index = 1000000
      if (this.$utils.isEmpty(this.dataModel)) {
        this.groupingData = []
        return
      }
      this.dataModel.forEach((el, i) => {
        if (['del', 'del_logic'].includes(el[this.subDataSaveSign])) {return}
        if (this.$utils.isEmpty(el[this.subDataSaveSign])) {this.$set(el, this.subDataSaveSign, 'upd')}
        let _name = null // 用户充当保存到_map的属性
        if (this.$utils.isNotEmpty(_conditions) && _conditions.length > 0) {
          _conditions.forEach(item => { // 过滤
            if (!this.$utils.isNull(el[item.key])) {
              if (this.$utils.isNull(_name)) {_name = '_'}
              if (this.$utils.isFunction(el[item.key])) {
                _name += el[item.key].toString()
              } else {
                _name += JSON.stringify(el[item.key])
              }
            }
          })
        }
        el.$index = i
        if (this.$utils.isNull(_name)) {
          _unknown.push(el)
        } else {
          if (this.$utils.isNull(_map[_name])) {
            _map[_name] = []
          }
          _map[_name].push(el)
        }
      })
      const result = []
      let order = 1
      for (const key in _map) {
        if (_map.hasOwnProperty(key)) {
          const el = _map[key]
          result.push({
            $index: _index,
            headInformation: this.getHeadInformation(el[0]),
            addInformation: this.getAddInformation(el),
            children: el
          })
          this.orderMap[this.prefix + _index] = order
          this.getGroupingOrder(el, order)
          order++
          _index++
        }
      }
      if (_unknown.length > 0) {
        result.push({
          $index: _index,
          headInformation: '未知分组数据-当前分组数据不存在分组条件字段',
          addInformation: '',
          children: _unknown
        })
        this.orderMap[this.prefix + _index] = order
        this.getGroupingOrder(_unknown, order)
      }
      this.groupingData = result
    },
    // 获取分组数据的序号
    getGroupingOrder(data, parentOrder) {
      if (!this.field.field_options.index) {return} // 不显示序号，则不进行序号的格式操作
      if (this.$utils.isEmpty(data)) {return} // 数据为空，则不进行一下操作
      let order = 1
      data.forEach(el => {
        this.orderMap[this.prefix + el.$index] = parentOrder + '.' + order
        if (this.$utils.isNotEmpty(el.children)) {
          this.getGroupingOrder(el.children, parentOrder + '.' + order)
        }
        order++
      })
    },
    // 通过字段以及值获取描述
    getDescByField(field, val) {
      if (this.$utils.isEmpty(val)) {return ''}
      if (this.$utils.isEmpty(field)) {return val}
      return FieldUtil.getDescByField(field, val)
    },
    // 获取头部信息
    getHeadInformation(data) {
      const map = this.columnMap
      if (this.$utils.isEmpty(this.groupingSetting.headInformation)) {return ''}
      const d = this.groupingSetting.headInformation.split(/(\$[0-9a-zA-Z._]+#*)/g)
      const rtn = []
      d.forEach(n => {
        let a = n
        if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = data[f[0]] || ''
          // 补充：根据字段配置获取描述
          if (this.$utils.isEmpty(a)) {return}
          const field = map[f[0]]
          a = this.getDescByField(field, a)
        }
        rtn.push(a)
      })
      return rtn.join('')
    },
    // 获取附加信息
    getAddInformation(columns) {
      let result = ''
      if (this.$utils.isNotEmpty(this.groupingSetting.additionalFormat)) { // 判断附加信息是否有选择显示的格式
        if (this.groupingSetting.additionalFormat === 'formula') { // 计算函数
          result = this.getDataByCalculationFormula(columns)
        } else if (this.groupingSetting.additionalFormat === 'script') { // 脚本
          if (this.$utils.isNotEmpty(this.groupingSetting.informationScript)) { // 存在数据，则数据为函数的字符串格式
            const temp = new Function('return ' + this.groupingSetting.informationScript)
            const fun = temp()
            // 当脚本出错，则抛出异常输出到控制台
            try {
              result = fun(columns)
            } catch (e) {
              console.info('附加信息的脚本出错：', fun)
              console.error(e)
            }
          }
        }
      }
      return result
    },
    // 计算函数
    getDataByCalculationFormula(columns) {
      let result = ''
      if (this.$utils.isEmpty(this.groupingSetting.calculationFormula)) {return result}
      result = FormUtils.getCalFormulaValueByArray(this.groupingSetting.calculationFormula, columns)
      return result
    },
    // 表格树形数据展示
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.$utils.isNotEmpty(row.children)) {
        const tabColumns = this.$refs.elTable.columns.length // 表格显示的列数
        let _index = 0 // 从第几列开始合并(下标)
        let num = 0 // 合并多少列
        let _hasManageButtons = 0 // 判断是否有操作列
        if (this.field.field_options.index) {_index++}
        if (!this.tableReadonly) {_index++}
        if (this.manageButtons && this.manageButtons.length > 0) {_hasManageButtons++}
        if (columnIndex === _index) {
          num = tabColumns - _index - _hasManageButtons
          return [1, num]
        } else if (columnIndex > _index && columnIndex < num) {
          return [0, 0]
        }
      }
    },
    columnFirst(column) { // 是否是没有隐藏的第一个
      let temp = {}
      for (let i = 0; i < this.displayColumns.length; i++) {
        const el = this.displayColumns[i]
        if (!this.columnHidden(el)) {
          temp = el
          break
        }
      }
      return temp.id === column.id
    },
    columnHidden(column) { // 是否隐藏
      return this.columnsRights[column.name] === FormOptions.t.PERMISSIONS.HIDE || column.field_type === 'hidden'
    },
    columnWidth(column) {
      if (column.width) {
        return column.width
      }
      return column.field_options.is_label_width ? column.field_options.label_width + (column.field_options.label_width_unit || 'px') : this.tableLabelWidth
    },
    columnMinWidth(column) {
      if (column.width) {
        return ''
      }
      return column.field_options.is_label_width ? '' : '150px'
    },
    /**
     * 获取真实的权限
     */
    getRealRights(rights) {
      if (this.tableReadonly) {
        return rights === FormOptions.t.PERMISSIONS.HIDE ? rights : FormOptions.t.PERMISSIONS.READ
      } else {
        return rights
      }
    },
    getColumnsRights(rights = {}) {
      const columnsRights = {}
      if (this.allColumns && this.allColumns.length > 0) {
        this.allColumns.forEach(column => {
          columnsRights[column.name] = this.getRealRights(rights[column.name] || FormUtils.getDefaultRigths(column))
        })
      }
      return columnsRights
    },
    getButtonsRights(rights = {}) {
      if (this.$utils.isEmpty(rights)) {
        const buttonsRights = {}
        if (this.$utils.isNotEmpty(this.buttons)) {
          this.buttons.forEach(button => {
            const buttonKey = button.key === 'custom' ? button.code : button.key
            buttonsRights[buttonKey] = FormOptions.t.PERMISSIONS.SHOW
          })
        }
        return buttonsRights
      } else {
        return rights || {}
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // 如果为列表分组，则当前行数据的$index已在初始化时存在，不需要再进行赋值
      // if (!this.isGrouping) {
      //   // 把每一行的索引放进row
      //   row.$index = this.getIndex(rowIndex)
      // }
      let _className = ''
      if (row.$index === this.rowNum) {
        _className = 'table-row_bgcolor'
      }
      return _className
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    // 分组全选-清空选择，无法全选
    handleSelectionAll(selection) {
      this.$refs.elTable.data.map((items) => { // 使用$ref获取注册的子组件信息，用data获取所有行，并用map函数遍历行
        if (items.children) {
          if (!items.isChecked) { // 若遍历出来的行未选中
            this.$refs.elTable.toggleRowSelection(items, true) // 行变为选中状态
            items.isChecked = true // 更新标志参数
            items.children.map((item) => { // 遍历子节点并改变状态与标志参数
              this.$refs.elTable.toggleRowSelection(item, true)
              item.isChecked = true
            })
          } else { // 选中状态同理
            this.$refs.elTable.toggleRowSelection(items, false)
            items.isChecked = false
            items.children.map((item) => {
              this.$refs.elTable.toggleRowSelection(item, false)
              item.isChecked = false
            })
          }
        } else {
          if (!items.isChecked) {items.isChecked = true}
          else {items.isChecked = false}
        }
      })
    },
    getSelectionData(data, arrs, isCheck) {
      let _arrs = arrs
      for (let i = 0; i < data.length; i++) {
        if (this.$utils.isNotEmpty(data[i].children)) {
          _arrs = this.getSelectionData(data[i].children, _arrs)
        } else {
          this.$refs.elTable.toggleRowSelection(data[i], isCheck)
          _arrs.push(data[i])
        }
      }
      return _arrs
    },
    handleRowClick(row, event, column) {
      this.$refs.elTable.toggleRowSelection(row)
    },
    filterButtons(position) {
      const readonly = this.readonlyRights
      const bs = []
      this.buttons.forEach(button => {
        const buttonKey = button.key === 'custom' ? button.code : button.key
        if (hasPermission(buttonKey, position) && // 有位置权限
        (!button.position || button.position === 'all' || button.position === position) &&// 有位置权限
        (this.$utils.isEmpty(this.buttonsRights[buttonKey]) || this.buttonsRights[buttonKey] !== FormOptions.t.PERMISSIONS.HIDE) // 有按钮权限
        ) {
          const b = JSON.parse(JSON.stringify(button))
          b.position = position
          if (readonly) {
            if (this.$utils.toBoolean(button.enabledDetail)) {
              bs.push(b)
            }
          } else {
            bs.push(b)
          }
        }
      })
      return bs
    },
    handleActionEvent(button, index) {
      // 多级表单操作
      if (this.mode !== 'block' && this.$utils.isNotEmpty(this.parentKey) && this.$utils.isEmpty(this.rowData)) {
        if (this.$utils.isEmpty(window[this.mainCode + 'TableRefs']) ||
        this.$utils.isEmpty(window[this.mainCode + 'TableRefs'][this.parentKey]) ||
        this.$utils.isEmpty(window[this.mainCode + 'TableRefs'][this.parentKey].tableRef)) {
          ActionUtils.warning(`不存在当前表单的父表，无法进行操作!`)
        } else {
          const _name = window[this.mainCode + 'TableRefs'][this.parentKey].tableRef.field.label
          ActionUtils.warning(`请选择【${_name}】记录数据!`)
        }
        return
      }
      const buttonKey = this.actionCode = button.key === 'custom' ? (button.code || button.key + index) : button.key
      this.actionPosition = button.position || 'toolbar'
      // 前置事件
      this.beforeScript(button, index, (result) => {
        if (!result) {
          return
        }
        // 添加级联配置
        if (button.enabledCascade) {
          let _data = {}
          if (this.$utils.isNotEmpty(index)) {_data = this.dataModel[index] || {}}
          this.handleCascade(button, _data)
          // 添加自定义对话框按钮
        } else if (button.enabledCustom === 'Y') {
          this.handleAddCustomDialog(button)
        } else {
          switch (button.key) {
            case 'add':
              this.handleAdd()
              break
            case 'edit':
              this.handleDialogMode(index)
              break
            case 'remove':
              this.handleRemove(button, index)
              break
            case 'import':
              this.checkIdentification(buttonKey, button, index)
              break
            case 'export':
              this.checkIdentification(buttonKey, button, index)
              break
            case 'custom':
              break
            default:
              break
          }
        }
      })
    },
    checkIdentification(buttonKey, button, index) {
      buttonKey === 'import' ? this.handleImport(button, index) : this.handleExport(button, index)
    },
    // 添加
    async handleAdd() {
      if (this.mode === 'dialog') {
        this.handleDialogMode()
      } else {
        if (this.addLoading) {
          ActionUtils.warning('添加数据过快,请等待..')
          return
        }
        this.addLoading = true
        const defaultValue = await FormUtils.getTableDefaultData(this.field)
        await this.addData(JSON.parse(JSON.stringify(defaultValue)))
      }
    },
    // 添加数据
    async addData(data) {
      data[this.subDataSaveSign] = 'add'
      if (this.mode !== 'block') {
        if (this.setIdent && !data[this.setIdent]) {
          data[this.setIdent] = this.$utils.guid()
        }
      }
      if (this.$utils.isNull(this.dataModel)) {
        this.dataModel = []
      }
      this.dataModel.push(data)
      // 初始化运行公式计算
      await this.initRunCalFormula(this.dataModel.length - 1)
      // 后置事件
      await this.afterScript(this.actionCode, this.actionPosition)
      this.$utils.requestAnimationFrame(() => {
        this.addLoading = false
      }, 16)
      debounce(() => {
        if (!this.addLoading && this.$refs.elTable) {
          this.$refs.elTable.doLayout()
        }
      }, 500)
    },
    /**
     * 获取选择的记录
     */
    getSelection(position, index) {
      const selection = []
      if (position === 'toolbar' && this.mode !== 'block') {
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.multipleSelection.forEach(row => {
            if (this.isGrouping && this.$utils.isNotEmpty(row.children)) {return}
            selection.push(row.$index)
          })
        }
      } else {
        selection.push(index)
      }
      return selection
    },
    // 删除 multipleSelection 的数据
    removeSelection(selection) {
      if (this.$utils.isEmpty(this.multipleSelection)) {return}
      let temp = this.multipleSelection
      selection.forEach(index => {
        temp = temp.filter(item => {
          if (item.$index !== index) {return true}
          return false
        })
      })
      this.multipleSelection = temp
    },
    handleRemove(button, index) {
      const position = button.position
      const selection = this.getSelection(position, index)
      const _ids = []
      ActionUtils.removeRecord(selection, '确定删除？', true).then((ids) => {
        for (let i = this.dataModel.length - 1; i >= 0; i--) {
          if (ids.indexOf(this.dataModel[i].$index) > -1) {
            if (this.dataModel[i][this.subDataSaveSign] === 'add') {
              _ids.push(this.dataModel[i].$index)
              this.dataModel.splice(i, 1)
            } else {
              this.$set(this.dataModel[i], this.subDataSaveSign, 'del')
            }
          }
        }
        // 后置事件
        this.afterScript(this.actionCode, position, {
          selection: selection,
          index: index
        })
        this.removeSelection(selection)
        // 当前如果存在多级子表，且多级子表的父数据被删除，则需要将多级子表的数据清空
        if (!(this.$utils.isEmpty(this.rowNum) || this.rowNum === -1)) { // 判断是否已点击选择某一行
          if (this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs']) && this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs'][this.code])) {
            if (this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs'][this.code].subTableRef)) {
              window[this.mainCode + 'TableRefs'][this.code].subTableRef.forEach(el => {
                const _parentRow = el.parentRow
                const _promptRowNum = el.promptRowNum
                if (this.$utils.isNotEmpty(_parentRow) && ids.indexOf(_parentRow) > -1) {
                  el.setRow({}, 'remove')
                  this.rowNum = -1
                } else {
                  let _num = 0
                  let _rowNum = 0
                  for (let k = 0; k < ids.length; k++) {
                    if (_ids.length > k && _ids[k] < _parentRow) {_num++}
                    if (ids[k] < _parentRow) {_rowNum++}
                  }
                  el.parentRow = _parentRow - _num
                  el.promptRowNum = _promptRowNum - _rowNum
                  this.rowNum = el.parentRow
                }
              })
            }
          }
        }
      }).catch(() => {})
    },
    // 初始化运行公式计算
    initRunCalFormula(row) {
      // 不需要字段的进行公式计算 比如获取但其当前时间，随机数
      FormUtils.runCalFormula(this, this.responseFormula ? this.responseFormula[FormUtils.NOT_NEED_FIELD] : {}, this.mainCode, row)
      // 初始化运行动态脚本
      FormUtils.runCalDynamic(this, this.responseDynamic ? this.responseDynamic[FormUtils.NOT_NEED_FIELD] : {}, this.mainCode, row)
    },
    handleImport(button) {
      this.importButton = button
      // this.importButton.additionalData = 'Y'
      this.importTableDialogVisible = true
    },
    handleImportTableActionEvent(file, options) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.loading')
      })
      const isAdditionalData = this.importButton.additionalData === 'Y'
      const formData = FormUtils.getTableDefaultColumnData(this.field)
      IbpsImport.xlsx(file, options).then(({ header, results }) => {
        const columnMap = {}
        this.allColumns.forEach((column) => {
          columnMap[column.label] = column
        })
        results.forEach((result) => {
          const data = JSON.parse(JSON.stringify(formData))
          for (const key in result) {
            if (columnMap[key]) {
              const column = columnMap[key]
              const name = column.name
              const value = this.importDataFormatter(result[key], column)
              data[name] = value
            }
          }
          let isIdentification = false
          let isIdentificationIndex
          this.dataModel.forEach((d, i) => {
            if (d[this.setIdent] === data[this.setIdent]) {
              isIdentification = true
              isIdentificationIndex = i
            }
          })
          if (!isIdentification && isAdditionalData) {
            // 导入
            if (this.mode !== 'block' && this.$utils.isEmpty(data[this.setIdent])) {
              data[this.setIdent] = this.$utils.guid()
            }
            this.dataModel.push(data)
          } else {
            if (isIdentificationIndex !== undefined) {
              this.dataModel.splice(isIdentificationIndex, 1, data)
            }
            // this.tableRights = false
            // this.tableRights = true
          }
        })
        loading.close()
        this.importTableDialogVisible = false
        ActionUtils.success('导入成功,留意导入设置是否设置显示添加数据')
      }).catch(() => {
        loading.close()
      })
    },
    // 导出
    handleExport(button, index) {
      const position = button.position
      const selection = this.getSelection(position, index)
      ActionUtils.selectedMultiRecord(selection).then((ids) => {
        this.exportData(ids, button)
      }).catch(() => {})
    },
    /**
     * 导出数据
     */
    exportData(ids, button) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.loading')
      })
      const columnMap = {}
      const columns = []
      const isExportHiddenField = button.exportHiddenField === 'Y'
      const hasExportHiddenFields = button.needExportHiddenFields || []
      this.allColumns.forEach(column => {
        if (!this.columnHidden(column)) {
          columns.push(column)
        } else {
          if (isExportHiddenField) {
            hasExportHiddenFields.forEach(h => {
              if (h === column.name) {
                columns.push(column)
              }
            })
          }
        }
        columnMap[column.name] = column
      })
      const exportData = JSON.parse(JSON.stringify(this.dataModel))
      exportData.forEach((e, i) => {
        if (this.$utils.isEmpty(e[this.setIdent])) {
          e[this.setIdent] = this.$utils.guid()
          this.dataModel[i][this.setIdent] = e[this.setIdent]
        }
      })
      const data = exportData.filter((d, i) => {
        return ids.includes(i) || !['del', 'del_logic'].includes(d[this.subDataSaveSign])
      })
      // TODO: 需要格式化展示的数据
      this.convertExportData(data, columnMap).then((data) => {
        IbpsExport.excel({
          columns: columns,
          data: data,
          nameKey: 'name',
          title: this.field.label
        }).then(() => {
          loading.close()
          ActionUtils.success('导出成功')
        }).catch(() => {
          loading.close()
        })
      })
    },
    async convertExportData(data, columnMap) {
      return new Promise((resolve, reject) => {
        const result = []
        data.forEach(d => {
          const o = d
          for (const name in d) {
            const column = columnMap[name]
            const value = this.dataFormatter(d[name], column)
            o[name] = value
          }
          result.push(o)
        })
        resolve(result)
      })
    },
    importDataFormatter(value, column) {
      if (this.$utils.isEmpty(value) || this.$utils.isEmpty(column)) {
        return value
      }
      const fieldType = column.field_type
      const fieldOptions = column.field_options
      let result = ''
      switch (fieldType) {
        case 'hidden':
        case 'text':
        case 'textarea':
        case 'editor':
        case 'autoNumber':
        case 'number':// 数字，格式化千分位等
          result = value
          break
        case 'datePicker':// 日期格式
        case 'currentDate':
        case 'currentTime':
          result = this.dateFormat(value, this.getDatefmt(fieldType, fieldOptions))
          break
        case 'select': // 下拉，单选，多选
        case 'radio':
        case 'checkbox':
          result = this.formatterOptions(value, fieldOptions['options'], 'label', 'val')
          break
        case 'switch': //
          result = this.formatterOptions(value, FormUtils.getSwitchOptions(this.field.field_options), 'label', 'val')
          break
        default:
          result = value
          break
      }
      return result
    },
    getDatefmt(fieldType, fieldOptions) {
      if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
        if (fieldType === 'currentDate') {
          return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        } else if (fieldType === 'currentTime') {
          return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['time']
        } else {
          return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        }
      } else {
        return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
      }
    },
    dateFormat(dateObj, dateFormat) {
      if (this.$utils.isEmpty(dateObj)) {return ''}
      try {
        if (typeof dateObj === 'number') {
          dateObj = new Date(dateObj)
        }
        if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
          // 需要把字符串转换日期格式
          dateObj = dateDealFmt.dealFmt(dateObj, dateFormat)
        }
        return format(dateObj, dateFormat)
      } catch (error) {
        console.error('转换日期格式错误：', error, dateObj, dateFormat)
        return ''
      }
    },
    dataFormatter(value, column) {
      if (this.$utils.isEmpty(value) || this.$utils.isEmpty(column)) {
        return value
      }
      const fieldType = column.field_type
      const fieldOptions = column.field_options
      let result = ''
      switch (fieldType) {
        case 'hidden':
        case 'text':
        case 'textarea':
        case 'editor':
        case 'autoNumber':
        case 'number':// 数字，格式化千分位等
        case 'inputNumber':// 数字，格式化千分位等
        case 'datePicker':// 日期格式
        case 'currentDate':
        case 'currentTime':
          result = value
          break
        case 'select': // 下拉，单选，多选
        case 'radio':
        case 'checkbox':
          result = this.formatterOptions(value, fieldOptions['options'], 'val')
          break
        case 'switch': //
          result = this.formatterOptions(value, FormUtils.getSwitchOptions(fieldOptions), 'val')
          break
        default:
          result = value
          break
      }
      return result
    },
    /**
     * 格式化选项
     */
    formatterOptions(value, options, valueKey = 'value', labelKey = 'label') {
      const optionObj = {}
      options.map(option => {
        optionObj[option[valueKey]] = option[labelKey]
      })
      const aryValue = value.split(',')
      const res = aryValue.map((v) => {
        return optionObj[v] || v
      })
      return res.join(',')
    },
    // =====================处理级联处理=====================
    // 级联配置
    handleCascade(button, rowData) {
      const config = this.cascadeConfiguration = button.cascade_configuration
      if (this.$utils.isEmpty(config)) {return}
      let formData = this.formData
      if (this.$utils.isNotEmpty(rowData)) {
        formData = {
          models: rowData
        }
      }
      this.runCascadeAction(config, formData)
    },
    // =====================对话框模式数据处理=====================
    handleDialogMode(index) {
      const data = this.$utils.isNotEmpty(index) ? this.dataModel[index] : {}
      this.dialogFormData = {
        responses: JSON.parse(JSON.stringify(data)),
        // 表单字段权限
        permissions: {
          fields: this.columnsRights
        }
      }
      const attrs = {
        hide_name: true
      }
      if (this.params.formAttrs) {
        const formAttrs = this.params.formAttrs
        const allowAttrs = ['inline',
          'labelPosition',
          'labelWidth',
          'labelWidthUnit',
          'size',
          'statusIcon',
          'descPosition',
          'read_style',
          'colon',
          'labelSuffix'
        ]
        for (const key in formAttrs) {
          if (allowAttrs.indexOf(key) > -1) {
            let val = formAttrs[key]
            if (key === 'labelWidth') {
              val = this.field.field_options.is_label_width ? this.field.field_options.label_width : val
            } else if (key === 'labelWidthUnit') {
              val = this.field.field_options.is_label_width ? this.field.field_options.label_width_unit : val
            }
            attrs[key] = val
          }
        }
      }
      this.dialogFormIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.dialogFormDef = {
        code: this.field.name,
        attrs: attrs,
        fields: this.columns
      }
      // 表单
      this.formDialogVisible = true
    },
    /**
     * 对话框模式表单返回值
     */
    handleFormDialogActionEvent(key, data) {
      if (this.dialogFormIndex > -1) {
        if (this.$utils.isEmpty(data[this.subDataSaveSign])) {
          this.$set(data, this.subDataSaveSign, 'upd')
        }
        this.dataModel.splice(this.dialogFormIndex, 1, data)
        // 后置事件
        this.afterScript(this.actionCode, this.actionPosition, {
          index: this.dialogFormIndex
        })
      } else {
        this.addData(data)
      }
      this.formDialogVisible = false
    },
    // =====================自定义对话框=====================
    async handleAddCustomDialog(button) {
      this.customDialogKey = button.dialog
      this.customDialogMultiple = this.$utils.toBoolean(button.multiple, true)
      this.customDialogDynamicParams = await FormUtils.getLinkDynamicParams(button.custom, this.formData)
      this.customDialogCustom = button.custom
      setTimeout(() => {
        this.customDialogVisible = true
      }, 10)
    },
    async handleCustomDialogActionEvent(key, datas) {
      const linkLinkage = this.customDialogCustom['link_linkage']
      if (this.$utils.isEmpty(linkLinkage)) {
        return
      }
      const defaultData = await FormUtils.getTableDefaultData(this.field)
      if (this.customDialogMultiple) {
        for (let i = 0; i < datas.length; i++) {
          this.setCustomDialogValue(linkLinkage, defaultData, datas[i])
        }
      } else {
        this.setCustomDialogValue(linkLinkage, defaultData, datas)
      }
      // 后置事件
      this.afterScript(this.actionCode, this.actionPosition)
    },
    setCustomDialogValue(linkLinkage, defaultData, data) {
      const model = JSON.parse(JSON.stringify(defaultData))
      if (this.setIdent && !model[this.setIdent]) {
        model[this.setIdent] = this.$utils.guid()
      }
      for (let i = 0; i < linkLinkage.length; i++) {
        const item = linkLinkage[i]
        const fieldName = item.field
        if (model.hasOwnProperty(fieldName)) {
          model[fieldName] = data[item.name] || ''
        }
      }
      this.dataModel.push(model)
    },
    /**
     * 默认的表单统计 只有数字和计数器可以进行计算
     */
    defaultSummaryMethod(param) {
      const { columns, data } = param
      const numberColumnMap = {}
      this.allColumns.forEach((column) => {
        if (column.field_type === 'number' || column.field_type === 'inputNumber') {
          numberColumnMap[column.name] = column
        }
      })
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.sumText
          return
        }
        const property = column.property
        if (!numberColumnMap[property]) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[property]))
        const precisions = []
        let notNumber = true
        values.forEach(value => {
          if (!isNaN(value)) {
            notNumber = false
            const decimal = ('' + value).split('.')[1]
            precisions.push(decimal ? decimal.length : 0)
          }
        })
        const precision = Math.max.apply(null, precisions)
        if (!notNumber) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toFixed(Math.min(precision, 20)))
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    summaryMethod(param) {
      if (this.showSummary) {
        // return JForm._summaryMethod(this, this.field.name, param)
        return eventsUtil._eventCall(this.eventsUtil, 'summaryMethod', this, this.field.name, param)
      }
    },
    // =================自定义显示字段================
    /**
     * 获取显示字段
     */
    loadDisplayField() {
      if (!this.preview) {
        this.getCustomDataDisplay(this.displayFieldIdentity).then((data) => {
          this.displayFieldData = data
        })
      } else {
        this.displayFieldData = []
      }
    },
    initDisplayFields() {
      this.displayFields = this.$utils.isNotEmpty(this.displayFieldData) ? JSON.parse(JSON.stringify(this.displayFieldData)) : this.getDefaultDisplayFieldData()
    },
    // 默认显示字段
    getDefaultDisplayFieldData() {
      const displayFields = []
      this.displayAllFields.forEach((column) => {
        if (!(column.hidden || this.columnsRights[column.name] === FormOptions.t.PERMISSIONS.HIDE)) {
          displayFields.push(column)
        }
      })
      return JSON.parse(JSON.stringify(displayFields))
    },
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (this.preview || !this.enableDisplayField) {
        return
      }
      let displayFieldData = []
      if (this.$utils.isEmpty(this.displayFieldData)) {
        displayFieldData = this.getDefaultDisplayFieldData()
      } else {
        displayFieldData = JSON.parse(JSON.stringify(this.displayFieldData))
      }
      for (let i = 0; i < displayFieldData.length; i++) {
        const displayField = displayFieldData[i]
        if (displayField[this.displayFieldNameKey] === column.property) {
          displayField.width = parseInt(newWidth)
        }
      }
      this.saveDisplayField(displayFieldData, () => { }, false)
    },
    handleDisplayField(data) {
      this.saveDisplayField(data, () => {
        this.displayFieldVisible = false
      })
    },
    saveDisplayField(data, callback, hasMessage = true) {
      if (!this.preview) {
        this.saveCustomDataDisplay(data, this.displayFieldIdentity).then((response) => {
          this.displayFieldData = data
          if (hasMessage) {ActionUtils.success(response.message)}
          callback(true)
          this.search()
        }).catch(() => {
          callback(false)
        })
      } else {
        this.displayFieldData = data
        ActionUtils.success('保存成功,该为预览数据,不保存数据库！')
        callback(true)
      }
    },
    // =================自定义显示字段end================
    hasScript() {
      return true
    },
    // 前置脚本
    beforeScript(button, index, callback) {
      if (!this.hasScript()) {
        if (callback) {
          const flag = true
          callback(flag)
        }
        return
      }
      const params = {
        button: button,
        index: index
      }
      if (!callback) {
        callback = () => {}
      }
      // JForm._beforeSubButton(this, this.actionCode, button.position, params, callback)
      eventsUtil._eventCall(this.eventsUtil, 'beforeSubButton', this, this.actionCode, button.position, params, callback)
    },
    // 后置脚本
    afterScript(action, position, params, callback) {
      if (!this.hasScript()) {
        if (callback) {
          const flag = true
          callback(flag)
        }
        return
      }
      if (!params) {
        params = {}
      }
      params.button = this.getButtonByKey(action)
      if (!callback) {
        callback = () => {}
      }
      // JForm._afterSubButton(this, action, position, params, callback)
      eventsUtil._eventCall(this.eventsUtil, 'afterSubButton', this, action, position, params, callback)
    },
    getButtonByKey(action) {
      return this.buttons.find((button) => {
        return button.key === action
      })
    },
    /**
     * 更新字段值（主表或其他子表）
     */
    updateFormData(name, value) {
      this.$emit('change-data', name, value)
    },
    // 设置行数据
    setRowData(row, name, value) {
      this.dataModel[row][name] = value
    },
    // 设置行数据
    getRowData(row, name) {
      return this.dataModel[row][name]
    },
    /**
     * 获取表单值
     */
    getData(key) {
      return this.formData[key]
    },
    /**
     * 设置表单值
     */
    setData(name, value) {
      this.updateFormData(name, value)
    }
  }
}
</script>
<style lang="scss">
@import '@platform/assets/styles/unit/color.scss';
.dynamic-form-table{
  .dynamic-form-table__label__left{
    margin-right: 10px;
  }
  .dynamic-form-table__label__right{
    margin-left: 10px;
  }
  .panel-heading{
    border-bottom:0;
    border-left: 1px solid $color-border-3;
    border-right: 1px solid $color-border-3;
  }
  .dynamic-form-table__inner{
    .grouping-dropdown{
      margin-left: 20px;
    }
    .panel-body{
      padding: 0;
      .table-row_bgcolor {
        & > td{
          background-color: oldlace!important;
        }
      }
      .table-column-first{
        & > .cell{
          display: flex;
          .cell-div{
            flex: 1;
          }
        }
        .table-check{
          display: flex;
          align-items: center;
        }
      }
      .grouping-title{
        flex: 1;
        display: flex;
        .grouping-head{
          min-width: 30%;
          padding-right: 20px;
          box-sizing: border-box;
          white-space: pre;
        }
        .grouping-add{
          white-space: pre;
        }
      }
    }
  }
  .dynamic-form-table__block{
    padding-bottom:10px;
    .panel-body{
      border: 1px solid $color-border-3;
    }
  }
  .el-table__header-wrapper{
    .cell-required {
        .cell:before{
            content: '*';
            color:  $color-danger;
        }
    }
  }
}
.is-error{
  .dynamic-form-table{
    border: 1px solid $color-danger;
  }
}
.is-required:not(.is-no-asterisk){
   .dynamic-form-table__label:before {
        content: '*';
        color:$color-danger;
        margin-right: 4px;
    }
}
</style>
