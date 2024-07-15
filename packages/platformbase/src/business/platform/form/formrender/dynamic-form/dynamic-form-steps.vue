<template>
  <ibps-steps
    v-show="ruleDisplay !== 'hidden'"
    :space="field.field_options.space"
    :direction="field.field_options.direction"
    :align-center="field.field_options.align_center"
    :simple="field.field_options.simple"
    :process-status="field.field_options.process_status"
    :finish-status="field.field_options.finish_status"
    :active="activeStep"
    class="ibps-mb-10"
    :class="field.field_options.custom_class"
    :style="getRuleStyle()+getPadding()"
    @step-click="clickStep"
  >
    <ibps-step-pane
      v-for="(col, colIndex) in field.field_options.columns"
      :key="col.id?col.id:'_'+colIndex"
      :title="col.label"
      :name="col.name?col.name:'steps_'+colIndex"
      class="ibps-mt-10 ibps-mb-10"
    >
      <template v-for="item in col.fields">
        <!--嵌套布局-->
        <component
          :is="'ibps-dynamic-form-'+item.field_type"
          v-if="isNestedField(item.field_type)"
          :ref="'formItem'+item.name"
          :key="item.name"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :main-code="mainCode"
          :form-data="formData"
          :params="params"
          :table-params="tableParams"
          v-on="$listeners"
        />
        <!--其他类型-->
        <ibps-dynamic-form-item
          v-else
          :ref="'formItem'+item.name"
          :key="item.name"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :main-code="mainCode"
          :form-data="formData"
          :params="params"
          :table-params="tableParams"
          v-on="$listeners"
        />
      </template>
    </ibps-step-pane>
  </ibps-steps>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      activeStep: 0
    }
  },
  computed: {
    readonlyRights() {
      return this.params ? this.params.readonly || false : false
    }
  },
  watch: {
    curActiveStep: {
      handler(val) {
        this.activeStep = val
      },
      immediate: true
    },
    activeStep(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('update:cur-active-step', val)
      }
    }
  },
  methods: {
    clickStep(stepIndex) {
      if (this.readonlyRights) {
        this.activeStep = stepIndex
      } else {
        if (this.field.field_options.finish_click && stepIndex < this.activeStep) {
          this.activeStep = stepIndex
        }
      }
    }
  }
}
</script>
