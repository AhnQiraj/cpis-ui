<template>
  <div v-if="data" class="widget-form-container" :style="getStyle()">
    <div class="widget-form" :style="getShadowByName('shadow')+getBgColorByName('styleBgColor')">
      <div v-if="data && data.fields && data.fields.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
      <!-- 页眉 -->
      <div
        v-if="$utils.isNotEmpty(data.attrs.styles)
          && $utils.isNotEmpty(data.attrs.styles.headerDisplay)
          && data.attrs.styles.headerDisplay === 'show'"
        class="ibps-page-header"
      >
        <div
          v-if="data.attrs.styles.headerType === 'text'"
          class="page-header-text"
          :style="getStyleByName('headerTypeface', 'headerFontSize', 'headerBold', 'headerColor', 'headerAlignment')
            + getBgColorByName('headerBgColor')"
        >
          {{ data.attrs.styles.headerText }}
        </div>
        <div
          v-else-if="data.attrs.styles.headerType === 'sola'"
          class="page-header-sola"
          :style="'display: grid;' + getStyleByName('', '', '', '', 'headerLayout')
            + getBgColorByName('headerBgColor')"
        >
          <template v-for="(el, i) in getImageByName('headerPicture')">
            <el-image :key="i" fit="cover" style="width:100%;" :src="el" />
          </template>
        </div>
        <div
          v-else
          class="page-header-carousel"
        >
          <template v-if="$utils.isNotEmpty(data.attrs.styles.headerCarousel)">
            <el-carousel indicator-position="outside" trigger="click" height="300px">
              <el-carousel-item v-for="(item,i) in getImageByName('headerCarousel')" :key="i" :style="'text-align:center;'+getBgColorByName('headerBgColor')">
                <el-image fit="contain" style="height: 100%;" :src="item" />
              </el-carousel-item>
            </el-carousel>
          </template>
        </div>
      </div>
      <div
        v-if="hasHeader"
        class="form-header"
        @click="$emit('select-field')"
      >
        <div
          class="title"
          :class="titlePosition"
          :style="getStyleByName('titleTypeface','titleFontSize','titleBold','titleColor','titleAlignment')"
        >{{ data.name||'未设置表单标题' }}</div>
        <div v-if="hasDesc" ref="desc" class="desc " :class="getContractByName() && isFold? 'desc-details':''" v-html="$utils.formatText( data.desc )" />
        <div v-if="hasDesc && getContractByName() && isShow" class="desc-contract">
          <el-button v-if="isFold" type="text" @click="toggleIsFold">展开<i class="ibps-icon-angle-double-down" /></el-button>
          <el-button v-else type="text" @click="toggleIsFold">收起<i class="ibps-icon-angle-double-up" /></el-button>
        </div>
      </div>
      <el-form
        :size="data.attrs.size"
        :label-suffix="labelSuffix"
        :label-position="data.attrs.labelPosition"
        :label-width="data.attrs.labelWidth +( data.attrs.labelWidthUnit?data.attrs.labelWidthUnit:'px')"
        :status-icon="data.attrs.statusIcon"
        :hide-required-asterisk="hideRequiredAsterisk"
        :style="{flex: style.flex,display: style.display,flexDirection: style.flexDirection}"
        @submit.native.prevent
      >
        <vuedraggable
          :list="data.fields"
          v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :style="{flex: style.flex,display: style.display,flexDirection: style.flexDirection}"
          @end="handleMoveEnd"
          @add="handleWidgetAdd"
        >
          <transition-group
            name="fade"
            tag="div"
            class="widget-form-list"
            :style="`flex:${style.flex};`+getBgColorByName('styleBgColor')"
          >
            <template v-for="(el, i) in data.fields">
              <template v-if="el&& el.id">
                <!--嵌套布局-->
                <component
                  :is="'ibps-widget-form-'+el.field_type"
                  v-if="isNestedField(el.field_type)"
                  :key="el.id"
                  :element="el"
                  :select.sync="selectWidget"
                  :index="i"
                  :data="data"
                  :code="code"
                  :params="formParams"
                />
                <!--其他字段-->
                <ibps-widget-form-item
                  v-else
                  :key="el.id"
                  :element="el"
                  :select.sync="selectWidget"
                  :index="i"
                  :data="data"
                  :code="code"
                  :params="formParams"
                />
              </template>
            </template>
          </transition-group>
        </vuedraggable>
      </el-form>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Ids from 'ids'
