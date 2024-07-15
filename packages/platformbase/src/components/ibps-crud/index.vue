<template>
  <div class="container-component">
    <div ref="ibpsCrud" class="ibps-container-crud">
      <!-- 工具栏 -->
      <div v-if="toolbars || $slots.header" ref="ibpsCrudHeader" class="ibps-container-crud__header">
        <div v-if="toolbars" :class="['ibps-toolbar--' + $ELEMENT.size]" class="ibps-toolbar">
          <div v-if="hasToolbar" class="header">
            <div class="buttons">
              <ibps-toolbar :actions="toolbars" :socpe="thatSocpe" :access-control="accessControl" :identity="identity" @action-event="handleActionEvent" />
            </div>
            <slot name="headerOther" />
            <div class="tools">
              <slot name="rightTools" />
              <el-button v-if="displayField" icon="ibps-icon-cog" class="ibps-crud__display-field" :underline="false" @click="displayFieldVisible = true">{{ $t('components.crud.displayField') }}</el-button>
              <el-tooltip v-if="$utils.isNotEmpty(searchForm)" :content="showToolbar ? $t('components.crud.collapse') : $t('components.crud.expand')">
                <a class="expand" @click="handleCollapseExpandToolbar">
                  <i :class="showToolbar ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
                </a>
              </el-tooltip>
            </div>
          </div>
          <div v-show="$utils.isNotEmpty(searchForm) && showToolbar" ref="toolbarBox" class="toolbar-box clear">
            <template v-if="$slots.searchForm">
              <slot :loading="loading" name="searchForm" />
            </template>
            <template v-else>
              <search-form v-if="searchForm" ref="searchForm" :forms="searchForm.forms || []" :size="searchForm.size" :fuzzy="searchForm.fuzzy" :inline="searchForm.inline" :label-width="searchForm.labelWidth" :item-width="searchForm.itemWidth" @search="handleSearch">
                <template v-for="item in searchFormSlot" :slot="item.slotName">
                  <slot :name="item.slotName" :item="item" />
                </template>
              </search-form>
            </template>
            <div v-if="$utils.isNotEmpty(searchToolbars) && searchToolbars" class="search-form-buttons buttons">
              <ibps-toolbar :actions="searchToolbars" :socpe="thatSocpe" :access-control="accessControl" :identity="identity" @action-event="handleActionEvent" />
            </div>
          </div>
          <slot name="header" />
        </div>
      </div>
      <div class="ibps-container-crud__body">
        <!--列表-->
        <el-table ref="elTable" v-loading="loading" v-bind="tableOptions" :data="ibpsData" :height="selfAdaption ? null : tableHeight" :row-class-name="tableRowClassName" @current-change="handleCurrentChange" @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange" @sort-change="handleSortChange" @cell-mouse-enter="handleCellMouseEnter" @cell-mouse-leave="handleCellMouseLeave" @cell-click="handleCellClick" @cell-dblclick="handleCellDblclick" @row-click="handleRowClick" @row-contextmenu="handleRowContextmenu" @row-dblclick="handleRowDblclick" @header-click="handleHeaderClick" @header-dragend="handleHeaderDragend" @header-contextmenu="handleHeaderContextmenu">
          <template slot="empty">
            <slot v-if="$slots.empty" name="empty" />
            <ibps-empty v-else />
          </template>
          <!--选择列 多选-->
          <el-table-column v-if="(selectionRow || selectionRow === '') && selectionType === 'checkbox'" v-bind="typeof selectionRow === 'Object' ? selectionRow : null" :label="handleAttribute(selectionRow.label, '')" :reserve-selection="selectionRow.reserveSelectione || false" type="selection" />
          <!--选择列 单选-->
          <el-table-column v-if="(selectionRow || selectionRow === '') && selectionType === 'radio'" :label="selectionRow.label || ''" :width="selectionRow.width || 55">
            <template slot-scope="scope">
              <el-radio v-model="selectionRadio" :label="getPkValue(scope.row)"><span>&nbsp;</span></el-radio>
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column v-if="indexRow || indexRow === ''" v-bind="typeof indexRow === 'Object' ? indexRow : null" :label="handleAttribute(indexRow.label, $t('components.crud.index'))" :width="handleAttribute(indexRow.label, 55)" type="index" />
          <slot name="prepend-column" />
          <template v-for="(column, index) in tableColumns">
            <el-table-column v-if="showColumn(column)" ref="el-table-column" :key="index" :prop="handleAttribute(column.prop, null)" :label="handleAttribute(column.label, '')" :width="handleAttribute(column.width, null)" :class-name="column.columClassName ? column.columClassName : ''" v-bind="column">
              <template slot="header">
                <slot :name="column.headerName" :column="column" />
              </template>
              <template slot-scope="scope">
                <!--时间格式-->
                <span v-if="column.dateFormat" class="ibps-table-column">
                  <el-link v-if="column.link" :type="column.type || 'primary'" :underline="column.underline || false" @click="handleColumnLink(column, scope.row)">
                    {{ scope.row[column.prop] | dateFormat(column.dateFormat, column.origDateFormat) }}
                  </el-link>
                  <span v-else>
                    {{ scope.row[column.prop] | dateFormat(column.dateFormat, column.origDateFormat) }}
                  </span>
                </span>
                <!--通用过滤器-->
                <span v-else-if="column.filter" class="ibps-table-column">
                  <el-link v-if="column.link" :type="column.type || 'primary'" :underline="column.underline || false" @click="handleColumnLink(column, scope.row)">
                    {{ handleColumnFilter(column.filter, scope.row[column.prop]) }}
                  </el-link>
                  <span v-else>
                    {{ handleColumnFilter(column.filter, scope.row[column.prop]) }}
                  </span>
                </span>
                <!-- 下拉组件-->
                <span v-else-if="column.options" class="ibps-table-column">
                  <!--stringArray 字符串类型的数组,逗号分隔-->
                  <template v-if="column.dataType === 'stringArray'">
                    <span v-for="(value, i) in handleColumnDataConvert(scope.row[column.prop], column.separator)" :key="i"> {{ handleColumnOptions('label', column.options, value, column) }}<template v-if="handleColumnDataConvert(scope.row[column.prop], column.separator).length - 1 !== i">,</template> </span>
                  </template>
                  <!--stringArray 字符串类型的数组-->
                  <template v-else-if="column.dataType === 'objectList'">
                    <span v-for="(value, j) in scope.row[column.prop]" :key="j">
                      {{ value[column.tagLabel] }}
                    </span>
                  </template>
                  <span v-else>{{ handleColumnOptions('label', column.options, scope.row[column.prop]) }}</span>
                </span>
                <!-- tags组件-->
                <span v-else-if="column.tags" class="ibps-table-column">
                  <span v-if="$utils.isEmpty(scope.row[column.prop])">{{ column.defaultLabel || '' }}</span>
                  <!--stringArray 字符串类型的数组-->
                  <template v-else-if="column.dataType === 'stringArray'">
                    <el-tag v-for="(value, i) in handleColumnDataConvert(scope.row[column.prop], column.separator)" :key="i" :type="handleColumnOptions('type', column.tags, value, column)">
                      {{ handleColumnOptions('label', column.tags, value, column) }}
                    </el-tag>
                  </template>
                  <!--stringArray 字符串类型的数组-->
                  <template v-else-if="column.dataType === 'objectList'">
                    <el-tag v-for="(value, j) in scope.row[column.prop]" :key="j">
                      {{ value[column.tagLabel] }}
                    </el-tag>
                  </template>
                  <template v-else>
                    <el-tag :type="handleColumnOptions('type', column.tags, scope.row[column.prop], column)">{{ handleColumnOptions('label', column.tags, scope.row[column.prop], column) }}</el-tag>
                  </template>
                </span>
                <!-- link组件-->
                <span v-else-if="column.link" class="ibps-table-column">
                  <el-link :type="column.type || 'primary'" :underline="column.underline || false" @click="handleColumnLink(column, scope.row)">
                    {{ scope.row[column.prop] | removeHtmlTag }}
                  </el-link>
                  <!-- <a href="javascript:void(0)" class="table-column-link" >{{}}</a> -->
                </span>
                <!-- 自定义slot组件-->
                <span v-else-if="column.slotName" class="ibps-table-column">
                  <slot :name="column.slotName" :row="scope.row" :value="scope.row[column.prop]" :column="column" :$index="scope.$index" />
                </span>
                <!--自定义组件-->
                <render-custom-component v-else-if="column.component && column.component.name" v-model="scope.row[column.prop]" :component-name="column.component.name" />
                <!--渲染组件-->
                <render-component v-else-if="column.component && column.component.render" :render-function="column.component.render" :scope="scope" />
                <template v-else>
                  {{ column.formatter ? column.formatter(scope.row, scope.column, _get(scope.row, column.prop), scope.$index) : _get(scope.row, column.prop) }}
                </template>
              </template>
              <!--子列 -->
              <template v-if="column.children">
                <el-table-column v-for="(column2, index2) in column.children" :key="index2" :label="handleAttribute(column2.title, '')" :prop="handleAttribute(column2.key, null)" v-bind="column2">
                  <template slot-scope="scope">
                    <!--过滤器-->
                    <span v-if="column2.filter">
                      {{ handleColumnFilter(column2.filter, scope.row[column2.prop]) }}
                    </span>
                    <!-- 下拉组件-->
                    <span v-else-if="column2.options" class="table-column-options">
                      <span>{{ handleColumnOptions('label', column2.options, scope.row[column2.prop]) }}</span>
                    </span>
                    <!-- tags组件-->
                    <span v-else-if="column2.tags" class="table-column-tags">
                      <el-tag :type="handleTags('type', column2.tags, scope.row[column2.prop])">{{ handleTags('label', column2.tags, scope.row[column2.prop]) }}</el-tag>
                    </span>
                    <!-- link组件-->
                    <span v-else-if="column2.link">
                      <a href="javascript:void(0)" class="table-column-link" @click="handleColumnLink(column2, scope.row)">{{ scope.row[column2.prop] }}</a>
                    </span>
                    <span v-else-if="column2.slotName">
                      <slot :name="column2.slotName" :row="scope.row" :$index="scope.$index" />
                    </span>
                    <!--自定义组件-->
                    <render-custom-component v-else-if="column2.component && column2.component.name" v-model="scope.row[column2.prop]" :component-name="column2.component.name" />
                    <!--渲染组件-->
                    <render-component v-else-if="column2.component && column2.component.render" :render-function="column2.component.render" :scope="scope" />
                    <template v-else>{{ column2.formatter ? column2.formatter(scope.row, scope.column2, _get(scope.row, column2.prop), scope.$index) : _get(scope.row, column2.prop) }}</template>
                  </template>
                </el-table-column>
                <!-- end 子列-->
              </template>
            </el-table-column>
          </template>
          <!--操作列begin-->
          <el-table-column v-if="rowHandle" v-bind="rowHandle" :label="handleAttribute(rowHandle.columnHeader, $t('components.crud.manage'))" :width="handleAttribute(rowHandle.width, rowHandleDefaultWidth)" :fixed="handleAttribute(rowHandle.fixed, 'right')" :align="handleAttribute(rowHandle.align, 'center')">
            <template #default="scope">
              <template v-if="hasRowHandleActions(scope.row)">
                <template v-if="rowHandle.effect === 'display'">
                  <ibps-toolbar :actions="getRowHandleActions(scope.row)" :socpe="thatSocpe" :data="scope.row" :access-control="accessControl" :identity="identity" :show-icon="rowHandle.showIcon" position="manage" type="link" @action-event="handleActionEvent" />
                  <template v-if="hasRowHandleMoreActions(scope.row)">
                    <el-divider direction="vertical" />
                    <el-dropdown>
                      <i class="el-icon-more el-dropdown-link" style="font-size: 16px" />
                      <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
                        <ibps-toolbar :actions="getRowHandleMoreActions(scope.row)" :socpe="thatSocpe" :data="scope.row" :access-control="accessControl" :identity="identity" :show-icon="rowHandle.showIcon" position="manage" @action-event="handleActionEvent" />
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </template>
                <!--下拉--->
                <template v-else>
                  <el-dropdown>
                    <i class="ibps-icon ibps-icon-chevron-circle-down" style="font-size: 16px" />
                    <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
                      <ibps-toolbar :actions="rowHandleActions" :socpe="thatSocpe" :data="scope.row" :access-control="accessControl" :identity="identity" position="manage" @action-event="handleActionEvent" />
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span>&nbsp;</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <!--操作列end-->
        </el-table>
      </div>
      <!--分页 或底部 自定义底部-->
      <div v-if="isShowPagination" ref="ibpsCrudFooter" class="ibps-container-crud__footer">
        <template v-if="$slots.footer">
          <slot name="footer" />
        </template>
        <el-pagination v-else :current-page="currentPage" :page-size="pageSize" :page-count="pagination[pageCountKey]" :total="pagination[totalKey]" v-bind="paginationOptions" @size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" @prev-click="handlePaginationPrevClick" @next-click="handlePaginationNextClick">
          <span class="el-pagination__total">{{ pageInfo }}</span>
        </el-pagination>
      </div>
    </div>
    <!--显示字段-->
    <display-field-dialog :visible="displayFieldVisible" :fields="columns" :data="displayFields" @callback="handleDisplayField" @close="visible => (displayFieldVisible = visible)" />
  </div>
