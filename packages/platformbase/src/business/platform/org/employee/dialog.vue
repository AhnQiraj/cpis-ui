<template>
  <ibps-selector-dialog :value="selectedValue" :visible="selectorVisible" v-bind="$props" :class="className" :label-key="labelKey" @input="value => (selectedValue = value)" @remove-select="setSelectRow" @close="handleClose" @action-event="handleActionEvent">
    <template slot-scope="scope">
      <ibps-selector-panel ref="panel" v-bind="scope" :party-type-id="partyTypeId" :seeting-search-party-type="seetingSearchPartyType" :current-org-id="currentOrgId" :external-use-id="externalUseId" :script="script" :form-data="formData" :pk-key="store === 'bind' ? 'name' : 'id'" :is-super-init-tree="isSuperInitTree" :show-tree="showTree" :options="options" :is-use-scope="isUseScope" :party-type-scope="partyTypeScope" :custom-party-type-options="customPartyTypeOptions" @selected="value => (selectedValue = value)" @change-party-type="changePartyType" />
    </template>
  </ibps-selector-dialog>
</template>
<script>
import IbpsSelectorDialog from '@platform/components/ibps-selector/dialog'
import IbpsSelectorPanel from './panel'
export default {
  components: {
    IbpsSelectorDialog,
    IbpsSelectorPanel
  },
  props: {
    formData: [Object, Array], // 所有字段数据,(包含主主子表)
    className: String,
    labelKey: {
      // 展示的值
      type: [String, Function],
      default: 'name'
    },
    store: {
      type: String,
      default: 'id'
    },
    filter: {
      type: Array,
      default: () => []
    },
    isUseScope: {
      // 是否启用范围
      type: Boolean,
      default: false
    },
    partyTypeScope: String,
    visible: Boolean, // 是否可见
    seetingSearchPartyType: String,
    script: String,
    partyTypeId: [String, Number],
    currentOrgId: [String, Number],
    // 外部用户id，上下级使用
    externalUseId: [String, Number],
    showTree: {
      type: Boolean,
      default: true
    },
    customPartyTypeOptions: [Object, Array],
    title: {
      // 标题
      type: String,
      default: '用户选择器'
    },
    marginTop: {
      // Dialog CSS 中的 margin-top 值
      type: String,
      default: '5vh'
    },
    width: {
      // 宽
      type: String,
      default: '60%'
    },
    height: {
      // 高
      type: String,
      default: '415px'
    },
    closeOnClickModal: {
      // 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      // 是否可以通过按下 ESC 关闭 Dialog
      type: Boolean,
      default: false
    },
    showClose: {
      // 是否显示关闭按钮
      type: Boolean,
      default: true
    },
    beforeClose: {
      // 关闭前的回调，会暂停 Dialog 的关闭
      type: Function
    },
    fullscreen: {
      // 是否为全屏 Dialog
      type: Boolean,
      default: false
    },
    valueKey: {
      // 唯一存储的值
      type: String,
      default: 'id'
    },
    value: {
      // value
      type: [Object, Array],
      default() {
        return this.multiple ? [] : {}
      }
    },
    cleanClose: {
      // 按钮清空并关闭
      type: Boolean,
      default: false
    },
    isSuperInitTree: Object,
    buttons: {
      // 按钮组
      type: Array
    },
    confirmButtonText: {
      type: String,
      default: '选择'
    },
    cleanButtonText: String,
    cancelButtonText: String,
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    // 额外配置
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectorVisible: false,
      selectedValue: this.multiple ? [] : {}
    }
  },
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.selectorVisible = this.visible
      },
      immediate: true
    },
    value: {
      handler: function (val, oldVal) {
        // const valueData = this.multiple ? val : [val]
        // const valueData = val
        this.selectedValue =
          this.store === 'bind'
            ? val.map(v => {
                const name = this.isString(v) ? v : v[this.valueKey]
                const data = {}
                data[this.valueKey] = name
                return data
              })
            : val
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.selectedValue = null
  },
  methods: {
    isString(v) {
      const Booleans = this.$utils.isString(v)
      return Booleans
    },
    setSelectRow() {
      this.$refs['panel'].setSelectRow()
    },
    handleClose(visible) {
      this.$emit('close', visible)
    },
    handleActionEvent(key, data) {
      if (key === 'clean') {
        this.setSelectRow()
      }
      this.$emit('action-event', key, data)
    },
    changePartyType(value) {
      this.$emit('change-party-type', value)
    }
  }
}
</script>
