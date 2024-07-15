<template>
  <div
    v-if="element && element.id"
    :key="element.id"
    class="widget-tabs widget-view"
    :class="{active: selectWidget&&selectWidget.id === element.id}"
    :style="getPadding()"
    @click.stop="handleSelectWidget(index)"
  >
    <el-tabs
      v-model="tabsActive"
      :type="element.field_options.type"
      :tab-position="element.field_options.position"
      :stretch="element.field_options.stretch"
    >
      <el-tab-pane
        v-for="(col, colIndex) in element.field_options.columns"
        :key="col.id?col.id:'_'+colIndex"
        :label="col.label"
        :name="nameKey+colIndex"
      >
        <template v-if="tabsActive === (nameKey+colIndex)">
          <vuedraggable
            v-model="col.fields"
            v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
            no-transition-on-drag
            @end="handleWidgetNestedMoveEnd($event, element, colIndex)"
            @add="handleWidgetNestedAdd($event, element, colIndex)"
          >
            <transition-group name="fade" tag="div" class="widget-col-list">
              <template v-for="(el, i) in col.fields">
                <template v-if="el&& el.id">
                  <!--嵌套布局-->
                  <component
                    :is="'ibps-widget-form-'+el.field_type"
                    v-if="isNestedField(el.field_type)"
                    :key="el.id"
                    :element="el"
                    :select.sync="selectWidget"
                    :index="i"
                    :data="col"
                    :code="code"
                    :is-sub="isSub"
                    :params="params"
                  />
                  <!--其他字段-->
                  <ibps-widget-form-item
                    v-else
                    :key="el.id"
                    :element="el"
                    :select.sync="selectWidget"
                    :index="i"
                    :data="col"
                    :code="code"
                    :is-sub="isSub"
                    :params="params"
                  />
                </template>
              </template>
            </transition-group>
          </vuedraggable>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-tabs-action">
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-tabs-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin],
  data() {
    return {
      nameKey: 'tabs_',
      tabsActive: 'tabs_0'
    }
  },
  watch: {
    element: {
      handler(val, oldVal) {
        this.field = val
        if (val !== oldVal && this.field && this.field.field_options && this.field.field_options.columns) {
          // 处理 选项卡选择bug
          const curActive = parseInt(this.tabsActive.split('_')[1])
          if (curActive + 1 > this.field.field_options.columns.length) {
            this.tabsActive = this.nameKey + (curActive - 1)
          }
        }
      },
      immediate: true,
      deep: true
    },
    'element.active': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.tabsActive = val || this.nameKey + '0'
        }
      },
      immediate: true
    },
    tabsActive: {
      handler(val, oldVal) {
        if (val !== oldVal && this.element && this.$utils.isNotEmpty(this.element.active)) {
          this.element.active = val
        }
      },
      immediate: true
    }
  }
}
</script>