</template>
<script>
import IbpsToolbar from '@platform/components/ibps-toolbar'
import IbpsEmpty from '@platform/components/ibps-empty'
import base from './mixin/base'
import handleRow from './mixin/handleRow'
import data from './mixin/data'
import search from './mixin/search'
import column from './mixin/column'
import pagination from './mixin/pagination'
import displayField from './mixin/displayField'
import utils from './mixin/utils'
import RenderComponent from './components/render-component.vue'
import RenderCustomComponent from './components/render-custom-component.vue'
import SearchForm from './components/search-form'
import DisplayFieldDialog from '@platform/components/ibps-display-field'
export default {
  name: 'IbpsCrud',
  components: {
    IbpsToolbar,
    IbpsEmpty,
    RenderComponent,
    RenderCustomComponent,
    SearchForm,
    DisplayFieldDialog
  },
  mixins: [base, data, search, column, handleRow, pagination, displayField, utils]
}
</script>
<style lang="scss" scoped>
.container-component {
  .ibps-container-crud {
    .toolbar-box {
      & > .ibps-crud-search-form {
        display: contents;
      }
      .search-form-buttons {
        float: none;
        display: contents;
      }
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        & > .ibps-crud-search-form {
          display: ruby-base-container;
        }
        .search-form-buttons {
          display: ruby-base-container;
        }
      }
    }
  }
}
</style>
