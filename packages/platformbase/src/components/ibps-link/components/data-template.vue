<template>
  <data-template-render
    v-if="$utils.isNotEmpty(dataTemplate)"
    :data="dataTemplate"
    :dynamic-params="dynamicData"
    :params="dynamicParams"
    :preview="preview"
    :access-control="accessControl"
    :height="templateHeight"
  />
</template>
<script>
import { getBuildDataByKey } from '@platform/api/platform/data/dataTemplate'
import { getFormDataByFormKey } from '@platform/api/platform/form/formDef'
import { buildFelds } from '@platform/business/platform/data/templaterender/utils'
import Vue from 'vue'
Vue.component('DataTemplateRender', () => import('@platform/business/platform/data/templaterender'))
export default {
  props: {
    config: {
      type: Object
    },
    dynamicData: {
      type: Object
    },
    preview: {
      type: Boolean
    },
    fullscreen: {
      type: Boolean
    },
    height: {
      type: String
    },
    titleHeight: {
      type: Number,
      default: 0
    },
    dynamicParams: Object
  },
  data() {
    return {
      dataTemplate: {},
      dataTemplateKey: '',
      accessControl: false
    }
  },
  computed: {
    templateHeight() {
      const height = parseInt(this.height || '80')
      const h = height <= 100 ? document.body.clientHeight : height
      const vh = this.fullscreen ? height === 100 ? 0 : (document.body.clientHeight / 100 * 7) : 0
      return h - vh - this.titleHeight
    }
  },
  watch: {
    config: {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(val)) {return}
        this.dataTemplateKey = val.bind_template_key
        this.loadDataTemplate()
      },
      immediate: true
    }
  },
  // mounted() {
  //   this.loadDataTemplate()
  // },
  methods: {
    loadDataTemplate() {
      const loading = this.$loading({
        lock: false,
        background: 'transparent'
      })
      this.dataTemplate = {}
      getBuildDataByKey({
        dataTemplateKey: this.dataTemplateKey,
        isFilterForm: false,
        isRightsFilter: true
      }).then(response => {
        // 从后台获取数据
        const data = this.$utils.parseData(response.data)
        if (data && data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
          getFormDataByFormKey({
            formKey: data.attrs.form_key
          }).then(response => {
            const formData = this.$utils.parseData(response.data)
            const datasets = buildFelds(formData.fields, data.datasets)
            data.datasets = datasets
            this.dataTemplate = data
            setTimeout(() => {
              loading.close()
            }, 1000)
          }).catch(() => {
            loading.close()
          })
        } else {
          this.dataTemplate = data
          setTimeout(() => {
            loading.close()
          }, 1000)
        }
      }).catch(() => {
        loading.close()
      })
    },
    buildFelds(fields, datasets) {
      const fieldMap = {}
      fields.forEach(field => {
        if (field.field_type === 'grid' || field.field_type === 'tabs') {
          field.field_options.columns.forEach(column => {
            column.fields.forEach(cfield => {
              fieldMap[cfield.field_name] = cfield
            })
          })
        } else {
          fieldMap[field.field_name] = field
        }
      })
      const rtn = []
      datasets.forEach(dataset => {
        const field = fieldMap[dataset.name]
        if (this.$utils.isNotEmpty(field)) {
          dataset.field_type = field.field_type
          dataset.field_options = field.field_options
        }
        rtn.push(dataset)
      })
      return rtn
    }
  }
}
</script>
<style lang="scss" >
  .data-template-renderer-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__headerbtn{
      z-index: 9999;
    }
  }
</style>
