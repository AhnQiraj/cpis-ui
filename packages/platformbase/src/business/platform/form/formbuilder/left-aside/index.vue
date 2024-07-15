<template>
  <div :style="{ width:`${width}px`}">
    <el-tabs v-model="activeTabName" type="border-card" class="formbuilder-tab-container">
      <el-tab-pane
        :style="{ width:`${width-3}px`}"
        label="表单控件"
        name="fieldType"
        class="field-type-container"
      >
        <el-scrollbar
          style="height: 100%;width:100%;"
          wrap-class="ibps-scrollbar-wrapper "
        >
          <div
            v-for="fieldType in fieldTypes"
            :key="fieldType.key"
            class="panel panel-default"
          >
            <div class="panel-heading">{{ fieldType.label }}
              <el-tooltip
                :content="fieldType.tip"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </div>
            <div class="panel-body">
              <vuedraggable
                tag="ul"
                :list="fieldType.fields"
                v-bind="{group:{ name:'field', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
              >
                <li
                  v-for="(item, index) in fieldType.fields"
                  :key="index"
                  :class="'data-'+item.field_type"
                  class="form-edit-widget-label"
                >
                  <a>
                    <i class="ibps-icon" :class="item.icon" />
                    <span>{{ (fieldType.fields)[index].label }}</span>
                  </a>
                </li>
              </vuedraggable>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane v-if="formType !=='combination'" :style="{ width:`${width-3}px`}" label="业务对象" name="bo">
        <el-scrollbar
          style="height: 100%;width:100%;"
          wrap-class="ibps-scrollbar-wrapper"
        >
          <el-tree
            :data="boTreeData"
            :props="{
              children: 'children',
              label: 'name'
            }"
            default-expand-all
            @node-click="handleBoClick"
          >
            <span slot-scope="{ node ,data}" class="el-tree-node__label">
              <i :class="'ibps-icon-'+data.type" />
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 常量
import FIELD_TYPES from '../../constants/fieldTypes'
import GROUP_FIELDS from '../constants/groupFields'
import { getDefaultAttributes } from '../utils'
import TreeUtils from '@platform/utils/tree'
export default {
  name: 'LeftAside',
  props: {
    boData: {
      type: Array
    },
    formType: {
      type: String,
      default: 'form'
    }
  },
  data() {
    return {
      width: 220,
      activeTabName: 'fieldType',
      fieldTypes: []
    }
  },
  computed: {
    boTreeData() {
      return TreeUtils.transformToTreeFormat(this.boData, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    }
  },
  created() {
    this.initData()
  },
  beforeDestroy() {
    this.fieldTypes = null
  },
  methods: {
    /**
     * 初始化数据
     */
    initData() {
      this.initFieldTypes()
    },
    initFieldTypes() {
      const groupFieldMap = {}
      for (const key in FIELD_TYPES) { // 对字段进行分组处理
        const field = FIELD_TYPES[key]
        if (!field.form_type || field.form_type.includes(this.formType)) {
          field.field_type = key
          field.is_input = typeof (field.is_input) === 'boolean' ? field.is_input : true
          const groupKey = field.group || 'common'
          const newField = JSON.parse(JSON.stringify(getDefaultAttributes(field, this.formType)))
          if (!groupFieldMap[groupKey]) {groupFieldMap[groupKey] = []}
          groupFieldMap[groupKey].push(newField)
        }
      }
      const fieldTypes = []
      // 合并分组
      for (const key in GROUP_FIELDS) {
        const groupField = GROUP_FIELDS[key]
        if (!groupField) {
          continue
        }
        groupField.key = key
        groupField.fields = groupFieldMap[key] || []
        if (groupField.fields && groupField.fields.length > 0) {
          fieldTypes.push(groupField)
        }
      }
      this.fieldTypes = fieldTypes
    },
    /**
     * 新增字段
     */
    addField(field) {
      this.$emit('add-field', {
        field: getDefaultAttributes(field, this.formType)
      })
    },
    /**
     * 设置bo的对象属性
     */
    handleBoClick(data) {
      this.$emit('set-field', data)
    }
  }
}
</script>
<style lang="scss" scoped>
  .field-col {
    padding: 5px;
    padding-left:10px !important;
  }
  .field-button {
    width: 95px;
    overflow: hidden;
    padding: 8px;
    text-align: left;
  }
</style>
