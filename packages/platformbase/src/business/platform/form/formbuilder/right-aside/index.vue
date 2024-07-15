<template>
  <div :style="{ width:`${width}px`}">
    <el-tabs v-model="activeName" type="border-card" class="formbuilder-tab-container" @tab-click="clickTab">
      <el-tab-pane :style="{ width:`${width}px`}" label="字段配置" class="field-config" name="field-config">
        <template v-if="hasField">
          <template v-if="switchingField">
            <component
              :is="fieldType"
              v-if="switchingField"
              v-loading="loading"
              :field-item="curField"
              :bo-data="boData"
              :fields="formFields"
              :form-type="formType"
              size="mini"
              label-position="right"
              label-width="100px"
              @update="updateSelectField"
              @select="updateSelectField"
            />
            <template v-else>
              <div
                v-loading="true"
                element-loading-text="加载中"
                style="height:300px;"
              />
            </template>
          </template>
          <template v-else>
            <div
              v-loading="true"
              element-loading-text="加载中"
              style="height:300px;"
            />
          </template>
        </template>
        <p v-else class="empty-field" data-content="请选择或拖入控件" />
      </el-tab-pane>
      <el-tab-pane :style="{ width:`${width}px`}" :label="formTypeMap[formType]+'属性'" class="form-property" name="form-property">
        <form-property
          :id="id"
          :data="data"
          :bo-data="boData"
          :form-type="formType"
          @update="updateFormDef"
        />
      </el-tab-pane>
      <el-tab-pane :style="{ width:`${width}px`}" label="表单样式" class="global-style" name="global-style">
        <global-style
          :data="data"
          @update="updateFormDef"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import { camelCase, upperFirst } from 'lodash'
import FieldTypes from './field-types'
import FormProperty from './propertys'
import GlobalStyle from './global-style'
import { formTypeMap } from '@platform/business/platform/form/constants/fieldOptions'
Vue.component('HelpTip', () => import('./components/help-tip.vue'))
export default {
  name: 'RightAside',
  components: Object.assign(FieldTypes, {
    FormProperty,
    GlobalStyle
  }),
  props: {
    id: String,
    data: Object,
    select: Object,
    asideActiveName: String,
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
      curField: null,
      width: 350,
      switchingField: false,
      loading: true,
      activeName: 'form-property',
      formTypeMap: formTypeMap
    }
  },
  computed: {
    fieldType() {
      const name = camelCase(this.curField.field_type)
      return `ibps-field-${name}`
    },
    hasField() {
      if (!this.curField) {
        return false
      }
      const componentName = upperFirst(camelCase(this.fieldType))
      return !!this.$options.components[componentName]
    },
    formFields() {
      return this.data.fields || []
    }
  },
  watch: {
    select(val, oldVal) {
      this.loading = true
      this.curField = val
      if (val !== oldVal) {
        this.switchingField = false
        setTimeout(() => {
          this.switchingField = true
          this.loading = false
        }, 100)
      } else {
        setTimeout(() => {
          this.loading = false
        }, 100)
      }
    },
    asideActiveName: {
      handler: function(val, oldVal) {
        this.activeName = this.asideActiveName
      },
      immediate: true
    },
    activeName(val, oldVal) {
      this.$emit('active-name', val)
    }
  },
  beforeDestroy() {
    this.curField = null
  },
  methods: {
    clickTab(tab) {
      if (tab.name === 'field-config' && !this.hasField && this.data.fields && this.data.fields.length > 0) {
        this.updateSelectField(this.data.fields[0])
      }
    },
    updateFormDef(data) {
      this.$emit('update-form-def', data)
    },
    updateSelectField(field) {
      this.$emit('update:select', field)
    }
  }
}
</script>
<style scoped>
  .empty-field {
      position: relative;
      opacity: 0.5;
      box-shadow: none;
      height: 100%;
    }
  .empty-field:after {
    content: attr(data-content);
    position: absolute;
    text-align: center;
    top: 40%;
    left: 0;
    width: 100%;
    font-size: 18px;
  }
</style>
