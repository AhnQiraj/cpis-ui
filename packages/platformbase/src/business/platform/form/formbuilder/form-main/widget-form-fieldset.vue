<template>
  <div
    v-if="element && element.id"
    :id="element.id"
    :key="element.id"
    class="widget-fieldset widget-view"
    :class="{
      active: selectWidget&&selectWidget.id == element.id
    }"
    :style="getPadding()"
    @click.stop="handleSelectWidget(index)"
  >
    <fieldset
      class="ibps-fieldset"
      :class=" [
        element.field_options.border_style ? 'ibps-fieldset--' + element.field_options.border_style : ''
      ]"
    >
      <legend
        :class="[
          'ibps-fieldset--'+element.field_options.type,
          'ibps-fieldset--'+element.field_options.position,
        ]"
      >{{ element.label }}
        <ibps-help v-if="element && element.desc && descPosition==='lableIcon'" :content="$utils.formatText(element.desc)" />
      </legend>
      <div v-if="element && element.desc && descPosition==='inline' " class="ibps-fieldset--desc" v-html="$utils.formatText( element.desc )" />
      <div
        v-if="element&&element.field_options&&element.field_options.split_line"
        class="ibps-divider"
        :class="'ibps-'+element.field_options.line_style||'dashed'"
      />
      <div v-for="(col, colIndex) in element.field_options.columns" :key="col.id?col.id:'_'+colIndex">
        <vuedraggable
          v-model="col.fields"
          no-transition-on-drag
          v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
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
      </div>
      <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-collapse-action">
        <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
      </div>
      <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-collapse-drag">
        <i class="ibps-icon-arrows drag-widget" />
      </div>
    </fieldset>
  </div>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin],
  data() {
    return {
      activeNames: []
    }
  },
  beforeDestroy() {
    this.activeNames = null
  },
  methods: {
    isActive(name) {
      return this.activeNames.indexOf(name) === -1
    },
    onCollapseClick(item) {
      const activeNames = this.activeNames.slice(0)
      const index = activeNames.indexOf(item.name)
      if (index > -1) {
        activeNames.splice(index, 1)
      } else {
        activeNames.push(item.name)
      }
      this.activeNames = [].concat(activeNames)
    }
  }
}
</script>
