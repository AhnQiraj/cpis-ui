<template>
  <ibps-container v-loading="loading" type="full" class="ibps-card-list-container">
    <!-- 分页和查询-->
    <div slot="header" class="ibps-card-list__header">
      <el-row type="flex">
        <el-col :span="14">
          <span>
            <h5 class="ibps-card-list__title">{{ title }}</h5>
            <template v-if="$slots.searchForm">
              <slot :loading="loading" name="searchForm" />
            </template>
            <template v-else>
              <el-form ref="searchForm" :model="searchFormData" inline class="search-form" @submit.native.prevent>
                <el-form-item>
                  <el-input v-model="searchFormData[searchForm['prop']]" :placeholder="searchForm['label']" :name="searchForm['prop']" clearable style="width: 250px" @keyup.enter.native="handleActionEvent({ key: 'search' }, 'toolbar')">
                    <el-button slot="append" icon="el-icon-search" @click="handleActionEvent({ key: 'search' }, 'toolbar')" />
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <ibps-toolbar :actions="toolbars" :socpe="thatSocpe" :identity="identity" @action-event="handleActionEvent" />
                </el-form-item>
              </el-form>
            </template>
          </span>
        </el-col>
        <el-col :span="10">
          <el-pagination v-bind="paginationOptions" :current-page="currentPage" :page-size="pageSize" :page-count="pagination[pageCountKey] || 3" :total="pagination[totalKey]" :small="handleAttribute(paginationOptions.small, true)" @size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" @prev-click="handlePaginationPrevClick" @next-click="handlePaginationNextClick" />
        </el-col>
      </el-row>
    </div>
    <ibps-layout ref="layout">
      <div>
        <!--添加-->
        <div :style="hasPermission({ key: 'addForm' }) ? 'pointer-events : none' : ''" class="ibps-card ibps-card-create" @click="handleActionEvent({ key: 'add' }, 'toolbar')">
          <i class="el-icon-plus" />
          <span>{{ createText }}</span>
        </div>
        <!--列表-->
        <ul class="ibps-card-list ibps-card-list--picture-card">
          <li
            v-for="(data, index) in ibpsData"
            :key="data[pkKey]"
            :class="{
              checked: selections ? selections.indexOf(data[pkKey]) > -1 : false
            }"
            class="ibps-card-list__item"
            @click="handleActionEvent({ key: 'edit' }, 'manage', data)"
          >
            <a class="ibps-card-list__item-title el-tooltip" @click.stop="handleCheck(data[pkKey])">
              {{ data[columns[0].prop] }}
              <label class="ibps-card-list__item-status-label">
                <i class="el-icon-check checked-status" />
              </label>
            </a>
            <div class="ibps-card-list__item-symbol">
              <slot :data="data" name="item-symbol">
                <i class="symbol-icon ibps-icon-table" />
              </slot>
            </div>
            <slot :data="data" name="item-left" />
            <div class="ibps-card-list__item-action" @click.stop="void 0">
              <el-dropdown
                v-if="rowHandleActions"
                @command="
                  (action, instance) => {
                    handleActionEvent(action, 'manage', data, index, instance)
                  }
                "
              >
                <i class="ibps-icon-cog" />
                <el-dropdown-menu slot="dropdown">
                  <template v-for="action in rowHandle.actions">
                    <el-dropdown-item :key="action.key" v-permission="getPermissionKey(action)" :command="action" :icon="action.icon" :disabled="action.disabled" :divided="action.divided">
                      {{ action.label }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </li>
        </ul>
      </div>
      <template v-if="$slots.east" slot="east">
        <slot name="east" />
      </template>
    </ibps-layout>
  </ibps-container>
</template>
<script>
import IbpsToolbar from '../ibps-toolbar/index.vue'
import base from './mixin/base'
import search from './mixin/search'
import handleRow from './mixin/handleRow'
import data from './mixin/data'
import column from './mixin/column'
import pagination from './mixin/pagination'
import utils from './mixin/utils'
export default {
  components: {
    IbpsToolbar
  },
  mixins: [base, search, data, column, handleRow, pagination, utils]
}
</script>
