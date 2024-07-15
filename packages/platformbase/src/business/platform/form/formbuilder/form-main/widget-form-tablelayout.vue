<template>
  <div
    v-if="element && element.id"
    :id="element.id"
    :key="element.id"
    :class="{active: selectWidget&&selectWidget.id == element.id}"
    class="widget-layout-table widget-view"
    @click.stop="handleSelectWidget(index)"
  >
    <table
      class="widget-layout-table-view"
      :class="{
        bright: element.field_options.bright,
        small: element.field_options.small,
        bordered: element.field_options.bordered
      }"
    >
      <tr
        v-for="(trItem, trIndex) in element.field_options.trs"
        :key="trIndex"
      >
        <td
          v-for="(tdItem, tdIndex) in trItem.tds"
          :key="tdIndex"
          class="widget-layout-table-td"
          :colspan="tdItem.colspan"
          :rowspan="tdItem.rowspan"
        >
          <vuedraggable
            v-model="tdItem.fields"
            tag="div"
            no-transition-on-drag
            v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
            @end="handleWidgetNestedMoveEnd($event, element, tdIndex)"
            @add="handleWidgetNestedAdd($event, element, tdIndex)"
          >
            <transition-group name="fade" tag="div" class="widget-layout-table-list">
              <template v-for="(el, i) in tdItem.fields">
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
        </td>
      </tr>
    </table>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-col-action">
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-col-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin]
}
</script>
