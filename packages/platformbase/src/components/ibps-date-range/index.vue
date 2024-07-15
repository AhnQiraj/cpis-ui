<template>
  <div
    ref="reference"
    class="el-range-editor el-input__inner"
    style="border: 0; padding: 0;border-radius: 0;"
  >
    <el-date-picker
      ref="start"
      :value="userInput && userInput[0]"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="startPlaceholder"
      :type="type"
      :format="format"
      :value-format="valueFormat"
      :prefix-icon="' '"
      class="el-range-input"
      @input="handleStartInput"
    />
    <slot name="range-separator">
      <span class="el-range-separator">{{ rangeSeparator }}</span>
    </slot>
    <el-date-picker
      :value="userInput && userInput[1]"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="endPlaceholder"
      :type="type"
      :prefix-icon="' '"
      :format="format"
      :value-format="valueFormat"
      class="el-range-input"
      @input="handleEndInput"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [Array, Date, String]
    },
    rangeSeparator: {
      type: String,
      default: '-'
    },
    id: {
      type: Array
    },
    name: {
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'year'
    },
    format: {
      type: String
    },
    valueFormat: {
      type: String
    },
    startPlaceholder: {
      type: String
    },
    endPlaceholder: {
      type: String
    }
  },
  data() {
    return {
      userInput: []
    }
  },
  computed: {
    firstInputId() {
      const obj = {}
      const id = this.id && this.id[0]
      if (id) {obj.id = id}
      return obj
    },
    secondInputId() {
      const obj = {}
      const id = this.id && this.id[1]
      if (id) {obj.id = id}
      return obj
    }
  },
  watch: {
    value(val) {
      if (this.$utils.isEmpty(val)) {
        this.userInput = [null, null]
      } else {
        if (Array.isArray(val)) {
          this.userInput = val
        } else {
          this.userInput = [this.$utils.isEmpty(val) ? null : val, null]
        }
      }
    },
    userInput: {
      handler(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.userInput = null
  },
  methods: {
    handleStartInput(value) {
      if (this.userInput) {
        this.userInput = [value, this.userInput[1]]
      } else {
        this.userInput = [value, null]
      }
    },
    handleEndInput(value) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], value]
      } else {
        this.userInput = [null, value]
      }
    }
  }
}
</script>
