<template>
  <div class="interface-request-restful">
    <div class="container-radiogroup">
      <el-radio-group v-model="requestType">
        <el-radio-button v-if="hasBody" label="body">Body</el-radio-button>
        <el-radio-button label="query">Query</el-radio-button>
        <el-radio-button label="headers">Headers</el-radio-button>
      </el-radio-group>
    </div>
    <template v-if="requestType==='body'">
      <div class="ibps-p-10">
        <el-radio-group v-model="formData.bodyType" :disabled="readonly" @change="changeBodyType">
          <el-radio
            v-for="item in bodyTypeOptions"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </div>
      <parameter v-if="formData.bodyType==='form'" :dropdown-fields="dropdownFields" :data.sync="formData.bodyData" :readonly="readonly" :type="type" :request-type="requestType" />
      <json v-else ref="json" :dropdown-fields="dropdownFields" :data.sync="formData.bodyData" :readonly="readonly" :type="type" />
    </template>
    <template v-else-if="requestType==='query'">
      <parameter :data.sync="formData.querys" :dropdown-fields="dropdownFields" :readonly="readonly" :type="type" :request-type="requestType" />
    </template>
    <template v-else-if="requestType==='headers'">
      <parameter :data.sync="formData.headers" :readonly="readonly" :type="type" :request-type="requestType" />
    </template>
  </div>
</template>
<script>
import Parameter from '@platform/business/platform/form/components/interface/components/parameter'
import Json from '@platform/business/platform/form/components/interface/components/json'
export default {
  components: {
    Parameter,
    Json
  },
  props: {
    value: [Array, Object],
    method: {
      type: String,
      default: 'GET'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    },
    dropdownFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      bodyTypeOptions: [
        {
          value: 'form',
          label: 'form'
        },
        {
          value: 'json',
          label: 'json'
        }
        //  {
        //   value: 'file',
        //   label: 'file'
        // },
        // {
        //   value: 'raw',
        //   label: 'raw'
        // }
      ],
      requestType: 'query',
      formData: {
        bodyType: 'form', // body 类型
        bodyData: [], // body 类型数据【包含form，json，file，raw】
        querys: [],
        headers: []
      }
    }
  },
  computed: {
    hasBody() {
      return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(this.method)
    }
  },
  watch: {
    method(val, oldVal) {
      if (val !== oldVal) {
        this.requestType = this.hasBody ? 'body' : 'query'
      }
    },
    value: {
      handler: function(val) {
        this.formData = val
      },
      immediate: true,
      deep: true
    },
    formData: {
      handler: function(val, oldVal) {
        this.$emit('update:value', val)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.requestType = this.hasBody ? 'body' : 'query'
    // this.formData = this.value
  },
  beforeDestroy() {
    this.bodyTypeOptions = null
    this.formData = null
  },
  methods: {
    changeBodyType(value) {
      this.formData.bodyData = []
    },
    getData() {
      const data = JSON.parse(JSON.stringify(this.formData))
      if (!this.hasBody) {
        data['bodyType'] = 'form'
        data['bodyData'] = []
      }
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
  .container-radiogroup{
    text-align: center;
    margin-bottom: .16rem;
  }
</style>
