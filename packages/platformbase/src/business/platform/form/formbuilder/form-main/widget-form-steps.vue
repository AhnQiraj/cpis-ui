<template>
  <div
    v-if="element && element.id"
    :key="element.id"
    class="widget-steps widget-view"
    :class="{active: selectWidget&&selectWidget.id === element.id}"
    :style="getPadding()"
    @click.stop="handleSelectWidget(index)"
  >
    <ibps-steps
      v-model="stepsActive"
      :space="element.field_options.space"
      :direction="element.field_options.direction"
      :align-center="element.field_options.align_center"
      :simple="element.field_options.simple"
      :disabled="false"
    >
      <ibps-step-pane
        v-for="(col, colIndex) in element.field_options.columns"
        :key="col.id?col.id:'_'+colIndex"
        :title="col.label"
        :name="colIndex+''"
      >
        <template v-if="stepsActive === colIndex">
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
      </ibps-step-pane>
      <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-steps-action">
        <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
      </div>
      <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-steps-drag">
        <i class="ibps-icon-arrows drag-widget" />
      </div>
    </ibps-steps>
  </div>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin],
  data() {
    return {
      stepsActive: 0
    }
  },
  watch: {
    element: {
      handler(val, oldVal) {
        this.field = val
        if (val !== oldVal && this.field && this.field.field_options && this.field.field_options.columns) {
          if (this.stepsActive + 1 > this.field.field_options.columns.length) {
            this.stepsActive--
          }
        }
      },
      deep: true
    },
    'element.active': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.stepsActive = this.$utils.isNotEmpty(val) ? val : 0
        }
      },
      immediate: true
    },
    stepsActive: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          if (this.element && this.$utils.isNotEmpty(this.element.active)) {
            this.element.active = val
          }
        }
      },
      immediate: true
    }
  }
}
</script>