import { isEqual, isFirefox } from 'element-ui/lib/utils/util'
import { on, off } from 'element-ui/lib/utils/dom'
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import { nestedFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import { getFieldInWidgetAdd } from '@platform/business/platform/form/formbuilder/utils/widgetAdd'
import Styles from '@platform/business/platform/form/utils/global-style'
import WidgetFormItem from './widget-form-item'
import WidgetFormGrid from './widget-form-grid'
import WidgetFormTabs from './widget-form-tabs'
import WidgetFormSteps from './widget-form-steps'
import WidgetFormCollapse from './widget-form-collapse'
import WidgetFormFieldset from './widget-form-fieldset'
import WidgetFormCard from './widget-form-card'
import WidgetFormTable from './widget-form-table'
import WidgetFormTablelayout from './widget-form-tablelayout'
Vue.component('IbpsWidgetFormItem', WidgetFormItem)
Vue.component('IbpsWidgetFormGrid', WidgetFormGrid)
Vue.component('IbpsWidgetFormTabs', WidgetFormTabs)
Vue.component('IbpsWidgetFormSteps', WidgetFormSteps)
Vue.component('IbpsWidgetFormCollapse', WidgetFormCollapse)
Vue.component('IbpsWidgetFormFieldset', WidgetFormFieldset)
Vue.component('IbpsWidgetFormCard', WidgetFormCard)
Vue.component('IbpsWidgetFormTable', WidgetFormTable)
Vue.component('IbpsWidgetFormTablelayout', WidgetFormTablelayout)
export default {
  props: {
    data: Object,
    select: Object,
    loading: Boolean
  },
  data() {
    return {
      selectWidget: this.select,
      minHeight: '500px',
      isFold: true,
      isShow: false,
      style: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column'
      }
    }
  },
  computed: {
    code() {
      return this.data.code
    },
    formAttrs() {
      return this.data ? this.data.attrs || {} : {}
    },
    styles() {
      return this.formAttrs.styles ? this.formAttrs.styles : {}
    },
    hasHeader() {
      return this.formAttrs && !this.formAttrs.hide_name
    },
    hasDesc() {
      return this.formAttrs && !this.formAttrs.hide_desc && this.data.desc
    },
    titlePosition() {
      const titlePosition = this.formAttrs.title_position
      if (titlePosition === 'center') {
        return 'ibps-tc'
      } else if (titlePosition === 'right') {
        return 'ibps-tr'
      } else {
        return ''
      }
    },
    labelSuffix() {
      return this.formAttrs ? (this.formAttrs.colon ? this.formAttrs.labelSuffix || ':' : '') : ''
    },
    hideRequiredAsterisk() {
      return this.$utils.toBoolean(this.formAttrs.hideRequiredAsterisk, false)
    },
    descPosition() {
      return this.$utils.isNotEmpty(this.formAttrs.descPosition) ? this.formAttrs.descPosition || 'inline' : 'inline'
    },
    formParams() {
      const params = {
        readonlyStyle: this.readonlyStyle,
        labelWidth: this.labelWidth,
        labelSuffix: this.labelSuffix,
        descPosition: this.descPosition,
        formAttrs: this.formAttrs
      }
      return Object.assign(params, this.params)
    }
  },
  watch: {
    select(val, oldVal) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal)) {
          return
        }
        this.$emit('update:select', val)
      },
      deep: true
    },
    'data.desc': {
      handler(val) {
        this.isTooLong()
      },
      deep: true
    }
  },
  mounted() {
    if (isFirefox) {
      on(document.body, 'drop', (event) => {
        event.preventDefault()
        event.stopPropagation()
      })
    }
    // this.minHeight = this.fixHeight()
    if (this.$el && this.$el instanceof Element) {
      addResizeListener(this.$el, this.handleHeightResize)
    }
    this.isTooLong()
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.handleHeightResize)
    if (isFirefox) {
      off(document.body, 'drop', (event) => {
        event.preventDefault()
        event.stopPropagation()
      })
    }
    this.selectWidget = null
  },
  methods: {
    isTooLong() {
      this.$nextTick(() => {
        const data = this.$refs.desc
        if (this.$utils.isNotEmpty(data) && this.$utils.isNotEmpty(data.scrollHeight)) {
          this.isShow = data.scrollHeight > 80
        } else {
          this.isShow = false
        }
      })
    },
    toggleIsFold() { // 改变标题描述的收缩显示
      this.isFold = !this.isFold
    },
    getContractByName() { // 通过name获取是否收缩标题描述
      let result = false
      if (this.$utils.isEmpty(this.styles)) {return result}
      if (this.$utils.isNotEmpty(this.styles.isFold) && this.styles.isFold) {
        result = true
      }
      return result
    },
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      return Styles.getStyleByName(this.styles, tfName, fsName, bName, cName, aName)
    },
    getImageByName(name) { // 通过name获取图片
      return Styles.getImageByName(this.styles, name)
    },
    getBgColorByName(name) { // 通过name获取底色
      return Styles.getBgColorByName(this.styles, name)
    },
    getShadowByName(name) { // 通过name获取阴影
      return Styles.getShadowByName(this.styles, name)
    },
    getStyle() { // 页面背景 + 表单全局-电脑宽度   样式
      return Styles.getStyle(this.styles)
    },
    handleHeightResize() {
      // this.minHeight = this.fixHeight()
      this.isTooLong()
    },
    fixHeight() {
      return (document.documentElement.clientHeight || document.body.clientHeight) - 100 + 'px'
    },
    isNestedField(fieldType) {
      return nestedFieldTypes.includes(fieldType) || fieldType === 'table'
    },
    handleMoveEnd({ newIndex, oldIndex }) {
      // console.log('index', newIndex, oldIndex)
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex
      const fieldType = this.data.fields[newIndex].field_type
      // 为拖拽到容器的元素添加唯一 id
      const id = new Ids([32, 36, 1]).next()
      const code = this.code
      const isSub = false
      // this.$set(this.data.fields, newIndex, {
      //   ...this.data.fields[newIndex],
      //   field_options: {
      //     ...this.data.fields[newIndex].field_options
      //   },
      //   id,
      //   code,
      //   isSub
      // })
      let temp = {
        ...this.data.fields[newIndex],
        field_options: {
          ...this.data.fields[newIndex].field_options
        },
        id,
        code,
        isSub
      }
      temp = getFieldInWidgetAdd(temp, fieldType)
      this.$set(this.data.fields, newIndex, temp)
      // // 单选、多选、下拉
      // if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
      //   this.$set(this.data.fields, newIndex, {
      //     ...this.data.fields[newIndex],
      //     field_options: {
      //       ...this.data.fields[newIndex].field_options,
      //       options: this.data.fields[newIndex].field_options.options.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 嵌套布局
      // } else if (nestedFieldTypes.includes(fieldType)) {
      //   this.$set(this.data.fields, newIndex, {
      //     ...this.data.fields[newIndex],
      //     name: fieldType + '_' + new Ids([32, 36, 1]).next(),
      //     active: getDefaultActive(fieldType),
      //     field_options: {
      //       ...this.data.fields[newIndex].field_options,
      //       columns: this.data.fields[newIndex].field_options.columns.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 子表单
      // } else if (fieldType === 'table') {
      //   this.$set(this.data.fields, newIndex, {
      //     ...this.data.fields[newIndex],
      //     field_options: {
      //       ...this.data.fields[newIndex].field_options,
      //       buttons: this.data.fields[newIndex].field_options.buttons.map(item => ({
      //         ...item
      //       })),
      //       columns: this.data.fields[newIndex].field_options.columns.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 审批意见
      // } else if (fieldType === 'approval_opinion') {
      //   this.$set(this.data.fields, newIndex, {
      //     ...this.data.fields[newIndex],
      //     name: fieldType + '_' + new Ids([32, 36, 1]).next(),
      //     field_options: {
      //       ...this.data.fields[newIndex].field_options,
      //       options: this.data.fields[newIndex].field_options.options.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      //   // 需要处理name的字段
      // } else if (!needModelFieldTypes.includes(fieldType)) {
      //   this.$set(this.data.fields, newIndex, {
      //     ...this.data.fields[newIndex],
      //     name: fieldType + '_' + new Ids([32, 36, 1]).next()
      //   })
      // }
      this.selectWidget = this.data.fields[newIndex]
    },
    handleWidgetDelete(index) {
      let selectWidget = {}
      if (this.data.fields.length - 1 === index) {
        selectWidget = index === 0 ? {} : this.data.fields[index - 1]
      } else {
        selectWidget = this.data.fields[index + 1]
      }
      this.selectWidget = selectWidget
      this.$nextTick(() => {
        // eslint-disable-next-line vue/no-mutating-props
        this.data.fields.splice(index, 1)
      })
    }
  }
}
</script>
<style lang="scss">
  @import "@platform/assets/styles/components/form-generation";
</style>
